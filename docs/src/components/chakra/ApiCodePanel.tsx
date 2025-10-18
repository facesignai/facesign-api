'use client'

import { Box, Card, Heading, Tabs, Text, VStack } from '@chakra-ui/react'
import { CodeBlock } from './CodeBlock'

interface ApiCodePanelProps {
  title?: string
  description?: string
  codeExamples: {
    [language: string]: string
  }
}

export function ApiCodePanel({
  title = 'Code Examples',
  description,
  codeExamples
}: ApiCodePanelProps) {
  // Transform language keys to display names
  const getLanguageLabel = (lang: string) => {
    const labels: { [key: string]: string } = {
      curl: 'cURL',
      javascript: 'JavaScript',
      python: 'Python',
      go: 'Go',
      php: 'PHP',
      ruby: 'Ruby'
    }
    return labels[lang] || lang
  }

  // Default to cURL if no examples provided
  const examples = Object.keys(codeExamples).length > 0 ? codeExamples : { curl: '# No example available' }

  return (
    <Card.Root variant="elevated" mb={6}>
      <Card.Body>
        <VStack align="stretch" gap={4}>
          {/* Header */}
          <Box>
            <Heading size="md" mb={2}>
              {title}
            </Heading>
            {description && (
              <Text fontSize="sm" color="fg.muted">
                {description}
              </Text>
            )}
          </Box>

          {/* Code Block with Language Tabs */}
          <Tabs.Root defaultValue={Object.keys(examples)[0]} variant="enclosed">
            <Tabs.List>
              {Object.keys(examples).map((lang) => (
                <Tabs.Trigger
                  key={lang}
                  value={lang}
                >
                  {getLanguageLabel(lang)}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Tabs.ContentGroup>
              {Object.entries(examples).map(([lang, code]) => (
                <Tabs.Content key={lang} value={lang} p={0}>
                  <Box
                    bg="gray.50"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderTopWidth="0"
                    borderRadius="0 0 md md"
                    overflow="hidden"
                    _dark={{
                      bg: 'gray.900',
                      borderColor: 'gray.700'
                    }}
                  >
                    <CodeBlock
                      code={code}
                      language={lang}
                      showLineNumbers={false}
                    />
                  </Box>
                </Tabs.Content>
              ))}
            </Tabs.ContentGroup>
          </Tabs.Root>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}