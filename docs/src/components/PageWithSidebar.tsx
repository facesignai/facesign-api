import { ContextualSidebar } from '@/components/ContextualSidebar'

interface PageWithSidebarProps {
  children: React.ReactNode
  sidebarItems: Array<{
    title: string
    href: string
    description?: string
  }>
  sidebarTitle?: string
}

export function PageWithSidebar({ children, sidebarItems, sidebarTitle }: PageWithSidebarProps) {
  return (
    <div className="flex gap-8">
      <div className="min-w-0 flex-1">
        {children}
      </div>
      <ContextualSidebar 
        items={sidebarItems}
        title={sidebarTitle}
      />
    </div>
  )
}