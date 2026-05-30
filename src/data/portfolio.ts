import type {
  ExperienceItem,
  Project,
  SkillGroup,
  Achievement,
  EducationItem,
  ContactLink,
} from '@/types'

// ─── EXPERIENCE ─────────────────────────────────────────────────
// Client and internal project names are intentionally generalised.
// Specific tooling, scale metrics, and delivery outcomes are retained
// as they represent your individual engineering contribution.

export const experience: ExperienceItem[] = [
  {
    id: 'senior-swe',
    period: 'Apr 2026 – Present',
    company: 'Global IT Consultancy',
    location: 'Hyderabad, India',
    role: 'Senior Software Engineer — Frontend',
    type: 'current',
    badgeLabel: 'Promoted · Apr 2026',
    badgeVariant: 'green',
    summary:
      'Lead frontend engineer across four production React + TypeScript applications for a major European enterprise client operating across seven countries.',
    bullets: [
      'Architected and delivered a <strong>real-time field-service dispatch platform</strong> with SignalR WebSocket job updates, interactive map integration, and SLA timers — serving 500–700 daily active users across seven European markets simultaneously.',
      'Led a <strong>React 16-to-19 migration</strong> on two enterprise applications: resolved breaking changes, refactored to modern hooks and concurrent patterns, and raised Jest coverage — zero production regressions on delivery.',
      'Sole frontend engineer on an <strong>internal asset management tool</strong>: designed UX flows, built a reusable component library, guided backend API contracts for production scale, and shipped the complete frontend in 15 days.',
      'Implemented <strong>enterprise SSO, Redux Toolkit state management, Firebase</strong>, code splitting, and performance optimisation across the full application portfolio.',
      'Engineered <strong>GenAI-assisted development workflows</strong> (GitHub Copilot, ChatGPT, Claude) for automated test generation and migration analysis — reducing dev overhead by 15% QoQ and code-breaking incidents by 40%. Workflow presented internally as an engineering innovation.',
      'Recognised with a <strong>2-star top-performer rating</strong> (Jan 2026) and promoted to Senior SWE in April 2026 at 18 months — above the average pace for the band.',
    ],
  },
  {
    id: 'associate-swe',
    period: 'Aug 2023 – Mar 2026',
    company: 'Global IT Consultancy',
    location: 'Hyderabad, India',
    role: 'Associate Software Engineer — React Developer',
    type: 'previous',
    badgeLabel: 'Associate SWE',
    badgeVariant: 'blue',
    summary:
      'Joined as part of the Hyderabad frontend cohort and rapidly onboarded onto client-facing European projects, contributing to production codebases within weeks.',
    bullets: [
      'Delivered responsive, accessible UI components using React and TypeScript for enterprise-scale insurance dashboards with full i18n multi-language support.',
      'Facilitated Agile/Scrum ceremonies as a technical-business bridge: authored acceptance criteria, led edge-case analysis, and maintained consistently low defect rates across sprint cycles.',
      'Began formalising AI-assisted development practices — test generation, documentation, and code review augmentation — that would later be presented to leadership as an engineering innovation initiative.',
    ],
  },
]

// ─── PROJECTS ───────────────────────────────────────────────────
// Professional client work is described by domain and outcome only.
// No client names, internal tool names, or proprietary system identifiers.

export const projects: Project[] = [
  {
    id: 'raceiq',
    number: 'Featured — 001',
    label: 'Personal Project',
    name: 'RaceIQ',
    subtitle: 'F1 Intelligence Dashboard',
    description:
      'An AI-powered Formula 1 analytics platform combining live race data with historical records. Users ask plain-English questions and receive AI-generated insights backed by dynamic charts — driver comparisons, constructor standings, and lap-time visualisations.',
    tags: ['React 18', 'TypeScript', 'OpenAI API', 'React Query', 'Recharts', 'Tailwind CSS', 'Vercel'],
    links: [
      { label: 'GitHub', href: 'https://github.com/ysonkhiya122' },
      { label: 'Live demo', href: '#' },
    ],
    featured: true,
  },
  {
    id: 'dispatch-platform',
    number: 'Professional — 002',
    label: 'Enterprise · Real-time',
    name: 'Field Dispatch Platform',
    subtitle: 'Real-time Emergency Operations',
    description:
      'A real-time mission management platform for field-service operations. Features SignalR WebSocket job updates, interactive map overlays, SLA timers, and in-app communication panels — live across multiple European markets.',
    tags: ['React', 'TypeScript', 'SignalR', 'WebSockets', 'Auth SSO', 'i18n'],
    links: [],
    note: 'Production · Enterprise engagement',
  },
  {
    id: 'asset-tool',
    number: 'Professional — 003',
    label: 'Enterprise · Internal tooling',
    name: 'Asset Management Portal',
    subtitle: 'Internal Operations Platform',
    description:
      'Sole frontend engineer on an internal operations tool. Designed the UX from scratch, built a reusable component library, guided backend API design for scale, and shipped the complete frontend independently in 15 days.',
    tags: ['React', 'TypeScript', 'Redux Toolkit', 'Component Library', 'REST API'],
    links: [],
    note: 'Internal · 15-day solo delivery',
  },
]

