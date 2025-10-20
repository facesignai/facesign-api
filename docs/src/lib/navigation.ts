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
    title: 'Main',
    links: [
      { title: 'Documentation', href: '/docs' },
      { title: 'API Reference', href: '/api' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'GitHub', href: 'https://github.com/facesignai/api' },
      { title: 'NPM Package', href: 'https://www.npmjs.com/package/@facesignai/api' },
      { title: 'Support', href: 'mailto:support@facesign.ai' },
    ],
  },
] 