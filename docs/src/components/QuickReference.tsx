'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

interface QuickReferenceItem {
  title: string
  href: string
  description?: string
}

interface QuickReferenceProps {
  items: QuickReferenceItem[]
  title?: string
  position?: 'left' | 'right'
  threshold?: number
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

function CloseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function QuickReference({ 
  items, 
  title = "Quick Reference",
  position = 'right',
  threshold = 200 
}: QuickReferenceProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return
      setIsVisible(window.scrollY > threshold)
    }
    
    // Check initial scroll position
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold, isDismissed])
  
  if (!isVisible || isDismissed) return null
  
  return (
    <div 
      className={clsx(
        'fixed top-1/2 z-50 transform -translate-y-1/2 transition-all duration-300',
        position === 'right' ? 'right-4' : 'left-4',
        'max-w-xs'
      )}
    >
      <div className="rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {title}
            </h4>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Dismiss quick reference"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto p-3">
          <div className="space-y-2">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="block rounded-md p-2 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
            ))}
          </div>
        </div>
        
        <div className="border-t border-zinc-200 px-4 py-2 dark:border-zinc-700">
          <button
            onClick={() => setIsDismissed(true)}
            className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            Hide this panel
          </button>
        </div>
      </div>
    </div>
  )
}