// ─── SKILLS ─────────────────────────────────────────────────────
export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    title: 'Languages',
    skills: ['JavaScript (ES6+)', 'TypeScript', 'HTML5 & CSS3'],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    skills: ['React.js (v16–19)', 'Redux Toolkit', 'React Query', 'Tailwind CSS', 'SCSS / CSS Modules'],
  },
  {
    id: 'auth-realtime',
    title: 'Auth & Real-time',
    skills: ['Auth0', 'Microsoft Entra SSO', 'SignalR WebSockets', 'Firebase'],
  },
  {
    id: 'testing',
    title: 'Testing',
    skills: ['Jest', 'React Testing Library', 'Unit Testing', 'Component Testing'],
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud',
    skills: ['Azure DevOps (Repos & Boards)', 'CI/CD Pipelines', 'Microsoft Azure (AZ-900)', 'Vercel · Git'],
  },
  {
    id: 'ai',
    title: 'AI-assisted dev',
    skills: ['GitHub Copilot', 'Prompt Engineering', 'AI test generation', 'AI code review'],
  },
]

// ─── ACHIEVEMENTS ───────────────────────────────────────────────
export const achievements: Achievement[] = [
  {
    id: 'promotion',
    icon: '↑',
    title: 'Promoted to Senior Software Engineer',
    subtitle: 'April 2026 · 18 months — above-average pace for the engineering band',
  },
  {
    id: 'top-performer',
    icon: '★',
    title: '2-Star Top-Performer Rating',
    subtitle: 'Annual review cycle · January 2026',
  },
  {
    id: 'genai-presenter',
    icon: '◈',
    title: 'GenAI Innovation Presenter',
    subtitle: 'AI-assisted development workflow presented to senior leadership & business stakeholders · 2026',
  },
  {
    id: 'az900',
    icon: 'Az',
    title: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
    subtitle: '2024',
  },
  {
    id: 'learning-badge',
    icon: '◉',
    title: 'Bronze Learning Badge — 200+ Development Hours',
    subtitle: 'Professional development · Q3 2025',
  },
  {
    id: 'data-digest',
    icon: '①',
    title: '1st Position — Data Digest Competition',
    subtitle: "Ebullience'23 Technical Fest · NIET · May 2023",
  },
  {
    id: 'international',
    icon: '⊕',
    title: 'International Seminar Presenter',
    subtitle: 'Sewage Cleaning Robot · Japan Patent Office & Ministry of Commerce, Govt. of India · 2019',
  },
]

// ─── EDUCATION ──────────────────────────────────────────────────
export const education: EducationItem[] = [
  {
    id: 'btech',
    period: '2020 – 2024',
    degree: 'B.Tech — Computer Science (AI & ML)',
    institution: 'Noida Institute of Engineering & Technology',
    location: 'Uttar Pradesh, India',
  },
  {
    id: 'hsc',
    period: '2020',
    degree: 'Higher Secondary Certificate (PCM)',
    institution: 'Lovely Public Senior Secondary School',
    location: 'Delhi, India',
  },
]

// ─── CONTACT ────────────────────────────────────────────────────
export const contactLinks: ContactLink[] = [
  {
    id: 'email',
    label: 'Email',
    value: 'yashsonkhiya2195@gmail.com',
    href: 'mailto:yashsonkhiya2195@gmail.com',
    icon: '@',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/yash-sonkhiya',
    href: 'https://linkedin.com/in/yash-sonkhiya',
    icon: 'in',
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'github.com/ysonkhiya122',
    href: 'https://github.com/ysonkhiya122',
    icon: '{ }',
  },
  {
    id: 'location',
    label: 'Location',
    value: 'Delhi, India · Open to remote',
    icon: '◎',
  },
]
