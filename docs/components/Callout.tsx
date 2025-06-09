import React from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react'

interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success'
  title?: string
  children: React.ReactNode
  className?: string
}

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
}

const styleMap = {
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
  error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
  success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
}

export function Callout({ 
  type = 'info', 
  title, 
  children, 
  className 
}: CalloutProps) {
  const Icon = iconMap[type]

  return (
    <div className={cn(
      'my-6 flex gap-3 rounded-lg border p-4',
      styleMap[type],
      className
    )}>
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        {title && (
          <h5 className="font-medium leading-none tracking-tight">
            {title}
          </h5>
        )}
        <div className="text-sm [&>p]:leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
} 