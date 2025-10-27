'use client'

import {
  CodeBlock,
  Float,
  HStack,
  IconButton,
  Select,
  Span,
  Tabs,
  createListCollection,
  useSelect,
  useSelectContext,
} from '@chakra-ui/react'
import { IoLogoJavascript, IoLogoPython } from 'react-icons/io5'
import { LuTerminal } from 'react-icons/lu'
import { SiGo } from 'react-icons/si'
import { shikiAdapter } from '@/lib/shiki-adapter'
import React from 'react'

interface SimpleCodeBlockProps {
  // Single code block mode
  code?: string
  language?: string

  // OR Multi-language mode
  codeExamples?: {
    bash?: string
    curl?: string
    javascript?: string
    typescript?: string
    python?: string
    go?: string
    java?: string
    npm?: string
    yarn?: string
    bun?: string
  }
  defaultLanguage?: string

  // Multi-language UI mode
  languageSwitcher?: 'tabs' | 'dropdown'

  // Header configuration
  showHeader?: boolean
  title?: string | React.ReactNode
  headerLeft?: React.ReactNode

  // Tab positioning (when languageSwitcher='tabs')
  tabPosition?: 'left' | 'right'

  // Visual variants
  variant?: 'dark' | 'light' | 'white' | 'plain'
  size?: 'sm' | 'md' | 'lg'

  // Max height
  maxHeight?: string

  // Content options
  showLineNumbers?: boolean
  wordWrap?: boolean
  showPrompt?: boolean

  // Shiki meta
  highlightLines?: number[]
  focusedLineNumbers?: number[]
  addedLineNumbers?: number[]
  removedLineNumbers?: number[]

  // Copy button
  copyButtonPosition?: 'header' | 'floating'
}

interface LanguageConfig {
  label: string
  value: string
  icon: React.ComponentType
  language: string // For shiki syntax highlighting
}

interface CodeFile {
  value: string
  code: string
  language: string
  icon: React.ComponentType
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
  typescript: {
    label: 'TypeScript',
    value: 'typescript',
    icon: IoLogoJavascript,
    language: 'typescript',
  },
  java: {
    label: 'Java',
    value: 'java',
    icon: LuTerminal,
    language: 'java',
  },
  yarn: {
    label: 'Yarn',
    value: 'yarn',
    icon: LuTerminal,
    language: 'bash',
  },
  bun: {
    label: 'Bun',
    value: 'bun',
    icon: LuTerminal,
    language: 'bash',
  },
}

const SelectValue = () => {
  const select = useSelectContext()
  const items = select.selectedItems as Array<CodeFile>
  if (!items || items.length === 0) return null
  const { icon: Icon, value } = items[0]
  return (
    <Select.ValueText placeholder="Select language">
      <HStack>
        <Icon />
        {value}
      </HStack>
    </Select.ValueText>
  )
}

