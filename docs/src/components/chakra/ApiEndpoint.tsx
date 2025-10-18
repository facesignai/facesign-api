'use client'

import {
  Badge,
  Box,
  Code,
  HStack,
  Heading,
  Separator,
  Stack,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react'
import { CodeBlock } from './CodeBlock'

interface ApiParameter {
  name: string
  type: string
  required?: boolean
  description: string
  example?: string
}

interface ApiEndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  description: string
  parameters?: ApiParameter[]
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
  id?: string
}

const methodColors = {
  GET: 'green',
  POST: 'blue',
  PUT: 'orange',
  PATCH: 'purple',
  DELETE: 'red',
}

// Chakra Pro parameter-field-001 pattern
function ParameterField({ name, type, required, description, example }: ApiParameter) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={6}
      borderColor="gray.200"
      _dark={{
        borderColor: 'gray.700'
      }}
    >
      <HStack justify="space-between" mb={3}>
        <HStack gap={3}>
          <Code fontSize="sm" fontWeight="semibold">
            {name}
          </Code>
          <Badge size="sm" colorPalette="gray" variant="subtle">
            {type}
          </Badge>
          {required && (
            <Badge size="sm" colorPalette="red" variant="subtle">
              required
            </Badge>
          )}
        </HStack>
      </HStack>
      <Text fontSize="sm" color="fg.muted" mb={example ? 3 : 0}>
        {description}
      </Text>
      {example && (
        <Code fontSize="xs" bg="bg.muted" px={3} py={1.5} borderRadius="sm">
          {example}
        </Code>
      )}
    </Box>
  )
}

export function ApiEndpoint({
  method,
  path,
  description,
  parameters,
  requestBody,
  responses,
  id,
}: ApiEndpointProps) {
  return (
    <Box id={id} scrollMarginTop="80px" mb={12}>
      <Stack gap={8}>
        {/* Header - Using pattern from parameter-field-001 */}
        <Box>
          <HStack gap={4} mb={4}>
            <Badge
              size="lg"
              colorPalette={methodColors[method]}
              variant="solid"
            >
              {method}
            </Badge>
            <Code fontSize="lg" fontWeight="semibold">
              {path}
            </Code>
          </HStack>
          <Text color="fg.muted" fontSize="md">
            {description}
          </Text>
        </Box>

        {/* Parameters Section - Using Chakra Pro parameter-field-001 */}
        {parameters && parameters.length > 0 && (
          <Box>
            <Heading size="md" mb={5}>
              Parameters
            </Heading>
            <VStack align="stretch" gap={4}>
              {parameters.map((param) => (
                <ParameterField key={param.name} {...param} />
              ))}
            </VStack>
          </Box>
        )}

        {/* Request Body Section - Using Chakra Pro code-block-006 */}
        {requestBody && (
          <Box>
            <Heading size="md" mb={5}>
              Request Body
            </Heading>
            <Box
              borderWidth="1px"
              borderRadius="md"
              overflow="hidden"
              borderColor="gray.200"
              _dark={{
                borderColor: 'gray.700'
              }}
            >
              <Box
                bg="gray.50"
                _dark={{
                  bg: 'gray.900',
                  borderBottomColor: 'gray.700'
                }}
                px={5}
                py={3}
                borderBottomWidth="1px"
                borderBottomColor="gray.200"
              >
                <Text fontSize="sm" fontWeight="medium">
                  application/json
                </Text>
              </Box>
              <CodeBlock
                code={requestBody.content}
                language="json"
                showLineNumbers={false}
              />
            </Box>
          </Box>
        )}

        {/* Responses Section - Using Chakra Pro code-block-002 */}
        {responses && (
          <Box>
            <Heading size="md" mb={5}>
              Responses
            </Heading>
            <Tabs.Root defaultValue={Object.keys(responses)[0]}>
              <Tabs.List>
                {Object.keys(responses).map((statusCode) => (
                  <Tabs.Trigger key={statusCode} value={statusCode}>
                    <HStack gap={3}>
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
                      <Text fontSize="sm">
                        {responses[statusCode].description}
                      </Text>
                    </HStack>
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              <Tabs.ContentGroup>
                {Object.entries(responses).map(([statusCode, response]) => (
                  <Tabs.Content key={statusCode} value={statusCode}>
                    <Box
                      mt={5}
                      borderWidth="1px"
                      borderRadius="md"
                      overflow="hidden"
                      borderColor="gray.200"
                      _dark={{
                        borderColor: 'gray.700'
                      }}
                    >
                      <Box
                        bg={statusCode.startsWith('2') ? 'green.50' : 'red.50'}
                        _dark={{
                          bg: statusCode.startsWith('2') ? 'green.900/20' : 'red.900/20',
                          borderBottomColor: 'gray.700'
                        }}
                        px={5}
                        py={3}
                        borderBottomWidth="1px"
                        borderBottomColor="gray.200"
                      >
                        <Text fontSize="sm" fontWeight="medium">
                          application/json
                        </Text>
                      </Box>
                      <CodeBlock
                        code={response.content}
                        language="json"
                        showLineNumbers={false}
                      />
                    </Box>
                  </Tabs.Content>
                ))}
              </Tabs.ContentGroup>
            </Tabs.Root>
          </Box>
        )}
      </Stack>

      {/* Separator between endpoints */}
      <Separator mt={12} />
    </Box>
  )
}