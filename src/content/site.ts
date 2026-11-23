/**
 * Single source of truth for identity, availability and links.
 *
 * Everything user-facing that appears in more than one place lives here.
 * Nothing else in the codebase should hardcode an email, a URL or a
 * job title.
 */
export const site = {
  name: 'Yash Sonkhiya',
  shortName: 'Yash',
  initials: 'YS',
  role: 'Frontend Engineer',
  roleLong: 'Senior Frontend Engineer',
  tagline: 'I build the interfaces people rely on when downtime is not an option.',

  /** Canonical origin — used for SEO, OG tags and structured data. */
  url: 'https://yash-sonkhiya.com',

  /**
   * Employer, named. Set `current` to the real company name.
   * `client` is the enterprise client the team ships for.
   */
  employer: {
    current: 'Accenture',
    previous: 'Accenture',
    clientDescriptor: 'a European field-service enterprise',
  },

  location: {
    city: 'Delhi',
    country: 'India',
    region: 'NCR',
    timezone: 'Asia/Kolkata',
    remoteNote: 'Remote-first · comfortable across EU/UK overlap hours',
  },

  availability: {
    open: true,
    status: 'Open to senior frontend roles',
    responseTime: 'I reply within one working day.',
  },

  email: 'yashsonkhiya2195@gmail.com',

  links: {
    github: 'https://github.com/ysonkhiya122',
    linkedin: 'https://linkedin.com/in/yash-sonkhiya',
    apaxonLive: 'https://apexon.netlify.app/',
    apaxonRepo: 'https://github.com/ysonkhiya122/ApexOn',
  },
} as const

export const mailto = `mailto:${site.email}`
