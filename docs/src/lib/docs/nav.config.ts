export interface NavNode {
  label: string
  href: string
  children?: NavNode[]
}

export const navTree: NavNode[] = [
  {
    label: 'Getting Started',
    href: '/docs',
    children: [
      { label: 'Introduction', href: '/docs' },
      { label: 'Quick Start', href: '/quickstart' },
      { label: 'Authentication', href: '/authentication' },
    ],
  },
  {
    label: 'Core Concepts',
    href: '/docs',
    children: [
      { label: 'Sessions', href: '/docs/sessions' },
      { label: 'Flows', href: '/docs/flows' },
      { label: 'Webhooks', href: '/webhooks' },
    ],
  },
]

export function findPrevNext(flat: string[]): (path: string) => { prev?: { href: string; label: string }; next?: { href: string; label: string } } {
  return (path: string) => {
    const idx = flat.indexOf(path)
    if (idx === -1) return {}
    const prevHref = idx > 0 ? flat[idx - 1] : undefined
    const nextHref = idx < flat.length - 1 ? flat[idx + 1] : undefined
    const labelFromHref = (href: string) => href.split('/').filter(Boolean).slice(-1)[0]?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || href
    return {
      prev: prevHref ? { href: prevHref, label: labelFromHref(prevHref) } : undefined,
      next: nextHref ? { href: nextHref, label: labelFromHref(nextHref) } : undefined,
    }
  }
}


