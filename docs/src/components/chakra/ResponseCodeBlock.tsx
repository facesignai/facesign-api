'use client'

import {
  CodeBlock,
  Tabs,
  Text,
  IconButton,
  ClientOnly,
  useTabs,
} from '@chakra-ui/react'
import { shikiAdapter } from '@/lib/shiki-adapter'
import { useColorMode } from '@/components/ui/color-mode'

interface ResponseCodeBlockProps {
  responses: {
    [statusCode: string]: {
      description: string
      content: string
    }
  }
}

export function ResponseCodeBlock({ responses }: ResponseCodeBlockProps) {
  const { colorMode } = useColorMode()
  const statusCodes = Object.keys(responses)
  const defaultStatus = statusCodes[0]

  const tabs = useTabs({
    defaultValue: defaultStatus,
  })

  const activeStatusCode = tabs.value ?? defaultStatus
  const activeResponse = responses[activeStatusCode] || responses[defaultStatus]

  return (
    <ClientOnly fallback={
      <CodeBlock.AdapterProvider value={shikiAdapter}>
        <CodeBlock.Root code={responses[defaultStatus].content} language="json" size="sm">
          <CodeBlock.Header py="2" borderBottomWidth="1px" position="relative" zIndex="1">
            <Text textStyle="xs" fontFamily="mono">Loading...</Text>
          </CodeBlock.Header>
          <CodeBlock.Content>
            <CodeBlock.Code fontSize="xs" />
          </CodeBlock.Content>
        </CodeBlock.Root>
      </CodeBlock.AdapterProvider>
    }>
      {() => (
        <CodeBlock.AdapterProvider value={shikiAdapter}>
          <Tabs.RootProvider value={tabs} size="sm" variant="subtle">
            <CodeBlock.Root
              code={activeResponse.content}
              language="json"
              size="sm"
              meta={{
                colorScheme: colorMode,
              }}
            >
              <CodeBlock.Header py="1.5" borderBottomWidth="1px" position="relative" zIndex="1">
                <CodeBlock.Title fontFamily="mono" textTransform="uppercase" textStyle="xs">
                  Response
                </CodeBlock.Title>
                <Tabs.List border="0" gap="1">
                  {statusCodes.map((statusCode) => (
                    <Tabs.Trigger
                      key={statusCode}
                      value={statusCode}
                      textStyle="xs"
                      px="2"
                      py="1"
                      color={
                        statusCode.startsWith('2') ? 'green.600' :
                        statusCode.startsWith('4') ? 'yellow.600' :
                        'red.600'
                      }
                      fontWeight="medium"
                    >
                      {statusCode}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
                <CodeBlock.CopyTrigger asChild>
                  <IconButton variant="ghost" size="2xs">
                    <CodeBlock.CopyIndicator />
                  </IconButton>
                </CodeBlock.CopyTrigger>
              </CodeBlock.Header>
              <CodeBlock.Content maxH="500px" overflowY="auto">
                <Tabs.Content pt="0" value={activeStatusCode} overflow="hidden">
                  <CodeBlock.Code fontSize="xs" overflowX="auto">
                    <CodeBlock.CodeText />
                  </CodeBlock.Code>
                </Tabs.Content>
              </CodeBlock.Content>
            </CodeBlock.Root>
          </Tabs.RootProvider>
        </CodeBlock.AdapterProvider>
      )}
    </ClientOnly>
  )
}
