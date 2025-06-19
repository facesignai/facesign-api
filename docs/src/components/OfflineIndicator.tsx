'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'

function WifiIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 010.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.414 5 5 0 017.07 0 1 1 0 01-1.415 1.414zM10 16a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function WifiSlashIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M2.22 2.22a.75.75 0 011.06 0l14.5 14.5a.75.75 0 11-1.06 1.06L2.22 3.28a.75.75 0 010-1.06zM8.34 6.55l1.42 1.42c.58-.14 1.2-.14 1.78 0a1 1 0 01.31 1.69l1.42 1.42c1.77-.89 3.02-2.14 3.91-3.91a1 1 0 00-1.414-1.414c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 000.808 6.808c.89-1.77 2.14-3.02 3.91-3.91l1.42 1.42c.58-.14 1.2-.14 1.78 0a1 1 0 01.31 1.69z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showIndicator, setShowIndicator] = useState(false)
  
  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => {
      setIsOnline(true)
      // Show a brief \"back online\" indicator
      setShowIndicator(true)
      setTimeout(() => setShowIndicator(false), 3000)
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      setShowIndicator(true)
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  // Don't show indicator if online and not explicitly showing
  if (!showIndicator && isOnline) return null
  
  return (
    <div 
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        !isOnline ? 'translate-y-0' : 'translate-y-0'
      )}
      role="banner"
      aria-live="polite"
    >
      <div className={clsx(
        'border-l-4 p-3',
        !isOnline 
          ? 'bg-amber-50 border-amber-400 dark:bg-amber-900/20 dark:border-amber-400'
          : 'bg-emerald-50 border-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-400'
      )}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {!isOnline ? (
              <WifiSlashIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            ) : (
              <WifiIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className={clsx(
              'text-sm font-medium',
              !isOnline 
                ? 'text-amber-800 dark:text-amber-200'
                : 'text-emerald-800 dark:text-emerald-200'
            )}>
              {!isOnline ? (
                <>
                  <span className="font-semibold">Offline Mode</span>
                  <span className="ml-2">
                    You&apos;re viewing cached documentation. Some interactive features may be limited.
                  </span>
                </>
              ) : (
                <>
                  <span className="font-semibold">Back Online</span>
                  <span className="ml-2">
                    Connection restored. All features are now available.
                  </span>
                </>
              )}
            </p>
          </div>
          {!isOnline && (
            <div className="ml-auto">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 hover:bg-amber-200 dark:bg-amber-800/50 dark:text-amber-200 dark:hover:bg-amber-700/50"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}