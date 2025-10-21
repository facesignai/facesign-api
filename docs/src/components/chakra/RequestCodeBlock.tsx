'use client'

import {
  Badge,
  CodeBlock,
  createListCollection,
  HStack,
  IconButton,
  Select,
  Span,
  useSelect,
  useSelectContext,
  ClientOnly,
} from '@chakra-ui/react'
import { IoLogoJavascript, IoLogoPython } from 'react-icons/io5'
import { LuTerminal } from 'react-icons/lu'
import { shikiAdapter } from '@/lib/shiki-adapter'

interface CodeFile {
  title: string
  value: string
  code: string
  language: string
  icon: React.ComponentType
}

interface RequestCodeBlockProps {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  codeExamples: {
    [language: string]: string
  }
}

const methodColors = {
  GET: 'green',
  POST: 'blue',
  PUT: 'orange',
  PATCH: 'purple',
  DELETE: 'red',
}

const languageIcons = {
  curl: LuTerminal,
  javascript: IoLogoJavascript,
  python: IoLogoPython,
}

const languageLabels = {
  curl: 'cURL',
  javascript: 'JavaScript',
  python: 'Python',
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

const LanguageSwitcher = (props: Select.RootProviderProps) => {
  const { value: select } = props

  return (
    <Select.RootProvider size="xs" variant="outline" {...props}>
      <Select.Control>
        <Select.Trigger>
          <SelectValue />
          <Select.Indicator />
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content bg="gray.800" color="white" borderColor="gray.700" minW="32">
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

export function RequestCodeBlock({ method, path, codeExamples }: RequestCodeBlockProps) {
  // Transform code examples into CodeFile format
  const codeFiles: CodeFile[] = Object.entries(codeExamples).map(([lang, code]) => ({
    title: languageLabels[lang as keyof typeof languageLabels] || lang,
    value: languageLabels[lang as keyof typeof languageLabels] || lang,
    code,
    language: lang === 'curl' ? 'bash' : lang,
    icon: languageIcons[lang as keyof typeof languageIcons] || LuTerminal,
  }))

  const collection = createListCollection({
    items: codeFiles,
    itemToString: (item) => item.value,
    itemToValue: (item) => item.value,
  })

  const defaultCodeFile = codeFiles[0]

  const select = useSelect({
    positioning: {
      strategy: 'fixed',
      sameWidth: false,
      gutter: 4,
      placement: 'bottom-end',
    },
    defaultValue: [defaultCodeFile.value],
    collection,
  })

  const selectedCodeFile = select.selectedItems[0] || defaultCodeFile

  // Determine if syntax highlighting should be applied
  const isBashOrCurl = selectedCodeFile.language === 'bash'

  return (
    <ClientOnly fallback={
      <CodeBlock.AdapterProvider value={shikiAdapter}>
        <CodeBlock.Root
          mb="8"
          size="sm"
          code={defaultCodeFile.code}
          language={defaultCodeFile.language}
          meta={{ colorScheme: 'dark' }}
        >
          <CodeBlock.Header py="2" borderBottomWidth="1px" bg="gray.800" color="white">
            <HStack flex="1" fontFamily="mono">
              <Badge colorPalette={methodColors[method]} fontWeight="bold" variant="solid">
                {method}
              </Badge>
              <Span textStyle="xs" opacity="0.8">
                {path}
              </Span>
            </HStack>
          </CodeBlock.Header>
          <CodeBlock.Content bg="gray.800">
            <CodeBlock.Code fontSize="xs" />
          </CodeBlock.Content>
        </CodeBlock.Root>
      </CodeBlock.AdapterProvider>
    }>
      {() => (
        <CodeBlock.AdapterProvider value={shikiAdapter}>
          <CodeBlock.Root
            mb="8"
            size="sm"
            code={selectedCodeFile.code}
            language={selectedCodeFile.language}
            {...(!isBashOrCurl && { meta: { colorScheme: 'dark' } })}
          >
            <CodeBlock.Header py="2" borderBottomWidth="1px" bg="gray.800" color="white">
              <HStack flex="1" fontFamily="mono">
                <Badge colorPalette={methodColors[method]} fontWeight="bold" variant="solid">
                  {method}
                </Badge>
                <Span textStyle="xs" opacity="0.8">
                  {path}
                </Span>
              </HStack>
              <CodeBlock.Control>
                <LanguageSwitcher value={select} />
                <CodeBlock.CopyTrigger asChild>
                  <IconButton variant="ghost" size="2xs" color="white">
                    <CodeBlock.CopyIndicator />
                  </IconButton>
                </CodeBlock.CopyTrigger>
              </CodeBlock.Control>
            </CodeBlock.Header>
            <CodeBlock.Content bg="gray.800" maxH="500px" overflowY="auto">
              <CodeBlock.Code fontSize="xs" overflowX="auto">
                <CodeBlock.CodeText />
              </CodeBlock.Code>
            </CodeBlock.Content>
          </CodeBlock.Root>
        </CodeBlock.AdapterProvider>
      )}
    </ClientOnly>
  )
}
