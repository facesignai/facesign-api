'use client'

import { Table, Badge, Code, Text, Box } from '@chakra-ui/react'
import { ReactNode } from 'react'

export interface Property {
  name: string
  type: string
  required?: boolean
  description: string | ReactNode
  default?: string
  example?: string
  children?: Property[] // For nested properties
}

interface PropertiesTableProps {
  properties: Property[]
  title?: string
}

/**
 * PropertiesTable - Replacement for MDX `Properties` and `Property` components
 * Uses ReferenceTable styling to match API page (gray.50 background)
 *
 * Usage:
 * <PropertiesTable
 *   title="Request Parameters"
 *   properties={[
 *     {
 *       name: 'flow_id',
 *       type: 'string',
 *       required: true,
 *       description: 'The ID of the flow to use',
 *       example: 'flow_abc123'
 *     },
 *     {
 *       name: 'user_data',
 *       type: 'object',
 *       description: 'User information',
 *       children: [
 *         { name: 'email', type: 'string', description: 'User email' },
 *         { name: 'name', type: 'string', description: 'User full name' }
 *       ]
 *     }
 *   ]}
 * />
 */
export function PropertiesTable({ properties, title }: PropertiesTableProps) {
  // Flatten properties with their children for rendering
  const flattenProperties = (props: Property[], depth = 0): Array<{ property: Property; depth: number }> => {
    const result: Array<{ property: Property; depth: number }> = []

    props.forEach(property => {
      result.push({ property, depth })
      if (property.children) {
        result.push(...flattenProperties(property.children, depth + 1))
      }
    })

    return result
  }

  const flatProperties = flattenProperties(properties)

  return (
    <Box mb={8}>
      {title && (
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          {title}
        </Text>
      )}
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg="gray.50"
        _dark={{ bg: 'gray.900' }}
      >
        <Table.Root size="sm" variant="line">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Type</Table.ColumnHeader>
              <Table.ColumnHeader>Description</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {flatProperties.map(({ property, depth }, index) => (
              <Table.Row key={`${property.name}-${index}`}>
                <Table.Cell>
                  <Box display="flex" alignItems="center" gap={2} paddingLeft={depth > 0 ? `${depth * 20}px` : undefined}>
                    <Code fontSize="sm" fontWeight="semibold">
                      {property.name}
                    </Code>
                    {property.required && (
                      <Badge size="sm" colorPalette="red">
                        required
                      </Badge>
                    )}
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Code fontSize="xs" colorPalette="gray">
                    {property.type}
                  </Code>
                </Table.Cell>
                <Table.Cell>
                  <Text fontSize="sm">{property.description}</Text>
                  {property.default && (
                    <Text fontSize="xs" color="gray.600" mt={1}>
                      Default: <Code fontSize="xs">{property.default}</Code>
                    </Text>
                  )}
                  {property.example && (
                    <Text fontSize="xs" color="gray.600" mt={1}>
                      Example: <Code fontSize="xs">{property.example}</Code>
                    </Text>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  )
}

/**
 * Utility function to convert from old Properties/Property structure
 * to the new format
 */
export function convertProperties(oldProperties: any[]): Property[] {
  return oldProperties.map((prop) => ({
    name: prop.name,
    type: prop.type,
    required: prop.required,
    description: prop.description,
    default: prop.default,
    example: prop.example,
    children: prop.children ? convertProperties(prop.children) : undefined
  }))
}