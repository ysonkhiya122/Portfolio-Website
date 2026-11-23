/**
 * Engineering notes.
 *
 * Short, opinionated write-ups that demonstrate reasoning in text. Each
 * one is a real decision I made and can defend, written to be useful to
 * someone facing the same problem — not a summary of a blog post I read.
 *
 * To add one: append an entry, then run `npm run build:pages` (or
 * `npm run build`) to regenerate the static HTML and sitemap.
 */

export interface Note {
  slug: string
  title: string
  summary: string
  /** ISO date, used for ordering and for <time>. */
  date: string
  readingMinutes: number
  tags: string[]
  /** Paragraphs. `## ` prefix renders a section heading. */
  body: string[]
}

export const notes: Note[] = [
  {
    slug: 'one-signalr-connection',
    title: 'One SignalR connection, not one per component',
    summary:
      'Connecting to a WebSocket from each widget is the obvious approach and it falls over the first time an enterprise SSO session is shared across tabs.',
    date: '2026-10-14',
    readingMinutes: 4,
    tags: ['real-time', 'architecture'],
    body: [
      'The first version of our dispatch board opened a SignalR connection inside the component that needed live job updates. Two components needed them, so we got two connections. It worked in development, where one browser tab and one user represented the whole system.',
      'In staging, coordinators share an enterprise SSO session across tabs, and several of them work the same board during peak. Hub connection limits are per user, not per tab. The second tab began failing handshakes, the client retried, and the retries read to the server as a burst. Nothing crashed. Updates just stopped arriving for some users, which is worse.',
      '## The shape we moved to',
      'A single connection is owned by the application, established after auth resolves and torn down on sign-out. Screens subscribe to topics rather than open sockets: the connection multiplexes, and each screen unsubscribes when it unmounts. Reconnection is handled once, in one place, with exponential backoff and a jitter term — without jitter, every tab recovers in lockstep and you rebuild the thundering herd you just tried to avoid.',
      '## What this cost',
      'One extra layer of indirection. A screen can no longer assume a live connection the moment it mounts, so every consumer handles three states: connecting, live, and degraded. That sounds like overhead until you remember the alternative was a silent failure mode where the UI looks correct and is simply out of date.',
      '## What I would do differently',
      'Model the connection state as a first-class part of the UI from the first sprint. A stale-data indicator is not a nice-to-have when the data is the product; it is the difference between a coordinator trusting the board and a coordinator phoning the technician to check.',
    ],
  },
  {
    slug: 'server-authoritative-timers',
    title: 'SLA timers should be server-authoritative, and interpolate locally',
    summary:
      'A countdown rendered purely on the client drifts. A countdown that ticks from the server jitters. You need both, and the reconciliation rule matters more than the clock.',
    date: '2026-09-02',
    readingMinutes: 3,
    tags: ['real-time', 'correctness'],
    body: [
      'An SLA timer is a promise with money attached. If the display says four minutes remaining and the system has already breached, the interface has lied to the person accountable for it.',
      'Client-side countdowns drift for boring reasons: a sleeping laptop, a background tab throttled by the browser, a clock that is set wrong. And a coordinator leaving a board open overnight will find a countdown that is wrong by hours.',
      '## The rule',
      'The server owns the deadline. Every event that can affect it — job assigned, technician en route, job paused — includes the authoritative deadline as an absolute timestamp. The client renders locally between events for smoothness, using a monotonic clock where available, and reconciles on every server message.',
      'Two details that matter:',
      'Use `performance.now()` for the tick, not `Date.now()`. The former cannot be moved by a system clock change. Anchor it to a server timestamp on each event and the display stays smooth without ever disagreeing with the server for more than one event interval.',
      'Treat a late event as a correction, not an increment. If the new deadline moves backwards, do not animate it — snap and briefly highlight. An animated correction is indistinguishable from a normal tick.',
      '## The lesson',
      'The interesting engineering in a real-time system is almost never the transport. It is deciding which side is the source of truth, and being explicit about what happens when they disagree.',
    ],
  },
  {
    slug: 'react-16-to-19-by-route',
    title: 'Migrating React 16 to 19 by route, not by component',
    summary:
      'A component-by-component migration means two versions of React in one tree. Cutting over per route let both versions ship side by side with no regressions.',
    date: '2026-07-21',
    readingMinutes: 5,
    tags: ['react', 'migration'],
    body: [
      'Two enterprise applications needed to leave React 16. The obvious plan — upgrade the dependency and fix errors until the build passes — produces a single unmergeable branch and a release freeze measured in weeks.',
      'We had an advantage: the applications were already route-split. That made a different strategy possible.',
      '## The approach',
      'A feature flag selected the React tree per route. Migrated routes rendered under React 19; everything else stayed on 16. The shell owned the router and the auth provider, and those boundaries were the only places the two trees touched.',
      'The order was deliberate. Start with a route that is important enough to prove the approach and shallow enough to finish in a week. We picked the settings surface. Success there bought credibility for the routes that actually carried risk.',
      '## What actually broke',
      'Not the lifecycle methods — a codemod handled most of those. What broke was implicit behaviour:',
      'String refs and `findDOMNode` usage in a shared charting wrapper that three teams imported. Nobody owned it, so nobody had looked at it in years.',
      'A context consumer relying on the legacy `contextTypes` API, in a component that appeared in exactly one route and had never been touched.',
      'Test utilities that assumed `ReactDOM.render`. These were the highest volume of changes and the lowest risk, which is the best kind of work to parallelise.',
      '## Rules that kept it honest',
      'No route was marked complete until its Jest coverage was at or above the pre-migration number. We were not going to trade test coverage for a dependency version.',
      'Every flag was removed within two sprints of its route going fully live. A permanent flag is technical debt that looks like flexibility.',
      '## The result',
      'Zero regressions reached production across two applications. The thing that made that possible was not skill, it was sequencing: making the blast radius of any single change small enough that a mistake was cheap.',
    ],
  },
]

export const noteSlugs = notes.map((note) => note.slug)
