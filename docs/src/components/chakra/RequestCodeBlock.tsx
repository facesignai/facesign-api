'use client'

import {
  Badge,
  CodeBlock,
  HStack,
  IconButton,
  Select,
  Span,
  createListCollection,
  useSelect,
  useSelectContext,
} from '@chakra-ui/react'
import { IoLogoJavascript, IoLogoPython } from 'react-icons/io5'
import { LuTerminal } from 'react-icons/lu'
import { SiGo } from 'react-icons/si'
import { shikiAdapter } from '@/lib/shiki-adapter'

interface CodeFile {
  value: string
  code: string
  language: string
  icon: React.ComponentType
}

interface RequestCodeBlockProps {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  codeExamples: { [language: string]: string }
}

const methodColors: Record<RequestCodeBlockProps['method'], string> = {
  GET: 'green',
  POST: 'teal',
  PUT: 'orange',
  PATCH: 'purple',
  DELETE: 'red',
}

const languageIcons: Record<string, React.ComponentType> = {
  curl: LuTerminal,
  javascript: IoLogoJavascript,
  python: IoLogoPython,
  go: SiGo,
  bash: LuTerminal,
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

export function RequestCodeBlock({ method, path, codeExamples }: RequestCodeBlockProps) {
  const files: CodeFile[] = Object.entries(codeExamples).map(([lang, code]) => ({
    value: lang === 'javascript' ? 'JavaScript' : lang.toUpperCase(),
    code,
    language: lang === 'curl' ? 'bash' : lang,
    icon: languageIcons[lang] || LuTerminal,
  }))

  const collection = createListCollection({
    items: files,
    itemToString: (item) => item.value,
    itemToValue: (item) => item.value,
  })

  const select = useSelect({ defaultValue: [files[0].value], collection })
  const selected = select.selectedItems[0] || files[0]

  return (
    <CodeBlock.AdapterProvider value={shikiAdapter}>
      <CodeBlock.Root code={selected.code} language={selected.language} size="lg">
        <CodeBlock.Header>
          <HStack flex="1">
            <Badge colorPalette={methodColors[method]} fontWeight="bold">{method}</Badge>
            <Span textStyle="xs">{path}</Span>
          </HStack>
          <CodeBlock.Control>
            <LanguageSwitcher value={select} />
            <CodeBlock.CopyTrigger asChild>
              <IconButton variant="ghost" size="2xs">
                <CodeBlock.CopyIndicator />
              </IconButton>
            </CodeBlock.CopyTrigger>
          </CodeBlock.Control>
        </CodeBlock.Header>
        <CodeBlock.Content>
          <CodeBlock.Code fontSize="xs">
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  )
}
