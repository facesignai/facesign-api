'use client'

import { Badge, Box, Card, HStack, Heading, Link, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'

interface EndpointItem {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  label: string
  href: string
}

const methodColor: Record<string, string> = {
  GET: 'green',
  POST: 'blue',
  PUT: 'orange',
  PATCH: 'purple',
  DELETE: 'red',
}

export function ApiEndpointsCard({ title = 'Endpoints', items }: { title?: string; items: EndpointItem[] }) {
  return (
    <Card.Root variant="elevated">
      <Card.Body>
        <VStack align="stretch" gap={3}>
          <Heading size="sm">{title}</Heading>
          <VStack align="stretch" gap={2}>
            {items.map((it) => (
              <HStack key={it.href} justify="space-between">
                <Badge size="sm" colorPalette={methodColor[it.method]} variant="subtle">{it.method}</Badge>
                <Box flex="1" ml={3}>
                  <Link as={NextLink} href={it.href}>{it.label}</Link>
                </Box>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}


