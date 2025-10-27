'use client'

import { useState } from 'react'
import { Box, Badge, Tabs, Button, Code, VStack, HStack, Text, Heading } from '@chakra-ui/react'

interface ResponsePreviewProps {
  responses: {
    status: number
    description: string
    example: Record<string, any>
  }[]
  title?: string
}

function StatusBadge({ status }: { status: number }) {
  const getStatusColor = (status: number): 'green' | 'red' | 'gray' => {
    if (status >= 200 && status < 300) return 'green'
    if (status >= 400) return 'red'
    return 'gray'
  }

  return (
    <Badge colorPalette={getStatusColor(status)} size="sm">
      {status}
    </Badge>
  )
}

function JsonViewer({ data }: { data: Record<string, any> }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formattedJson = JSON.stringify(data, null, 2)

  return (
    <Box position="relative">
      <Button
        onClick={handleCopy}
        position="absolute"
        right={2}
        top={2}
        zIndex={10}
        size="xs"
        colorPalette={copied ? 'green' : 'gray'}
      >
        {copied ? 'Copied!' : 'Copy'}
      </Button>

      <Box
        as="pre"
        overflowX="auto"
        borderRadius="lg"
        bg="gray.900"
        _dark={{ bg: 'gray.950' }}
        p={4}
        fontSize="sm"
        lineHeight="relaxed"
      >
        <Code display="block" color="gray.100" whiteSpace="pre">
          {formattedJson}
        </Code>
      </Box>
    </Box>
  )
}

export function ResponsePreview({ responses, title = "Response Examples" }: ResponsePreviewProps) {
  return (
    <Box my={6}>
      <Heading as="h4" size="sm" mb={4}>
        {title}
      </Heading>

      <Tabs.Root defaultValue="0">
        <Tabs.List bg="gray.100" _dark={{ bg: 'gray.800' }} borderRadius="lg" p={1}>
          {responses.map((response, index) => (
            <Tabs.Trigger
              key={index}
              value={String(index)}
              w="full"
              borderRadius="md"
              py={2}
              px={3}
              fontSize="xs"
              fontWeight="medium"
            >
              <HStack gap={2} justify="center">
                <StatusBadge status={response.status} />
                <Text hideBelow="sm">{response.description}</Text>
              </HStack>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {responses.map((response, index) => (
          <Tabs.Content key={index} value={String(index)} mt={4}>
            <VStack align="stretch" gap={4}>
              <HStack gap={3}>
                <StatusBadge status={response.status} />
                <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                  {response.description}
                </Text>
              </HStack>

              <JsonViewer data={response.example} />
            </VStack>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Box>
  )
}