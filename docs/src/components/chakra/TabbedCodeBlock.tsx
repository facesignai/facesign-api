'use client'

import {
  CodeBlock,
  HStack,
  IconButton,
  Tabs,
  Text,
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
}: TabbedCodeBlockProps) {
  // Get available languages from provided code examples
  const availableLanguages = Object.keys(codeExamples).filter(
    (lang) => codeExamples[lang as keyof typeof codeExamples]
  )

  // Determine default language
  const initialLanguage = defaultLanguage || availableLanguages[0] || 'bash'

  return (
    <CodeBlock.AdapterProvider value={shikiAdapter}>
      <Tabs.Root defaultValue={initialLanguage} size="sm" variant="subtle" mb={8}>
        <CodeBlock.Root
          size="sm"
          code={codeExamples[initialLanguage as keyof typeof codeExamples] || ''}
          language={languageConfigs[initialLanguage]?.language || 'bash'}
          meta={{ colorScheme: 'dark' }}
        >
          <CodeBlock.Header
            py="2"
            borderBottomWidth="1px"
            bg="gray.900"
            color="white"
            borderColor="gray.700"
          >
            <HStack flex="1" gap={2}>
              {title && (
                <Text
                  textStyle="xs"
                  color="gray.400"
                  fontFamily="mono"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  {title}
                </Text>
              )}
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
                      color="gray.400"
                      _selected={{
                        color: 'green.400',
                        bg: 'gray.800',
                      }}
                      _hover={{
                        color: 'white',
                        bg: 'gray.800',
                      }}
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
                <IconButton variant="ghost" size="2xs" color="white">
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
                  meta={{ colorScheme: 'dark' }}
                >
                  <CodeBlock.Content bg="gray.900" maxH="500px" overflowY="auto">
                    <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
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
