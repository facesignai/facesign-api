'use client'

import { Box, Card, Heading, Tabs, Text, VStack } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { CodeBlock } from './CodeBlock'

interface ApiCodePanelProps {
  title?: string
  description?: string
  codeExamples: {
    [language: string]: string
  }
  responseExamples?: {
    [status: string]: string
  }
}

export function ApiCodePanel({
  title = 'Code Examples',
  description,
  codeExamples,
  responseExamples
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
  const examples = useMemo(() => 
    Object.keys(codeExamples).length > 0 ? codeExamples : { curl: '# No example available' }
  , [codeExamples])

  // Persistent language preference across site
  const available = useMemo(() => Object.keys(examples), [examples])
  const [selectedLang, setSelectedLang] = useState<string>(available[0])

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('fs-docs.lang')
      if (stored && available.includes(stored)) {
        setSelectedLang(stored)
      } else {
        setSelectedLang(available[0])
      }
    } catch (_) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [available.join('|')])

  const onLangChange = (e: { value: string }) => {
    setSelectedLang(e.value)
    try {
      window.localStorage.setItem('fs-docs.lang', e.value)
    } catch (_) {
      // ignore
    }
  }

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
          <Tabs.Root value={selectedLang} onValueChange={onLangChange} variant="enclosed">
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
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    overflow="hidden"
                    _dark={{ borderColor: 'gray.700' }}
                  >
                    <CodeBlock
                      code={code}
                      language={lang}
                      showLineNumbers={false}
                      variant="request"
                    />
                  </Box>
                </Tabs.Content>
              ))}
            </Tabs.ContentGroup>
          </Tabs.Root>

          {responseExamples && Object.keys(responseExamples).length > 0 && (
            <Box>
              <Heading size="sm" mb={2}>Response</Heading>
              <Tabs.Root defaultValue={Object.keys(responseExamples)[0]} variant="enclosed">
                <Tabs.List>
                  {Object.keys(responseExamples).map((status) => (
                    <Tabs.Trigger key={status} value={status}>{status}</Tabs.Trigger>
                  ))}
                </Tabs.List>
                <Tabs.ContentGroup>
                  {Object.entries(responseExamples).map(([status, body]) => (
                    <Tabs.Content key={status} value={status} p={0}>
                      <Box borderWidth="1px" borderColor="gray.200" borderRadius="md" overflow="hidden" _dark={{ borderColor: 'gray.700' }}>
                        <CodeBlock code={body} language="json" showLineNumbers={false} variant="response" />
                      </Box>
                    </Tabs.Content>
                  ))}
                </Tabs.ContentGroup>
              </Tabs.Root>
            </Box>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}