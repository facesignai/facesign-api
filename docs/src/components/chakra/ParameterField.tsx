'use client'

import {
  Box,
  HStack,
  VStack,
  Badge,
  Code,
} from '@chakra-ui/react'

export interface ParameterFieldProps {
  name: string
  type?: string
  required?: boolean
  children: React.ReactNode
}

/**
 * ParameterField - API parameter documentation component
 *
 * Displays parameter name, type, required status, and description
 * in a clean, professional format for API documentation
 *
 * Usage:
 * <ParameterField name="clientReferenceId" type="string">
 *   Your internal reference ID for this verification (e.g., your user ID).
 * </ParameterField>
 *
 * <ParameterField name="flow" type="object" required>
 *   Node-based flow definition containing nodes and edges arrays.
 * </ParameterField>
 */
export function ParameterField({
  name,
  type,
  required = false,
  children,
}: ParameterFieldProps) {
  return (
    <Box
      as="dl"
      py={4}
      borderBottomWidth="1px"
      borderColor="border.muted"
      _last={{ borderBottomWidth: 0 }}
    >
      <HStack gap={3} mb={2} align="center" wrap="wrap">
        <Code
          as="dt"
          fontSize="sm"
          fontWeight="semibold"
          colorScheme="green"
          px={2}
          py={0.5}
        >
          {name}
        </Code>

        {type && (
          <Badge
            size="sm"
            variant="subtle"
            colorScheme="gray"
            fontFamily="mono"
            fontSize="xs"
          >
            {type}
          </Badge>
        )}

        {required && (
          <Badge
            size="sm"
            variant="solid"
            colorScheme="red"
            fontSize="xs"
            textTransform="uppercase"
          >
            Required
          </Badge>
        )}
      </HStack>

      <Box
        as="dd"
        mt={0}
        ml={0}
        color="fg.muted"
        fontSize="sm"
        lineHeight="tall"
        css={{
          '& p': {
            marginBottom: 'var(--chakra-spacing-2)',
            '&:last-child': { marginBottom: 0 },
          },
          '& code': {
            fontSize: 'var(--chakra-fontSizes-xs)',
            backgroundColor: 'var(--chakra-colors-gray-100)',
            paddingLeft: 'var(--chakra-spacing-1)',
            paddingRight: 'var(--chakra-spacing-1)',
            paddingTop: 'var(--chakra-spacing-0\\.5)',
            paddingBottom: 'var(--chakra-spacing-0\\.5)',
            borderRadius: 'var(--chakra-radii-sm)',
            fontFamily: 'var(--chakra-fonts-mono)',
            color: 'var(--chakra-colors-gray-800)',
          },
          '.chakra-ui-dark &': {
            '& code': {
              backgroundColor: 'var(--chakra-colors-gray-800)',
              color: 'var(--chakra-colors-gray-200)',
            },
          },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

/**
 * ParametersSection - Wrapper for groups of parameter fields
 *
 * Usage:
 * <ParametersSection>
 *   <ParameterField name="param1" type="string">Description</ParameterField>
 *   <ParameterField name="param2" type="number">Description</ParameterField>
 * </ParametersSection>
 */
export function ParametersSection({ children }: { children: React.ReactNode }) {
  return (
    <VStack
      align="stretch"
      gap={0}
      borderWidth="1px"
      borderColor="border"
      borderRadius="md"
      overflow="hidden"
      mb={6}
      bg="bg.subtle"
      _dark={{ bg: 'gray.800/50' }}
    >
      {children}
    </VStack>
  )
}
