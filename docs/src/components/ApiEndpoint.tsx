'use client'

import clsx from 'clsx'
import { ReactNode } from 'react'

interface ApiEndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  description: string
  children?: ReactNode
  deprecated?: boolean
  beta?: boolean
}

const methodColors = {
  GET: 'bg-blue-50 text-blue-800 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20',
  POST: 'bg-green-50 text-green-800 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20',
  PUT: 'bg-orange-50 text-orange-800 ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20',
  PATCH: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-500/10 dark:text-yellow-400 dark:ring-yellow-500/20',
  DELETE: 'bg-red-50 text-red-800 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
}

export function ApiEndpoint({ 
  method, 
  path, 
  description, 
  children, 
  deprecated = false,
  beta = false 
}: ApiEndpointProps) {
  return (
    <div className="my-8 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
      <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex flex-wrap items-center gap-3">
          <span className={clsx(
            'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
            methodColors[method]
          )}>
            {method}
          </span>
          
          <code className="rounded bg-zinc-100 px-2 py-1 text-sm font-mono text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100">
            {path}
          </code>
          
          {beta && (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20">
              Beta
            </span>
          )}
          
          {deprecated && (
            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20">
              Deprecated
            </span>
          )}
        </div>
        
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>
      
      {children && (
        <div className="p-6">
          {children}
        </div>
      )}
    </div>
  )
}