function LanguageSwitcher(props: Select.RootProviderProps) {
  const { value: select } = props
  return (
    <Select.RootProvider size="xs" variant="subtle" {...props}>
      <Select.Control>
        <Select.Trigger>
          <SelectValue />
          <Select.Indicator />
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {select.collection.items.map((item) => (
            <Select.Item item={item} key={item.value}>
              <item.icon />
              <Select.ItemText>{item.value}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.RootProvider>
  )
}

// Separate component for dropdown to avoid conditional hooks
function DropdownCodeBlock({
  codeExamples,
  headerLeft,
  title,
  variant = 'dark',
  size = 'sm',
  maxHeight = '360px',
  showHeader = true,
  usesShiki,
}: {
  codeExamples: SimpleCodeBlockProps['codeExamples']
  headerLeft?: React.ReactNode
  title?: string | React.ReactNode
  variant?: 'dark' | 'light' | 'white' | 'plain'
  size?: 'sm' | 'md' | 'lg'
  maxHeight?: string
  showHeader?: boolean
  usesShiki: boolean
}) {
  const files: CodeFile[] = Object.entries(codeExamples!).map(([lang, code]) => ({
    value: lang === 'javascript' ? 'JavaScript' : lang === 'typescript' ? 'TypeScript' : lang.toUpperCase(),
    code: code || '',
    language: languageConfigs[lang]?.language || lang,
    icon: languageConfigs[lang]?.icon || LuTerminal,
  }))

  const collection = createListCollection({
    items: files,
    itemToString: (item) => item.value,
    itemToValue: (item) => item.value,
  })

  const select = useSelect({ defaultValue: [files[0].value], collection })
  const selected = select.selectedItems[0] || files[0]

  const headerBg = variant === 'dark' ? 'gray.900' : variant === 'white' ? 'white' : 'gray.100'
  const headerColor = variant === 'dark' ? 'white' : 'gray.800'
  const headerBorder = variant === 'dark' ? 'gray.700' : 'gray.200'
  const codeColor = variant === 'dark' ? 'white' : 'gray.800'

  const content = (
    <CodeBlock.Root code={selected.code} language={selected.language} size={size} mb={8}>
      {showHeader && (
        <CodeBlock.Header borderBottomWidth="1px" bg={headerBg} color={headerColor} borderColor={headerBorder}>
          <HStack flex="1" gap={2}>
            {headerLeft}
            {title && <CodeBlock.Title>{title}</CodeBlock.Title>}
          </HStack>
          <CodeBlock.Control>
            <LanguageSwitcher value={select} />
            <CodeBlock.CopyTrigger asChild>
              <IconButton variant="ghost" size="2xs" color={variant === 'dark' ? 'white' : undefined}>
                <CodeBlock.CopyIndicator />
              </IconButton>
            </CodeBlock.CopyTrigger>
          </CodeBlock.Control>
        </CodeBlock.Header>
      )}
      <CodeBlock.Content maxH={maxHeight} overflowY="auto" overflowX="hidden">
        <CodeBlock.Code fontSize="xs" overflowX="auto" color={usesShiki ? undefined : codeColor} bg="transparent">
          <CodeBlock.CodeText />
        </CodeBlock.Code>
      </CodeBlock.Content>
    </CodeBlock.Root>
  )

  return usesShiki ? (
    <CodeBlock.AdapterProvider value={shikiAdapter}>
      {content}
    </CodeBlock.AdapterProvider>
  ) : content
}

/**
 * SimpleCodeBlock - Unified code block component
 *
 * Supports:
 * - Single code blocks
 * - Multi-language with tabs
 * - Multi-language with dropdown selector
 * - Custom header layouts (title, headerLeft, tabs/dropdown)
 * - Proper Chakra/Shiki defaults (dark background by default)
 */
export function SimpleCodeBlock({
  code,
  language = 'javascript',
  codeExamples,
  defaultLanguage,
  languageSwitcher = 'tabs',
  showHeader = true,
  title,
  headerLeft,
  tabPosition = 'left',
  variant = 'dark',
  size = 'sm',
  maxHeight = '360px',
  showLineNumbers = false,
  wordWrap = true,
  showPrompt = false,
  highlightLines,
  focusedLineNumbers,
  addedLineNumbers,
  removedLineNumbers,
  copyButtonPosition = 'header',
}: SimpleCodeBlockProps) {
  // Determine if we're in multi-language mode
  const isMultiLanguage = !!codeExamples

  // Build meta object for Shiki
  const meta: Record<string, any> = { wordWrap }
  if (showLineNumbers) meta.showLineNumbers = true
  if (highlightLines) meta.highlightLines = highlightLines
  if (focusedLineNumbers) meta.focusedLineNumbers = focusedLineNumbers
  if (addedLineNumbers) meta.addedLineNumbers = addedLineNumbers
  if (removedLineNumbers) meta.removedLineNumbers = removedLineNumbers

  // Style tokens per variant
  const headerBg = variant === 'dark' ? 'gray.900' : variant === 'white' ? 'white' : 'gray.100'
  const headerColor = variant === 'dark' ? 'white' : 'gray.800'
  const headerBorder = variant === 'dark' ? 'gray.700' : 'gray.200'
  const contentBg = variant === 'dark' ? 'gray.900' : variant === 'white' ? 'white' : 'gray.50'
  const codeColor = variant === 'dark' ? 'white' : 'gray.800'
  const usesShiki = variant !== 'plain'

  // Plain text variant (no syntax highlighting, inline display)
  if (variant === 'plain' && !isMultiLanguage) {
    return (
      <CodeBlock.Root
        code={code || ''}
        language={language}
        display="inline-flex"
        mb="6"
      >
        <CodeBlock.Content>
          <Float placement="middle-end" offsetX="6" zIndex="1">
            <CodeBlock.CopyTrigger asChild>
              <IconButton variant="ghost" size="2xs">
                <CodeBlock.CopyIndicator />
              </IconButton>
            </CodeBlock.CopyTrigger>
          </Float>
          <CodeBlock.Code pe="10">
            {showPrompt && (
              <Span color="fg.muted" ms="4" userSelect="none">
                $
              </Span>
            )}
            <CodeBlock.CodeText display="inline-block" />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    )
  }

  // Multi-language with tabs
  if (isMultiLanguage && languageSwitcher === 'tabs') {
    const availableLanguages = Object.keys(codeExamples).filter(
      (lang) => codeExamples[lang as keyof typeof codeExamples]
    )
    const initialLanguage = defaultLanguage || availableLanguages[0] || 'bash'

    const content = (
      <Tabs.Root
        defaultValue={initialLanguage}
        size={size}
        variant="subtle"
        mb={8}
        multiple={false}
      >
        <CodeBlock.Root
          size={size}
          code={codeExamples[initialLanguage as keyof typeof codeExamples] || ''}
          language={languageConfigs[initialLanguage]?.language || 'bash'}
          bg={contentBg}
        >
          {showHeader && (
            <CodeBlock.Header borderBottomWidth="1px" bg={headerBg} color={headerColor} borderColor={headerBorder}>
              <HStack flex="1" gap={2}>
                {headerLeft}
                {title && <CodeBlock.Title>{title}</CodeBlock.Title>}
                <Tabs.List
                  border="0"
                  bg="transparent"
                  gap={1}
                  ml={title || headerLeft ? 3 : 0}
                  justifyContent={tabPosition === 'right' ? 'flex-end' : 'flex-start'}
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
                  <IconButton variant="ghost" size="2xs" color={variant === 'dark' ? 'white' : undefined}>
                    <CodeBlock.CopyIndicator />
                  </IconButton>
                </CodeBlock.CopyTrigger>
              </CodeBlock.Control>
            </CodeBlock.Header>
          )}

          {availableLanguages.map((lang) => {
            const config = languageConfigs[lang]
            if (!config) return null
            const code = codeExamples[lang as keyof typeof codeExamples] || ''

            return (
              <Tabs.Content key={lang} value={lang} pt="0">
                <CodeBlock.Root
                  size={size}
                  code={code}
                  language={config.language}
                >
                  <CodeBlock.Content maxH={maxHeight} overflowY="auto" overflowX="hidden">
                    <CodeBlock.Code overflowX="auto" color={usesShiki ? undefined : codeColor} bg="transparent">
                      <CodeBlock.CodeText />
                    </CodeBlock.Code>
                  </CodeBlock.Content>
                </CodeBlock.Root>
              </Tabs.Content>
            )
          })}
        </CodeBlock.Root>
      </Tabs.Root>
    )

    return usesShiki ? (
      <CodeBlock.AdapterProvider value={shikiAdapter}>
        {content}
      </CodeBlock.AdapterProvider>
    ) : content
  }

  // Multi-language with dropdown selector
  if (isMultiLanguage && languageSwitcher === 'dropdown') {
    return (
      <DropdownCodeBlock
        codeExamples={codeExamples}
        headerLeft={headerLeft}
        title={title}
        variant={variant}
        size={size}
        maxHeight={maxHeight}
        showHeader={showHeader}
        usesShiki={usesShiki}
      />
    )
  }

  // Single code block mode
  const singleCode = code || ''

  // No header with floating copy button
  if (!showHeader || copyButtonPosition === 'floating') {
    const content = (
      <CodeBlock.Root
        code={singleCode}
        language={language}
        size={size}
        mb={6}
        meta={meta}
        bg={contentBg}
      >
        <CodeBlock.Content maxH={maxHeight} overflowY="auto" overflowX="hidden">
          <Float placement="top-end" offset="5" zIndex="1">
            <CodeBlock.CopyTrigger asChild>
              <IconButton variant="ghost" size="2xs" color={variant === 'dark' ? 'white' : undefined}>
                <CodeBlock.CopyIndicator />
              </IconButton>
            </CodeBlock.CopyTrigger>
          </Float>
          <CodeBlock.Code overflowX="auto" color={usesShiki ? undefined : codeColor} bg="transparent">
            {showPrompt && (
              <Span color="fg.muted" ms="4" userSelect="none">
                $
              </Span>
            )}
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    )

    return usesShiki ? (
      <CodeBlock.AdapterProvider value={shikiAdapter}>
        {content}
      </CodeBlock.AdapterProvider>
    ) : content
  }

  // Standard single code block with header
  const content = (
    <CodeBlock.Root
      mb="6"
      size={size}
      code={singleCode}
      language={language}
      meta={meta}
      bg={contentBg}
    >
      <CodeBlock.Header borderBottomWidth="1px" bg={headerBg} color={headerColor} borderColor={headerBorder}>
        <HStack flex="1" gap={2}>
          {headerLeft}
          {title && <CodeBlock.Title>{title}</CodeBlock.Title>}
        </HStack>
        <CodeBlock.Control>
          <CodeBlock.CopyTrigger asChild>
            <IconButton variant="ghost" size="2xs" color={variant === 'dark' ? 'white' : undefined}>
              <CodeBlock.CopyIndicator />
            </IconButton>
          </CodeBlock.CopyTrigger>
        </CodeBlock.Control>
      </CodeBlock.Header>
      <CodeBlock.Content maxH={maxHeight} overflowY="auto" overflowX="hidden">
        <CodeBlock.Code overflowX="hidden" color={usesShiki ? undefined : codeColor} bg="transparent">
          <CodeBlock.CodeText />
        </CodeBlock.Code>
      </CodeBlock.Content>
    </CodeBlock.Root>
  )

  return usesShiki ? (
    <CodeBlock.AdapterProvider value={shikiAdapter}>
      {content}
    </CodeBlock.AdapterProvider>
  ) : content
}
