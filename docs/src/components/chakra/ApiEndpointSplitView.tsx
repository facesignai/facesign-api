'use client'

import {
  Badge,
  Box,
  Card,
  Code,
  Grid,
  HStack,
  Heading,
  Stack,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react'
import { CodeBlock } from './CodeBlock'
import { ApiParameterField } from './ApiParameterField'
import { useColorModeValue } from '@/components/ui/color-mode'

interface ApiEndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  description: string
  parameters?: Array<{
    name: string
    type: string
    required?: boolean
    description: string
    example?: string
  }>
  requestBody?: {
    content: string
    example?: string
  }
  responses?: {
    [key: string]: {
      description: string
      content: string
    }
  }
  codeExamples?: {
    [language: string]: string
  }
  id?: string
}

const methodColors = {
  GET: 'green',
  POST: 'blue',
  PUT: 'orange',
  PATCH: 'purple',
  DELETE: 'red',
}

export function ApiEndpointSplitView({
  method,
  path,
  description,
  parameters,
  requestBody,
  responses,
  codeExamples = {},
  id,
}: ApiEndpointProps) {
  const cardBg = useColorModeValue('white', 'gray.800')
  const headerBg = useColorModeValue('gray.50', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const codeBg = useColorModeValue('gray.50', 'gray.900')

  // Default code examples if none provided
  const defaultCurlExample = `curl -X ${method} https://api.facesign.ai/v1${path} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"${
    requestBody ? ` \\
  -d '${requestBody.example || '{}'}'` : ''
  }`

  const examples = {
    curl: codeExamples.curl || defaultCurlExample,
    ...codeExamples,
  }

  return (
    <Box id={id} scrollMarginTop="80px" mb={12}>
      <Grid
        templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
        gap={6}
        alignItems="start"
      >
        {/* Left Panel - API Details */}
        <Box>
          <Card.Root bg={cardBg} overflow="hidden">
            <Card.Header bg={headerBg} pb={4}>
              <HStack gap={3} mb={3}>
                <Badge
                  size="lg"
                  colorPalette={methodColors[method]}
                  variant="solid"
                >
                  {method}
                </Badge>
                <Code fontSize="md" fontWeight="semibold">
                  {path}
                </Code>
              </HStack>
              <Text color="fg.muted" fontSize="sm">
                {description}
              </Text>
            </Card.Header>

            <Card.Body>
              <Stack gap={6}>
                {/* Parameters Section */}
                {parameters && parameters.length > 0 && (
                  <Box>
                    <Heading size="sm" mb={4} id={id ? `${id}-parameters` : undefined}>
                      Parameters
                    </Heading>
                    <VStack align="stretch" gap={2}>
                      {parameters.map((param) => (
                        <ApiParameterField
                          key={param.name}
                          {...param}
                        />
                      ))}
                    </VStack>
                  </Box>
                )}

                {/* Request Body Section */}
                {requestBody && (
                  <Box>
                    <Heading size="sm" mb={4} id={id ? `${id}-request-body` : undefined}>
                      Request Body
                    </Heading>
                    <Box
                      borderWidth="1px"
                      borderColor={borderColor}
                      borderRadius="md"
                      p={4}
                    >
                      <Code
                        as="pre"
                        fontSize="sm"
                        bg="transparent"
                        whiteSpace="pre-wrap"
                      >
                        {requestBody.content}
                      </Code>
                    </Box>
                  </Box>
                )}

                {/* Responses Section */}
                {responses && (
                  <Box>
                    <Heading size="sm" mb={4} id={id ? `${id}-responses` : undefined}>
                      Responses
                    </Heading>
                    <Tabs.Root defaultValue={Object.keys(responses)[0]}>
                      <Tabs.List>
                        {Object.keys(responses).map((statusCode) => (
                          <Tabs.Trigger key={statusCode} value={statusCode}>
                            <Badge
                              colorPalette={
                                statusCode.startsWith('2') ? 'green' :
                                statusCode.startsWith('4') ? 'yellow' :
                                'red'
                              }
                              variant="subtle"
                            >
                              {statusCode}
                            </Badge>
                            <Text ml={2} fontSize="sm">
                              {responses[statusCode].description}
                            </Text>
                          </Tabs.Trigger>
                        ))}
                      </Tabs.List>
                      <Tabs.ContentGroup>
                        {Object.entries(responses).map(([statusCode, response]) => (
                          <Tabs.Content key={statusCode} value={statusCode}>
                            <Box mt={4}>
                              <Code
                                as="pre"
                                fontSize="sm"
                                bg={codeBg}
                                p={4}
                                borderRadius="md"
                                whiteSpace="pre-wrap"
                              >
                                {response.content}
                              </Code>
                            </Box>
                          </Tabs.Content>
                        ))}
                      </Tabs.ContentGroup>
                    </Tabs.Root>
                  </Box>
                )}
              </Stack>
            </Card.Body>
          </Card.Root>
        </Box>

        {/* Right Panel - Code Examples */}
        <Box
          position={{ lg: 'sticky' }}
          top={{ lg: '100px' }}
        >
          <Card.Root bg={cardBg}>
            <Card.Header bg={headerBg}>
              <Heading size="sm" id={id ? `${id}-code-examples` : undefined}>
                Code Examples
              </Heading>
            </Card.Header>
            <Card.Body p={0}>
              <Tabs.Root defaultValue="curl">
                <Tabs.List px={4} pt={4}>
                  {Object.keys(examples).map((lang) => (
                    <Tabs.Trigger key={lang} value={lang}>
                      {lang === 'curl' && 'cURL'}
                      {lang === 'javascript' && 'JavaScript'}
                      {lang === 'python' && 'Python'}
                      {lang === 'go' && 'Go'}
                      {lang === 'php' && 'PHP'}
                      {lang === 'ruby' && 'Ruby'}
                      {!['curl', 'javascript', 'python', 'go', 'php', 'ruby'].includes(lang) && lang}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
                <Tabs.ContentGroup>
                  {Object.entries(examples).map(([lang, code]) => (
                    <Tabs.Content key={lang} value={lang} p={4}>
                      <CodeBlock
                        code={code}
                        language={lang}
                      />
                    </Tabs.Content>
                  ))}
                </Tabs.ContentGroup>
              </Tabs.Root>
            </Card.Body>
          </Card.Root>
        </Box>
      </Grid>
    </Box>
  )
}