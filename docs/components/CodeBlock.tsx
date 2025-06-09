import React from 'react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  children: React.ReactNode
  language?: string
  className?: string
  showLineNumbers?: boolean
}

export function CodeBlock({ 
  children, 
  language = 'typescript',
  className,
  showLineNumbers = false 
}: CodeBlockProps) {
  return (
    <div className={cn("relative group", className)}>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
          onClick={() => {
            if (typeof children === 'string') {
              navigator.clipboard.writeText(children)
            }
          }}
        >
          Copy
        </button>
      </div>
      <pre className={cn(
        "overflow-x-auto rounded-lg p-4",
        showLineNumbers && "pl-12"
      )}>
        <code className={`language-${language}`}>
          {children}
        </code>
      </pre>
    </div>
  )
} 