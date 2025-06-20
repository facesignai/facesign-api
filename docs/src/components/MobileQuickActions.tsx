'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m18 16 4-4-4-4" />
      <path d="m6 8-4 4 4 4" />
      <path d="m14.5 4-5 16" />
    </svg>
  )
}

function FlowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M12 6v4" />
      <rect width="8" height="4" x="8" y="14" rx="1" ry="1" />
      <path d="M12 10v4" />
    </svg>
  )
}

interface QuickAction {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  primary?: boolean
}

const quickActions: QuickAction[] = [
  {
    id: 'quickstart',
    label: 'Quick Start',
    href: '/quickstart',
    icon: BookIcon,
    primary: true,
  },
  {
    id: 'api-reference',
    label: 'API Reference',
    href: '/api-reference',
    icon: CodeIcon,
  },
  {
    id: 'flows',
    label: 'Flows',
    href: '/flows',
    icon: FlowIcon,
  },
]

export function MobileQuickActions() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show the FAB when user scrolls down a bit
      setIsVisible(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-40 lg:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.id}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ delay: quickActions.indexOf(action) * 0.1 }}
                >
                  <Link
                    href={action.href}
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium shadow-lg transition-all hover:scale-105',
                      action.primary
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-white text-zinc-900 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="whitespace-nowrap">{action.label}</span>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all',
          isOpen
            ? 'bg-zinc-600 text-white dark:bg-zinc-400 dark:text-zinc-900'
            : 'bg-emerald-500 text-white hover:bg-emerald-600'
        )}
        aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <PlusIcon className="h-6 w-6" />
        </motion.div>
      </motion.button>
    </div>
  )
}