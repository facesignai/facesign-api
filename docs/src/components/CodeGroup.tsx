'use client'

import React from 'react'
import { TabbedCodeBlock } from '@/components/chakra/TabbedCodeBlock'

interface CodeGroupProps {
  title?: string
  children: React.ReactNode
}

/**
 * CodeGroup - Wrapper around TabbedCodeBlock for backward compatibility
 *
 * Accepts multiple code blocks as children and displays them in tabs.
 * Replaces the Protocol template's CodeGroup component.
 *
 * Usage in MDX:
 * <CodeGroup title="Example">
 * ```typescript {{ title: 'TypeScript' }}
 * const foo = 'bar'
 * ```
 *
 * ```python {{ title: 'Python' }}
 * foo = 'bar'
 * ```
 * </CodeGroup>
 */
export function CodeGroup({ title: _title, children }: CodeGroupProps) {
  // Extract code blocks from children
  const codeBlocks: Array<{ code: string; language: string; title: string }> = []

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === 'pre') {
      const preElement = child
      const codeElement = React.Children.only(preElement.props.children) as React.ReactElement

      if (codeElement && codeElement.type === 'code') {
        const { children: codeContent, className, title: codeTitle } = codeElement.props || {}
        const language = className?.replace(/language-/, '') || 'text'

        // Extract code (might be HTML string from shiki)
        const code = typeof codeContent === 'string' ? codeContent : String(codeContent || '')

        // Strip shiki HTML tags if present
        const rawCode = code.includes('<span')
          ? code.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
          : code

        const displayTitle = codeTitle || language

        codeBlocks.push({
          code: rawCode,
          language,
          title: displayTitle
        })
      }
    }
  })

  // Convert to TabbedCodeBlock format
  const codeExamples: Record<string, string> = {}
  const defaultLanguage = codeBlocks[0]?.language || 'javascript'

  codeBlocks.forEach((block) => {
    codeExamples[block.language] = block.code
  })

  return (
    <TabbedCodeBlock
      defaultLanguage={defaultLanguage}
      codeExamples={codeExamples}
    />
  )
}
