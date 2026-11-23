import { site } from './site'

// ─── HERO ───────────────────────────────────────────────────────
// Four numbers, each one defensible in an interview.

export const heroStats = [
  { value: 7, suffix: '', label: 'EU markets live' },
  { value: 700, suffix: '', label: 'Peak daily users' },
  { value: 4, suffix: '', label: 'Apps owned in prod' },
  { value: 15, suffix: ' days', label: 'Solo build to ship' },
] as const

// ─── ABOUT ──────────────────────────────────────────────────────

export const about = {
  opener:
    "I'm a frontend engineer in Delhi who has spent the last three years shipping software that field technicians and insurance agents open at 7am and can't afford to watch spin.",
  paragraphs: [
    'My day job is one of the least glamorous corners of the web, and I like it that way: real-time dispatch for field-service operations across seven European markets. Jobs arrive as WebSocket events while the user is looking at the screen. SLA timers run. If the map stutters, somebody misses a service window.',
    'I joined as an associate and was promoted to senior in 18 months. The work that got me there was not a framework upgrade. It was earning the right to own a system end to end: writing the acceptance criteria, arguing with backend about the API contract, and shipping a whole internal product alone in fifteen days.',
    'I use AI tooling the way I use a compiler: as leverage on mechanical work, never as a substitute for understanding the system. That distinction is the subject of the internal talk I gave to leadership, and of how I review code today.',
  ],
  principles: [
    {
      title: 'Ship the boring version first',
      body: 'A loading state that is honest beats a skeleton that lies about what is coming.',
    },
    {
      title: 'Own the contract, not just the component',
      body: 'Most frontend bugs are coordination bugs. I push API shapes to be explicit before the first line of UI exists.',
    },
    {
      title: 'Performance is a feature with a budget',
      body: 'Bundle and LCP budgets live in CI. If a change breaks the budget, the change is wrong.',
    },
    {
      title: 'Accessibility is not a phase',
      body: 'Keyboard paths, focus order and contrast are acceptance criteria, not a follow-up ticket.',
    },
  ],
}

// ─── CASE STUDIES ───────────────────────────────────────────────
// The differentiator: decisions and trade-offs, not a feature list.

export const projects = [
  {
    id: 'apexon',
    name: 'ApexOn',
    headline: 'An F1 companion app built for the 90 seconds before lights out',
    role: 'Solo developer',
    timeframe: '2025 — present',
    status: 'live',
    context:
      'Official F1 coverage is built for broadcast, not for phones. Fans arrive in a burst on race weekend, want timing, standings and context, then leave. Existing apps are heavy, ad-saturated and assume you already know the sport. I wanted one page that answers "what is happening right now" for someone who has never watched a race and still satisfies someone who has.',
    decisions: [
      'Batched and cached the ergast/Jolpica timing calls behind a single schedule model so a race weekend costs one upstream fetch per viewer, not one per widget — the API is rate-limited and its cold-start latency is measured in seconds, so the cache is the feature.',
      'Progressive disclosure instead of a beginner/expert toggle: rules, team radio and history sit behind inline expansions, so a first-time viewer is never shown a glossary they did not ask for and a veteran never has to dismiss one.',
      'The AI assistant is scoped to a retrieval context of the current session’s data rather than open-ended chat, which keeps answers grounded in real standings and cuts fabricated responses to near zero on the questions fans actually ask.',
      'Static-first delivery on Netlify with route-level code splitting; the timing view is the only chunk that ships heavy charting, so the landing page stays under 100 kB gzipped.',
    ],
    impact: [
      { value: '4 pages', label: 'Shipped surfaces', source: 'Live site' },
      { value: '< 100 kB', label: 'Landing-page JS (gzipped)', source: 'Bundle audit' },
      { value: '1 fetch', label: 'Per viewer per race weekend', source: 'Cache design' },
    ],
    stack: ['React', 'TypeScript', 'Charting', 'Retrieval-scoped AI', 'Netlify'],
    links: [
      { label: 'Live site', href: site.links.apaxonLive, kind: 'live' },
      { label: 'Source', href: site.links.apaxonRepo, kind: 'code' },
    ],
  },
  {
    id: 'field-dispatch',
    name: 'Field Dispatch Platform',
    headline: 'Real-time job dispatch for seven markets, without a page refresh',
    role: 'Frontend lead',
    timeframe: '2025 — present',
    status: 'internal',
    context:
      'Field-service coordinators ran their day from a screen that had to be reloaded to see new jobs. Work arrived by phone and by spreadsheet, and the gap between a technician finishing a job and the dispatcher knowing about it was measured in minutes. The team was also moving four applications from React 16 to React 19 at the same time.',
    decisions: [
      'Modelled the SignalR connection as a single app-level subscription with per-screen subscribers rather than a connection per component — connection storms under a shared enterprise SSO session were the first thing that broke in staging.',
      'Treated SLA timers as server-authoritative with client-side interpolation: the clock renders locally for smoothness but reconciles against every server event, so a sleeping laptop never shows a stale countdown.',
      'Sequenced the React 16→19 migration by route, not by component, so each slice could ship behind a flag with the old tree still mounted — zero regressions reached production across two applications.',
      'Split the map layer into its own lazily-loaded boundary. It was the single largest dependency and was only needed once a coordinator opened the live board.',
    ],
    impact: [
      { value: '7', label: 'Markets live simultaneously', source: 'Production footprint' },
      { value: '500–700', label: 'Daily active coordinators', source: 'Product analytics' },
      { value: '0', label: 'Regressions in the React 19 cutover', source: 'Release record' },
    ],
    stack: ['React 19', 'TypeScript', 'SignalR', 'Redux Toolkit', 'Entra SSO', 'i18n'],
    links: [],
    notes:
      'Client engagement, described by domain rather than by name per my employment agreement. ' +
      'The React 16→19 migration was my work; the platform it runs on was not — sizing, ' +
      'backend and the SignalR hubs were shared across the team.',
  },
  {
    id: 'asset-portal',
    name: 'Asset Management Portal',
    headline: 'A whole internal product, designed and shipped alone in fifteen days',
    role: 'Sole frontend engineer',
    timeframe: '2025',
    status: 'internal',
    context:
      'The organisation tracked physical assets across sites in spreadsheets that three teams edited simultaneously. Nobody could answer "where is this asset and who signed for it" without a meeting. There was no designer allocated, no frontend resource except me, and the business needed it before a quarterly audit.',
    decisions: [
      'Ran the requirements conversation myself and wrote the acceptance criteria, which surfaced that the real need was an auditable custody trail, not the inventory grid everyone had asked for.',
      'Built an eleven-component library (table, filter bar, custody timeline, drawer, empty and error states) before the first screen, so the remaining CRUD surfaces took hours instead of days and stayed visually consistent.',
      'Pushed a paginated, filter-aware API contract on the backend team early rather than accepting a single unfiltered endpoint — the grid would have shipped unusable on real data volumes.',
    ],
    impact: [
      { value: '15', label: 'Days from kickoff to production', source: 'Delivery record' },
      { value: '11', label: 'Reusable components extracted', source: 'Component library' },
      { value: '3→1', label: 'Sources of truth consolidated', source: 'Business outcome' },
    ],
    stack: ['React', 'TypeScript', 'Redux Toolkit', 'SCSS Modules', 'REST API'],
    links: [],
    notes: 'Internal tooling — described by domain and outcome only.',
  },
] as const

