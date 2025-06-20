'use client'

import { useState, useEffect } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

interface ContextualSidebarItem {
  title: string
  href: string
  description?: string
}

interface ContextualSidebarProps {
  items: ContextualSidebarItem[]
  title?: string
  position?: 'right' | 'left'
  className?: string
}

function BookmarkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M3 5a2 2 0 012-2h10a2 2 0 012 2v11.586a1 1 0 01-1.707.707L12 13.586l-3.293 3.707A1 1 0 017 16.586V5z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ChevronDownIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function ContextualSidebar({ 
  items, 
  title = "Quick Reference",
  position = 'right',
  className
}: ContextualSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  
  // Auto-hide on small screens
  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth >= 1024) // lg breakpoint
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  if (!isVisible || items.length === 0) return null
  
  return (
    <div className={clsx(
      'sticky top-24 self-start',
      position === 'left' ? 'order-first mr-8' : 'order-last ml-8',
      className
    )}>
      <div className="w-64 rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex w-full items-center justify-between border-b border-zinc-200 px-4 py-3 text-left hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          aria-expanded={!isCollapsed}
        >
          <div className="flex items-center gap-2">
            <BookmarkIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {title}
            </h3>
          </div>
          <ChevronDownIcon 
            className={clsx(
              'h-4 w-4 text-zinc-500 transition-transform dark:text-zinc-400',
              isCollapsed ? '-rotate-90' : ''
            )}
          />
        </button>
        
        {!isCollapsed && (
          <div className="p-3">
            <nav>
              <ul className="space-y-1">
                {items.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <div className="font-medium text-zinc-900 dark:text-white">
                        {item.title}
                      </div>
                      {item.description && (
                        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                          {item.description}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}