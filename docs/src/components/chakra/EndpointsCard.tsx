'use client'

import {
  Badge,
  Card,
  HStack,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  description: string
  href: string
}

interface EndpointsCardProps {
  endpoints: Endpoint[]
}

const methodColors = {
  GET: 'green',
  POST: 'blue',
  PUT: 'orange',
  PATCH: 'purple',
  DELETE: 'red',
}

export function EndpointsCard({ endpoints }: EndpointsCardProps) {
  return (
    <Card.Root variant="outline" bg="gray.50">
      <Card.Body>
        <VStack align="stretch" gap={3}>
          {endpoints.map((endpoint, idx) => (
            <HStack key={idx} gap={3} alignItems="center">
              <Badge
                colorPalette={methodColors[endpoint.method]}
                variant="solid"
                fontWeight="bold"
                minW="16"
                textAlign="center"
              >
                {endpoint.method}
              </Badge>
              <Link
                href={endpoint.href}
                fontFamily="mono"
                fontSize="sm"
                fontWeight="medium"
                color="blue.600"
                _hover={{ color: 'blue.700', textDecoration: 'underline' }}
              >
                {endpoint.path}
              </Link>
              <Text fontSize="sm" color="gray.600">
                {endpoint.description}
              </Text>
            </HStack>
          ))}
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}
