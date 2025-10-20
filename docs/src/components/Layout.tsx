'use client'

import { motion } from 'framer-motion'
// no-op
import { usePathname } from 'next/navigation'

// Legacy layout file (not used by Chakra DocsLayout). Keep minimal to avoid build errors.

type Section = { id: string; title: string }
function SectionProvider({ children }: { sections: Array<Section>; children: React.ReactNode }) {
  return <>{children}</>
}

export function Layout({
  children,
  allSections,
}: {
  children: React.ReactNode
  allSections: Record<string, Array<Section>>
}) {
  const pathname = usePathname()

  return (
    <SectionProvider sections={allSections[pathname] ?? []}>
      <div className="h-full lg:ml-64 xl:ml-72">
        <motion.header layoutScroll className="contents" />
        <div className="relative flex h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
          <main className="flex-auto">{children}</main>
        </div>
      </div>
    </SectionProvider>
  )
}