// ─── EXPERIENCE ─────────────────────────────────────────────────
// Dates are YYYY-MM and rendered from data. No hand-written ranges that
// can drift out of sync with each other.

export const experience = [
  {
    id: 'senior',
    role: 'Senior Software Engineer, Frontend',
    company: site.employer.current,
    location: 'Hyderabad, India · remote across EU',
    start: '2025-08',
    end: null,
    employment: 'full-time',
    summary:
      'Frontend lead across four production React and TypeScript applications for a European field-service client operating in seven markets.',
    highlights: [
      'Own the real-time dispatch surface end to end: SignalR job pushes, interactive map, SLA timers and in-app messaging for 500–700 daily active coordinators.',
      'Led the React 16→19 migration across two applications — route-scoped cutover behind flags, hooks and concurrent patterns adopted incrementally, Jest coverage raised rather than lowered on the way through.',
      'Sole frontend engineer on an internal asset management product: requirements, UX flows, an eleven-component library, the backend API contract, and delivery to production in fifteen days.',
      'Introduced AI-assisted workflows for test generation and migration analysis; presented the framework internally to engineering leadership and business stakeholders.',
      'Own the bundle and Core Web Vitals budgets in CI — regressions fail the pipeline rather than being discovered in a quarterly report.',
    ],
    stack: [
      'React 19',
      'TypeScript',
      'SignalR',
      'Redux Toolkit',
      'Entra SSO',
      'Firebase',
      'Jest',
    ],
    promotion: { title: 'Promoted to Senior', date: '2025-08' },
  },
  {
    id: 'associate',
    role: 'Associate Software Engineer, React',
    company: site.employer.previous,
    location: 'Hyderabad, India',
    start: '2023-08',
    end: '2025-07',
    employment: 'full-time',
    summary:
      'Joined the Hyderabad frontend cohort and was contributing to client-facing production code within the first month.',
    highlights: [
      'Built responsive, accessible React and TypeScript UI for enterprise insurance dashboards with full i18n across multiple languages.',
      'Acted as the technical-business bridge in Scrum ceremonies: authored acceptance criteria, ran edge-case analysis, and kept defect rates low across sprint cycles.',
      'Started formalising AI-assisted development practices — test generation, documentation and review augmentation — that later became an internal engineering initiative.',
    ],
    stack: ['React 16–18', 'TypeScript', 'i18n', 'Auth0', 'Jest', 'Azure DevOps'],
  },
] as const

// ─── SKILLS ─────────────────────────────────────────────────────
// Levels are honest. `expert` is reserved for things I would defend in
// a design review.

