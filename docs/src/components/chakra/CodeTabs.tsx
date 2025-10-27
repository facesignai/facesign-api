'use client'

import { SimpleCodeBlock } from './SimpleCodeBlock'

interface CodeTabsProps {
  title?: string
  codeExamples: {
    npm?: string
    bash?: string
    python?: string
    go?: string
    curl?: string
    javascript?: string
    typescript?: string
    ts?: string
  }
  defaultLanguage?: string
}

export function CodeTabs({ title, codeExamples, defaultLanguage }: CodeTabsProps) {
  // Map ts -> typescript if needed
  const mapped = { ...codeExamples }
  if (mapped.ts) {
    mapped.typescript = mapped.ts
    delete (mapped as any).ts
  }
  return (
    <SimpleCodeBlock
      title={title}
      codeExamples={mapped}
      defaultLanguage={defaultLanguage}
      languageSwitcher="tabs"
    />
  )
}


