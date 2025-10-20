'use client'

import {
  Badge,
  Box,
  Code,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useColorModeValue } from '@/components/ui/color-mode'

interface ApiParameterFieldProps {
  name: string
  type: string
  required?: boolean
  description: string
  example?: string
  children?: React.ReactNode
}

export function ApiParameterField({
  name,
  type,
  required,
  description,
  example,
  children
}: ApiParameterFieldProps) {
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgHover = useColorModeValue('gray.50', 'gray.800')
  const codeBg = useColorModeValue('gray.100', 'gray.900')

  return (
    <Box
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      mb={3}
      transition="all 0.2s"
      _hover={{
        bg: bgHover,
        borderColor: useColorModeValue('gray.300', 'gray.600')
      }}
    >
      <VStack align="stretch" gap={3}>
        <HStack justify="space-between">
          <HStack gap={2}>
            <Code
              size="sm"
              fontWeight="semibold"
              colorPalette="blue"
              variant="subtle"
            >
              {name}
            </Code>
            <Badge
              size="sm"
              colorPalette="purple"
              variant="subtle"
            >
              {type}
            </Badge>
            {required && (
              <Badge
                size="sm"
                colorPalette="red"
                variant="subtle"
              >
                required
              </Badge>
            )}
          </HStack>
        </HStack>

        <Text fontSize="sm" color="fg.muted">
          {description}
        </Text>

        {example && (
          <Box>
            <Text fontSize="xs" fontWeight="medium" mb={2} color="fg.muted">
              Example:
            </Text>
            <Box
              bg={codeBg}
              p={3}
              borderRadius="md"
              fontSize="xs"
              fontFamily="mono"
            >
              <Code fontSize="xs" bg="transparent">
                {example}
              </Code>
            </Box>
          </Box>
        )}

        {children}
      </VStack>
    </Box>
  )
}