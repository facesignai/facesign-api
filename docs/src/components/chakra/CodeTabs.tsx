'use client'

import { TabbedCodeBlock } from './TabbedCodeBlock'

interface CodeTabsProps {
  title?: string
  codeExamples: {
    npm?: string
    bash?: string
    python?: string
    go?: string
    curl?: string
    javascript?: string
    ts?: string
  }
  defaultLanguage?: string
  variant?: 'dark' | 'light' | 'white'
}

export function CodeTabs({ title, codeExamples, defaultLanguage, variant = 'dark' }: CodeTabsProps) {
  // Map ts -> javascript temporarily if needed
  const mapped = { ...codeExamples }
  if (mapped.ts && !mapped.javascript) {
    mapped.javascript = mapped.ts
    delete (mapped as any).ts
  }
  return <TabbedCodeBlock title={title} codeExamples={mapped as any} defaultLanguage={defaultLanguage} variant={variant} />
}


