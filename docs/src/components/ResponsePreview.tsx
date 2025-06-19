'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

interface ResponsePreviewProps {
  responses: {
    status: number
    description: string
    example: Record<string, any>
  }[]
  title?: string
}

function StatusBadge({ status }: { status: number }) {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) {
      return 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20'
    } else if (status >= 400 && status < 500) {
      return 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20'
    } else if (status >= 500) {
      return 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20'
    }
    return 'bg-zinc-50 text-zinc-700 ring-zinc-600/20 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20'
  }

  return (
    <span className={clsx(
      'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
      getStatusColor(status)
    )}>
      {status}
    </span>
  )
}

function JsonViewer({ data }: { data: Record<string, any> }) {
  const [copyCount, setCopyCount] = useState(0)
  const copied = copyCount > 0

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopyCount(count => count + 1)
  }

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className={clsx(
          'absolute right-2 top-2 z-10 rounded px-2 py-1 text-xs font-medium transition-all',
          copied 
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
        )}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      
      <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-950">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  )
}

export function ResponsePreview({ responses, title = "Response Examples" }: ResponsePreviewProps) {
  return (
    <div className="my-6">
      <h4 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
        {title}
      </h4>
      
      <TabGroup>
        <TabList className="flex space-x-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
          {responses.map((response, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                clsx(
                  'w-full rounded-md py-2 px-3 text-xs font-medium leading-5 transition-all',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-white'
                    : 'text-zinc-600 hover:bg-white/[0.12] hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                )
              }
            >
              <div className="flex items-center justify-center gap-2">
                <StatusBadge status={response.status} />
                <span className="hidden sm:inline">{response.description}</span>
              </div>
            </Tab>
          ))}
        </TabList>
        
        <TabPanels className="mt-4">
          {responses.map((response, index) => (
            <TabPanel key={index} className="focus:outline-none">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <StatusBadge status={response.status} />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {response.description}
                  </span>
                </div>
                
                <JsonViewer data={response.example} />
              </div>
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  )
}