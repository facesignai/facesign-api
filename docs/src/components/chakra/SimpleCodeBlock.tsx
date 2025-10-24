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
  const styleMap = {
    dark: { headerBg: 'gray.900', headerColor: 'white', headerBorder: 'gray.700', contentBg: 'gray.900', codeColor: 'white' },
    light: { headerBg: 'gray.100', headerColor: 'gray.800', headerBorder: 'gray.200', contentBg: 'gray.50', codeColor: 'gray.800' },
    white: { headerBg: 'white', headerColor: 'gray.800', headerBorder: 'gray.200', contentBg: 'white', codeColor: 'gray.800' },
  } as const
  const styles = styleMap[variant]
  return (
    <CodeBlock.AdapterProvider value={shikiAdapter}>
      <CodeBlock.Root
        mb="6"
        size="sm"
        code={code}
        language={language}
      >
        <CodeBlock.Header borderBottomWidth="1px" bg={styles.headerBg} color={styles.headerColor} borderColor={styles.headerBorder}>
          {title && <CodeBlock.Title>{title}</CodeBlock.Title>}
          <CodeBlock.Control>
            <CodeBlock.CopyTrigger asChild>
              <IconButton variant="ghost" size="2xs">
                <CodeBlock.CopyIndicator />
              </IconButton>
            </CodeBlock.CopyTrigger>
          </CodeBlock.Control>
        </CodeBlock.Header>

        <CodeBlock.Content maxH={maxHeight} overflowY="auto" bg={styles.contentBg}>
          <CodeBlock.Code overflowX="auto" color={styles.codeColor}>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  )
}
