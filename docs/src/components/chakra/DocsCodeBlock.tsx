'use client'

import { RequestCodeBlock } from './RequestCodeBlock'
import { CodeBlock } from '@chakra-ui/react'
import { shikiAdapter } from '@/lib/shiki-adapter'
import { useEffect, useState } from 'react'

interface DocsCodeBlockProps {
  // For API-style code blocks with language switcher
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path?: string
  title?: string

  // Code examples by language
  examples?: {
    curl?: string
    javascript?: string
    typescript?: string
    python?: string
    go?: string
    [key: string]: string | undefined
  }

  // For simple inline code blocks
  code?: string
  language?: string

  // UI options
  showLineNumbers?: boolean
  maxHeight?: string
}

/**
 * DocsCodeBlock - Unified code block component for documentation pages
 *
 * Usage:
 *
 * // API-style with language switcher
 * <DocsCodeBlock
 *   method="POST"
 *   path="/sessions"
 *   examples={{
 *     curl: `curl -X POST...`,
 *     javascript: `const session = await...`,
 *     python: `session = client.session.create(...)`
 *   }}
 * />
 *
 * // Simple code block
 * <DocsCodeBlock
 *   code={`const example = "hello"`}
 *   language="javascript"
 *   showLineNumbers
 * />
 */
export function DocsCodeBlock({
  method,
  path,
  title,
  examples,
  code,
  language = 'javascript',
  showLineNumbers = false,
  maxHeight = '500px'
}: DocsCodeBlockProps) {
  // If we have method and path, use RequestCodeBlock for API-style
  if (method && path && examples) {
    // Filter out undefined values and ensure we have the expected format
    const codeExamples: Record<string, string> = {}

    if (examples.curl) codeExamples.curl = examples.curl
    if (examples.javascript || examples.typescript) {
      codeExamples.javascript = examples.javascript || examples.typescript || ''
    }
    if (examples.python) codeExamples.python = examples.python
    if (examples.go) codeExamples.go = examples.go

    return (
      <RequestCodeBlock
        method={method}
        path={path}
        codeExamples={codeExamples}
      />
    )
  }

  // For simple code blocks, use Chakra CodeBlock directly
  if (code) {
    return (
      <CodeBlock.AdapterProvider value={shikiAdapter}>
        <CodeBlock.Root
          mb="6"
          size="sm"
          code={code}
          language={language}
          meta={{ colorScheme: 'dark' }}
        >
          <CodeBlock.Header py="2" borderBottomWidth="1px" bg="gray.800" color="white">
            {title && (
              <CodeBlock.Title fontSize="sm" fontWeight="semibold">
                {title}
              </CodeBlock.Title>
            )}
            <CodeBlock.Control>
              <CodeBlock.CopyTrigger />
            </CodeBlock.Control>
          </CodeBlock.Header>
          <CodeBlock.Content bg="gray.800" maxH={maxHeight} overflowY="auto">
            <CodeBlock.Code fontSize="xs" overflowX="auto">
              <CodeBlock.CodeText />
            </CodeBlock.Code>
          </CodeBlock.Content>
        </CodeBlock.Root>
      </CodeBlock.AdapterProvider>
    )
  }

  // If neither API-style nor simple code provided, return null
  return null
}

// Export a utility to persist language preference across all code blocks
export function useLanguagePreference() {
  const STORAGE_KEY = 'fs-docs.langs'

  const [language, setLanguage] = useState<string>('javascript')

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setLanguage(stored)
    }
  }, [])

  const updateLanguage = (newLang: string) => {
    setLanguage(newLang)
    localStorage.setItem(STORAGE_KEY, newLang)
  }

  return { language, updateLanguage }
}