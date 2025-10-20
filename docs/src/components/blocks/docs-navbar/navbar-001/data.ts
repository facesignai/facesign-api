export interface NavLink {
  href: string
  label: string
  isActive?: boolean
}

export const externalLinks: NavLink[] = [
  { href: '#support', label: 'Support' },
  { href: '#blog', label: 'Blog' },
  { href: '#about', label: 'About' },
]

export const docsLinks: NavLink[] = [
  { href: '#documentation', label: 'Documentation', isActive: true },
  { href: '#api-reference', label: 'API Reference' },
]
