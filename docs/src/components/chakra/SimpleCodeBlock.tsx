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
  variant?: 'dark' | 'light' | 'white'
  showLineNumbers?: boolean
  maxHeight?: string
  wordWrap?: boolean
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
  maxHeight = '360px',
  wordWrap = true,
}: SimpleCodeBlockProps) {
  // Inline Chakra tokens per variant to style the code block chrome
  const headerBg = variant === 'dark' ? 'gray.900' : variant === 'white' ? 'white' : 'gray.100'
  const headerColor = variant === 'dark' ? 'white' : 'gray.800'
  const headerBorder = variant === 'dark' ? 'gray.700' : 'gray.200'
  const contentBg = variant === 'dark' ? 'gray.900' : variant === 'white' ? 'white' : 'gray.50'
  const codeColor = variant === 'dark' ? 'white' : 'gray.800'
  const plain = variant !== 'dark'
  return plain ? (
    <CodeBlock.Root mb="6" size="sm" code={code} language={language} meta={{ wordWrap }} bg={contentBg}>
      <CodeBlock.Header borderBottomWidth="1px" bg={headerBg} color={headerColor} borderColor={headerBorder}>
        {title && <CodeBlock.Title>{title}</CodeBlock.Title>}
        <CodeBlock.Control>
          <CodeBlock.CopyTrigger asChild>
            <IconButton variant="ghost" size="2xs">
              <CodeBlock.CopyIndicator />
            </IconButton>
          </CodeBlock.CopyTrigger>
        </CodeBlock.Control>
      </CodeBlock.Header>
      <CodeBlock.Content maxH={maxHeight} overflowY="auto" overflowX="hidden" bg={contentBg}>
        <CodeBlock.Code overflowX="hidden" color={codeColor} bg="transparent">
          <CodeBlock.CodeText />
        </CodeBlock.Code>
      </CodeBlock.Content>
    </CodeBlock.Root>
  ) : (
    <CodeBlock.AdapterProvider value={shikiAdapter}>
      <CodeBlock.Root
        mb="6"
        size="sm"
        code={code}
        language={language}
        meta={{ colorScheme: 'dark', wordWrap }}
        bg={contentBg}
      >
        <CodeBlock.Header borderBottomWidth="1px" bg={headerBg} color={headerColor} borderColor={headerBorder}>
          {title && <CodeBlock.Title>{title}</CodeBlock.Title>}
          <CodeBlock.Control>
            <CodeBlock.CopyTrigger asChild>
              <IconButton variant="ghost" size="2xs">
                <CodeBlock.CopyIndicator />
              </IconButton>
            </CodeBlock.CopyTrigger>
          </CodeBlock.Control>
        </CodeBlock.Header>
        <CodeBlock.Content maxH={maxHeight} overflowY="auto" overflowX="hidden" bg={contentBg}>
          <CodeBlock.Code overflowX="hidden" color={codeColor} bg="transparent">
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  )
}
