'use client'

import {
  Badge,
  Box,
  ClientOnly,
  Code,
  Grid,
  Heading,
  Skeleton,
  Stack,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react'
import { RequestCodeBlock } from './RequestCodeBlock'
import { ResponseCodeBlock } from './ResponseCodeBlock'
import { ApiParameterField } from './ApiParameterField'

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
  showResponsesLeft?: boolean
  spec?: any
  specPath?: string
  specMethod?: string
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
  showResponsesLeft = false,
  spec,
  specPath,
  specMethod,
}: ApiEndpointProps) {
  // Build parameters from spec if provided
  const specOp = spec && specPath && specMethod ? spec?.paths?.[specPath]?.[specMethod.toLowerCase?.() || specMethod] : undefined
  const specParams = Array.isArray(specOp?.parameters) ? specOp.parameters : []
  const specParamFields = specParams.map((p: any) => ({
    name: p.name,
    type: p.schema?.type || (p.schema?.oneOf ? 'oneOf' : 'object'),
    required: !!p.required,
    description: p.description || '',
  }))

  // Request body fields from spec (shallow)
  const requestSchema = specOp?.requestBody?.content?.['application/json']?.schema
  const bodyFields = requestSchema?.properties ? Object.entries(requestSchema.properties).map(([key, val]: any) => ({
    name: key as string,
    type: (val?.type || (val?.oneOf ? 'oneOf' : 'object')) as string,
    required: Array.isArray(requestSchema.required) ? requestSchema.required.includes(key) : false,
    description: (val?.description || '') as string,
    schema: val,
  })) : []

  function renderNested(schema: any, parentRequired: string[] | undefined): React.ReactNode {
    if (!schema) return null
    const sType = schema.type || (schema.oneOf ? 'oneOf' : (schema.anyOf ? 'anyOf' : undefined))

    if (sType === 'object' && schema.properties) {
      const req = Array.isArray(schema.required) ? schema.required : []
      return (
        <VStack align="stretch" gap={2}>
          {Object.entries(schema.properties).map(([k, v]: any) => (
            <ApiParameterField
              key={k}
              name={k}
              type={(v?.type || (v?.oneOf ? 'oneOf' : 'object')) as string}
              required={req.includes(k)}
              description={(v?.description || '') as string}
            >
              {renderNested(v, req)}
            </ApiParameterField>
          ))}
        </VStack>
      )
    }

    if (sType === 'array') {
      const item = schema.items || {}
      const itemType = item.type || (item.oneOf ? 'oneOf' : 'object')
      // If array of objects, render object children
      if (itemType === 'object' && item.properties) {
        return (
          <VStack align="stretch" gap={2}>
            {Object.entries(item.properties).map(([k, v]: any) => (
              <ApiParameterField
                key={k}
                name={`${k}`}
                type={(v?.type || (v?.oneOf ? 'oneOf' : 'object')) as string}
                required={Array.isArray(item.required) ? item.required.includes(k) : false}
                description={(v?.description || '') as string}
              >
                {renderNested(v, item.required)}
              </ApiParameterField>
            ))}
          </VStack>
        )
      }
      // Array of primitives or union types
      return (
        <VStack align="stretch" gap={2}>
          <ApiParameterField
            name="[item]"
            type={itemType as string}
            required={false}
            description={typeof item?.description === 'string' ? item.description : ''}
          >
            {item.oneOf || item.anyOf ? (
              <VStack align="stretch" gap={1}>
                {(item.oneOf || item.anyOf).map((variant: any, idx: number) => (
                  <ApiParameterField
                    key={idx}
                    name={`variant_${idx+1}`}
                    type={variant?.type || 'object'}
                    required={false}
                    description={variant?.description || ''}
                  />
                ))}
              </VStack>
            ) : null}
          </ApiParameterField>
        </VStack>
      )
    }

    // oneOf/anyOf at object level (non-array)
    if (schema.oneOf || schema.anyOf) {
      const variants = schema.oneOf || schema.anyOf
      return (
        <VStack align="stretch" gap={2}>
          {variants.map((variant: any, idx: number) => (
            <ApiParameterField
              key={idx}
              name={`variant_${idx+1}`}
              type={variant?.type || 'object'}
              required={false}
              description={variant?.description || ''}
            >
              {renderNested(variant, parentRequired)}
            </ApiParameterField>
          ))}
        </VStack>
      )
    }

    return null
  }

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
        templateColumns={{ base: '1fr', lg: 'minmax(400px, 45%) minmax(400px, 55%)' }}
        gap={6}
        alignItems="start"
      >
        {/* Left Panel - API Details */}
        <Box>
          <ClientOnly fallback={<Skeleton height="400px" />}>
            <Stack gap={6}>
              {/* Section Title */}
              <Heading size="lg" mb={2}>
                {description}
              </Heading>
                  {/* Parameters Section */}
                  {(parameters && parameters.length > 0) || (specParamFields.length > 0) ? (
                    <Box>
                      <Heading size="sm" mb={4} id={id ? `${id}-parameters` : undefined}>
                        Parameters
                      </Heading>
                      <VStack align="stretch" gap={2}>
                        {[...(parameters || []), ...specParamFields].map((param, idx) => (
                          <ApiParameterField
                            key={`${param.name}-${idx}`}
                            {...param}
                          />
                        ))}
                      </VStack>
                    </Box>
                  ) : null}

                  {/* Request Body Section */}
                  {(bodyFields && bodyFields.length > 0) && (
                    <Box>
                      <Heading size="sm" mb={4} id={id ? `${id}-request-body` : undefined}>
                        Request Body
                      </Heading>
                      <VStack align="stretch" gap={2}>
                        {bodyFields.map((field: any, idx: number) => (
                          <ApiParameterField
                            key={`${field.name}-${idx}`}
                            name={field.name}
                            type={field.type}
                            required={field.required}
                            description={field.description}
                          >
                            {renderNested(field.schema, Array.isArray(requestSchema?.required) ? requestSchema.required : [])}
                          </ApiParameterField>
                        ))}
                      </VStack>
                    </Box>
                  )}

                  {/* Responses Section (optional on left) */}
                  {showResponsesLeft && responses && (
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
                                  bg="gray.100"
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
          </ClientOnly>
        </Box>

        {/* Right Panel - Code Examples */}
        <Box
          position={{ lg: 'sticky' }}
          top={{ lg: '100px' }}
        >
          <VStack align="stretch" gap={4}>
            {/* Request Code Block */}
            <RequestCodeBlock
              method={method}
              path={path}
              codeExamples={examples}
            />

            {/* Response Code Block */}
            {responses && (
              <Box>
                <Heading size="xs" mb={4}>Response</Heading>
                <ResponseCodeBlock responses={responses} />
              </Box>
            )}
          </VStack>
        </Box>
      </Grid>
    </Box>
  )
}