'use client'

import {
  CodeBlock,
  IconButton,
} from '@chakra-ui/react'
import { shikiAdapter } from '@/lib/shiki-adapter'

interface SimpleCodeBlockProps {
  code: string
  language?: string
  title?: string
  variant?: 'dark' | 'light'
  showLineNumbers?: boolean
  maxHeight?: string
}

/**
 * SimpleCodeBlock - Non-tabbed code block for single code snippets
 *
 * Usage:
 *
 * // Dark code block (default)
 * <SimpleCodeBlock
 *   code={`const hello = "world"`}
 *   language="javascript"
 *   title="Example"
 * />
 *
 * // Light code block (for reference/output)
 * <SimpleCodeBlock
 *   code={`{ "status": "success" }`}
 *   language="json"
 *   variant="light"
 * />
 */
export function SimpleCodeBlock({
  code,
  language = 'javascript',
  title,
  variant = 'dark',
  showLineNumbers: _showLineNumbers = false,
  maxHeight = '500px',
}: SimpleCodeBlockProps) {
  return (
    <CodeBlock.AdapterProvider value={shikiAdapter}>
      <CodeBlock.Root
        mb="6"
        size="sm"
        code={code}
        language={language}
        meta={{ colorScheme: variant }}
      >
        <CodeBlock.Header borderBottomWidth="1px">
          {title && <CodeBlock.Title>{title}</CodeBlock.Title>}
          <CodeBlock.Control>
            <CodeBlock.CopyTrigger asChild>
              <IconButton variant="ghost" size="2xs">
                <CodeBlock.CopyIndicator />
              </IconButton>
            </CodeBlock.CopyTrigger>
          </CodeBlock.Control>
        </CodeBlock.Header>

        <CodeBlock.Content maxH={maxHeight} overflowY="auto">
          <CodeBlock.Code overflowX="auto">
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  )
}
