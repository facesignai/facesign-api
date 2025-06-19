'use client'

import { useState } from 'react'
import clsx from 'clsx'

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  variant?: 'default' | 'outline' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
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

const variantStyles = {
  default: {
    container: 'border border-zinc-200 rounded-lg dark:border-zinc-700',
    button: 'hover:bg-zinc-50 dark:hover:bg-zinc-800',
    content: 'border-t border-zinc-200 dark:border-zinc-700'
  },
  outline: {
    container: 'border border-zinc-300 rounded-lg dark:border-zinc-600',
    button: 'hover:bg-zinc-100 dark:hover:bg-zinc-700',
    content: 'border-t border-zinc-300 dark:border-zinc-600'
  },
  subtle: {
    container: 'bg-zinc-50 rounded-lg dark:bg-zinc-800/50',
    button: 'hover:bg-zinc-100 dark:hover:bg-zinc-700/50',
    content: 'border-t border-zinc-200 dark:border-zinc-700'
  }
}

const sizeStyles = {
  sm: {
    button: 'px-3 py-2 text-sm',
    content: 'px-3 py-2',
    icon: 'h-4 w-4'
  },
  md: {
    button: 'px-4 py-3 text-base',
    content: 'px-4 py-3',
    icon: 'h-5 w-5'
  },
  lg: {
    button: 'px-6 py-4 text-lg',
    content: 'px-6 py-4',
    icon: 'h-6 w-6'
  }
}

export function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = false,
  variant = 'default',
  size = 'md'
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  const styles = variantStyles[variant]
  const sizes = sizeStyles[size]
  
  return (
    <div className={clsx('my-6', styles.container)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'w-full flex items-center justify-between text-left font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
          'text-zinc-900 dark:text-white',
          styles.button,
          sizes.button,
          !isOpen && variant === 'default' && 'rounded-lg',
          !isOpen && variant === 'outline' && 'rounded-lg',
          !isOpen && variant === 'subtle' && 'rounded-lg',
          isOpen && 'rounded-t-lg'
        )}
        aria-expanded={isOpen}
        aria-controls={`collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <span>{title}</span>
        <ChevronDownIcon 
          className={clsx(
            'transition-transform text-zinc-500 dark:text-zinc-400',
            sizes.icon,
            isOpen ? 'rotate-180' : ''
          )}
        />
      </button>
      
      {isOpen && (
        <div 
          id={`collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className={clsx(
            styles.content,
            sizes.content,
            '[&>:first-child]:mt-0 [&>:last-child]:mb-0'
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}