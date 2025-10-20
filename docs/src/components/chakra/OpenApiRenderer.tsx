'use client'

import { Box, Heading, VStack, Table } from '@chakra-ui/react'

// Minimal OpenAPI → Chakra renderer for params and responses
export function OpenApiRenderer({
  spec,
  path,
  method,
}: {
  spec: any
  path: string
  method: string
}) {
  const op = spec?.paths?.[path]?.[method.toLowerCase()]
  if (!op) return null
  const parameters = Array.isArray(op.parameters) ? op.parameters : []
  const responses = op.responses || {}
  return (
    <VStack align="stretch" gap={4}>
      {parameters.length > 0 && (
        <Box>
          <Heading size="sm" mb={2}>Parameters (from spec)</Heading>
          <Table.Root variant="line">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>In</Table.ColumnHeader>
                <Table.ColumnHeader>Required</Table.ColumnHeader>
                <Table.ColumnHeader>Type</Table.ColumnHeader>
                <Table.ColumnHeader>Description</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {parameters.map((p: any, idx: number) => (
                <Table.Row key={idx}>
                  <Table.Cell>{p.name}</Table.Cell>
                  <Table.Cell>{p.in}</Table.Cell>
                  <Table.Cell>{p.required ? 'yes' : 'no'}</Table.Cell>
                  <Table.Cell>{p.schema?.type || (p.schema?.oneOf ? 'oneOf' : '')}</Table.Cell>
                  <Table.Cell>{p.description || ''}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

      {responses && (
        <Box>
          <Heading size="sm" mb={2}>Responses (from spec)</Heading>
          <Table.Root variant="line">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Description</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {Object.entries(responses).map(([code, r]: any) => (
                <Table.Row key={code}>
                  <Table.Cell>{code}</Table.Cell>
                  <Table.Cell>{r?.description || ''}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </VStack>
  )
}


