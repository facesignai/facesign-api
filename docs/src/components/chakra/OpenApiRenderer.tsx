'use client'

import { Box, Heading, VStack } from '@chakra-ui/react'
// Lazy parse YAML without adding new types: expect JSON string if used; skip when absent

// Minimal OpenAPI → Chakra renderer for params and responses
export function OpenApiRenderer({
  specYaml,
  path,
  method,
  children,
}: {
  specYaml: string
  path: string
  method: string
  children?: React.ReactNode
}) {
  let spec: any = {}
  try {
    spec = JSON.parse(specYaml)
  } catch {
    // keep empty; renderer is best-effort
  }
  const op = spec?.paths?.[path]?.[method.toLowerCase()]
  if (!op) return null
  const parameters = op.parameters || []
  const responses = op.responses || {}
  return (
    <VStack align="stretch" gap={6}>
      <Box>
        <Heading size="md">Parameters</Heading>
        <pre>{JSON.stringify(parameters, null, 2)}</pre>
      </Box>
      <Box>
        <Heading size="md">Responses</Heading>
        <pre>{JSON.stringify(responses, null, 2)}</pre>
      </Box>
      {children}
    </VStack>
  )
}


