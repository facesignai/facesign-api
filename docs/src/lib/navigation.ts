interface NavigationLink {
  title: string
  href: string
  label?: string
}

interface NavigationSection {
  title: string
  links: NavigationLink[]
}

export const navigation: NavigationSection[] = [
  {
    title: 'Getting Started',
    links: [
      { title: 'Introduction', href: '/' },
      { title: 'Quick Start', href: '/quickstart' },
      { title: 'Python Installation', href: '/quickstart/python-installation' },
      { title: 'Go Installation', href: '/quickstart/go-installation' },
      { title: 'Authentication', href: '/authentication' },
      { title: 'Error Handling', href: '/errors' },
    ],
  },
  {
    title: 'Core API',
    links: [
      { title: 'Sessions', href: '/sessions' },
      { title: 'Client Secrets', href: '/client-secrets' },
      { title: 'Webhooks', href: '/webhooks' },
      { title: 'Languages', href: '/languages' },
      { title: 'Avatars', href: '/avatars' },
    ],
  },
  {
    title: 'Verification Flows',
    links: [
      { title: 'Flows Overview', href: '/flows' },
      { title: 'Legacy Modules', href: '/modules' },
      { title: 'Email Verification', href: '/modules/email-verification' },
      { title: 'SMS Verification', href: '/modules/sms-verification' },
      { title: 'Identity Verification', href: '/modules/identity-verification', label: 'Beta' },
      { title: 'Document Authentication', href: '/modules/document-authentication', label: 'Beta' },
    ],
  },
  {
    title: 'Advanced Features',
    links: [
      { title: 'Session Customization', href: '/customization' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'API Reference', href: '/api-reference' },
      { title: 'SDKs', href: '/sdks' },
    ],
  },
] 