export const skillGroups = [
  {
    id: 'core',
    title: 'Core',
    skills: [
      { name: 'TypeScript', level: 'expert', years: 3.5 },
      { name: 'React (16 → 19)', level: 'expert', years: 3.5 },
      { name: 'JavaScript (ES2023)', level: 'expert', years: 4 },
      { name: 'HTML & CSS', level: 'expert', years: 5 },
    ],
  },
  {
    id: 'architecture',
    title: 'Architecture & state',
    skills: [
      { name: 'Redux Toolkit', level: 'proficient', years: 3 },
      { name: 'TanStack Query', level: 'proficient', years: 2 },
      { name: 'Component library design', level: 'proficient', years: 2 },
      { name: 'SCSS Modules / Tailwind', level: 'proficient', years: 3 },
    ],
  },
  {
    id: 'realtime',
    title: 'Real-time & auth',
    skills: [
      { name: 'SignalR / WebSockets', level: 'proficient', years: 2 },
      { name: 'Microsoft Entra SSO', level: 'proficient', years: 2 },
      { name: 'Auth0', level: 'working', years: 1.5 },
      { name: 'Firebase', level: 'working', years: 2 },
    ],
  },
  {
    id: 'quality',
    title: 'Quality & delivery',
    skills: [
      { name: 'Jest + Testing Library', level: 'proficient', years: 3 },
      { name: 'Accessibility (WCAG AA)', level: 'proficient', years: 2 },
      { name: 'Core Web Vitals tuning', level: 'proficient', years: 2 },
      { name: 'CI/CD (Azure DevOps, GitHub Actions)', level: 'proficient', years: 3 },
    ],
  },
  {
    id: 'ai',
    title: 'AI-assisted engineering',
    skills: [
      { name: 'Test generation workflows', level: 'proficient', years: 2 },
      { name: 'Retrieval-scoped assistants', level: 'working', years: 1 },
      { name: 'Copilot / Claude / GPT in review', level: 'proficient', years: 2 },
    ],
  },
] as const

// ─── RECOGNITION ────────────────────────────────────────────────

export const achievements = [
  {
    id: 'promotion',
    title: 'Promoted to Senior Software Engineer',
    issuer: site.employer.current,
    date: '2025-08',
  },
  {
    id: 'top-performer',
    title: 'Top-performer rating (2-star)',
    issuer: site.employer.current,
    date: '2026-01',
  },
  {
    id: 'az900',
    title: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft',
    date: '2024-06',
  },
  {
    id: 'ai-talk',
    title: 'Presented AI-assisted engineering workflow to engineering leadership',
    issuer: site.employer.current,
    date: '2026-03',
  },
  {
    id: 'data-digest',
    title: 'First place, Data Digest technical competition',
    issuer: "Ebullience '23 · NIET",
    date: '2023-05',
  },
  {
    id: 'seminar',
    title: 'International seminar presenter, sewage-cleaning robot',
    issuer: 'Japan Patent Office & Ministry of Commerce, Govt. of India',
    date: '2019-11',
  },
] as const

// ─── EDUCATION ──────────────────────────────────────────────────

export const education = [
  {
    id: 'btech',
    qualification: 'B.Tech, Computer Science (AI & ML)',
    institution: 'Noida Institute of Engineering & Technology',
    location: 'Greater Noida, India',
    start: '2020',
    end: '2024',
  },
] as const

// ─── TESTIMONIALS ───────────────────────────────────────────────
// Empty until real quotes with written permission exist. The section
// renders nothing rather than a placeholder — an empty state on a
// portfolio is a credibility leak.

export const testimonials: {
  id: string
  quote: string
  author: string
  title: string
  permissionGranted: true
}[] = []

// ─── FAQ ────────────────────────────────────────────────────────

export const faqs = [
  {
    question: 'Are you open to relocation or on-site work?',
    answer:
      'I am based in Delhi NCR and work remote-first today, overlapping with EU and UK mornings. I am open to relocation within India or the EU for the right role, and to hybrid arrangements where the team is already distributed.',
  },
  {
    question: 'What kind of frontend work do you want next?',
    answer:
      'Systems with real operational stakes and a real user in the loop: real-time dashboards, complex data surfaces, design systems that other teams build on. I am less interested in marketing sites and more interested in products where a rendering bug costs somebody money.',
  },
  {
    question: 'Do you work with AI tooling, and how?',
    answer:
      'Yes, deliberately and with limits. I use it for test generation, migration analysis, boilerplate and review passes on mechanical changes. I do not use it to make architectural decisions or to produce code I cannot defend line by line in a review.',
  },
  {
    question: 'How do you handle a design with no accessibility thought behind it?',
    answer:
      'I raise it in refinement, not in QA. Contrast, focus order and keyboard paths go into the acceptance criteria so they are part of the estimate rather than a hidden cost after the demo.',
  },
] as const

export const contactChannels = [
  { id: 'email', label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { id: 'linkedin', label: 'LinkedIn', value: 'in/yash-sonkhiya', href: site.links.linkedin },
  { id: 'github', label: 'GitHub', value: '@ysonkhiya122', href: site.links.github },
] as const
