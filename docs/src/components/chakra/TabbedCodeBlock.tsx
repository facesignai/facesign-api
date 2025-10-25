'use client'

import {
  CodeBlock,
  HStack,
  IconButton,
  Tabs,
} from '@chakra-ui/react'
import { IoLogoJavascript, IoLogoPython } from 'react-icons/io5'
import { LuTerminal } from 'react-icons/lu'
import { SiGo } from 'react-icons/si'
import { shikiAdapter } from '@/lib/shiki-adapter'

interface TabbedCodeBlockProps {
  title?: string
  codeExamples: {
    npm?: string
    bash?: string
    python?: string
    go?: string
    curl?: string
    javascript?: string
  }
  defaultLanguage?: string
  variant?: 'dark' | 'light' | 'white'
}

interface LanguageConfig {
  label: string
  value: string
  icon: React.ComponentType
  language: string // For shiki syntax highlighting
}

const languageConfigs: Record<string, LanguageConfig> = {
  npm: {
    label: 'NPM',
    value: 'npm',
    icon: LuTerminal,
    language: 'bash',
  },
  bash: {
    label: 'Bash',
    value: 'bash',
    icon: LuTerminal,
    language: 'bash',
  },
  python: {
    label: 'Python',
    value: 'python',
    icon: IoLogoPython,
    language: 'python',
  },
  go: {
    label: 'Go',
    value: 'go',
    icon: SiGo,
    language: 'go',
  },
  curl: {
    label: 'cURL',
    value: 'curl',
    icon: LuTerminal,
    language: 'bash',
  },
  javascript: {
    label: 'JavaScript',
    value: 'javascript',
    icon: IoLogoJavascript,
    language: 'javascript',
  },
}

export function TabbedCodeBlock({
  title,
  codeExamples,
  defaultLanguage,
  variant = 'light',
}: TabbedCodeBlockProps) {
  // Get available languages from provided code examples
  const availableLanguages = Object.keys(codeExamples).filter(
    (lang) => codeExamples[lang as keyof typeof codeExamples]
  )

  // Determine default language
  const initialLanguage = defaultLanguage || availableLanguages[0] || 'bash'

  // Map our high-level variants to Chakra token props (no theme/meta)
  const styleMap = {
    dark: {
      headerBg: 'gray.900',
      headerColor: 'white',
      headerBorder: 'gray.700',
      contentBg: 'gray.900',
      codeColor: 'white',
    },
    light: {
      headerBg: 'gray.100',
      headerColor: 'gray.800',
      headerBorder: 'gray.200',
      contentBg: 'gray.50',
      codeColor: 'gray.800',
    },
    white: {
      headerBg: 'white',
      headerColor: 'gray.800',
      headerBorder: 'gray.200',
      contentBg: 'white',
      codeColor: 'gray.800',
    },
  } as const
  const styles = styleMap[variant]

  return (
    <CodeBlock.AdapterProvider value={shikiAdapter}>
      <Tabs.Root defaultValue={initialLanguage} size="sm" variant="subtle" mb={8}>
        <CodeBlock.Root
          size="sm"
          code={codeExamples[initialLanguage as keyof typeof codeExamples] || ''}
          language={languageConfigs[initialLanguage]?.language || 'bash'}
          bg={styles.contentBg}
        >
          <CodeBlock.Header borderBottomWidth="1px" bg={styles.headerBg} color={styles.headerColor} borderColor={styles.headerBorder}>
            <HStack flex="1" gap={2}>
              {title && <CodeBlock.Title>{title}</CodeBlock.Title>}
              <Tabs.List
                border="0"
                bg="transparent"
                gap={1}
                ml={title ? 3 : 0}
              >
                {availableLanguages.map((lang) => {
                  const config = languageConfigs[lang]
                  if (!config) return null
                  const Icon = config.icon

                  return (
                    <Tabs.Trigger
                      key={lang}
                      value={lang}
                      colorPalette="green"
                      px={2}
                      py={1}
                      fontSize="xs"
                      fontWeight="medium"
                    >
                      <HStack gap={1}>
                        <Icon />
                        <span>{config.label}</span>
                      </HStack>
                    </Tabs.Trigger>
                  )
                })}
              </Tabs.List>
            </HStack>
            <CodeBlock.Control>
              <CodeBlock.CopyTrigger asChild>
                <IconButton variant="ghost" size="2xs">
                  <CodeBlock.CopyIndicator />
                </IconButton>
              </CodeBlock.CopyTrigger>
            </CodeBlock.Control>
          </CodeBlock.Header>

          {availableLanguages.map((lang) => {
            const config = languageConfigs[lang]
            if (!config) return null
            const code = codeExamples[lang as keyof typeof codeExamples] || ''

            return (
              <Tabs.Content key={lang} value={lang} pt="0">
                <CodeBlock.Root
                  size="sm"
                  code={code}
                  language={config.language}
                  bg={styles.contentBg}
                >
                  <CodeBlock.Content maxH="500px" overflowY="auto" bg={styles.contentBg}>
                    <CodeBlock.Code overflowX="auto" color={styles.codeColor}>
                      <CodeBlock.CodeText />
                    </CodeBlock.Code>
                  </CodeBlock.Content>
                </CodeBlock.Root>
              </Tabs.Content>
            )
          })}
        </CodeBlock.Root>
      </Tabs.Root>
    </CodeBlock.AdapterProvider>
  )
}
