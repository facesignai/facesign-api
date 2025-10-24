'use client'

import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useId } from 'react'
import { LuLink } from 'react-icons/lu'

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
  const generatedId = useId()
  const anchorId = `param-${generatedId}`

  return (
    <Box pt="2.5" pb="5" my="2.5" borderBottomWidth="1px" borderColor="border.muted">
      <Flex
        textStyle="sm"
        fontFamily="mono"
        position="relative"
        alignItems="flex-start"
        id={anchorId}
        _hover={{ '& .anchor-link': { opacity: 1 } }}
      >
        <VStack flex="1" align="stretch" mr="5">
          <HStack align="center" wrap="wrap" gap="2" py="0.5">
            <Box position="absolute" top="-1.5">
              <Link
                py="2"
                ml="-10"
                border="0"
                opacity="0"
                display="flex"
                href={`#${anchorId}`}
                alignItems="center"
                data-anchor-link
                transition="opacity 0.2s"
              >
                <Flex
                  w="6"
                  h="6"
                  rounded="md"
                  color="fg.muted"
                  borderWidth="1px"
                  alignItems="center"
                  transition="all 0.2s"
                  justifyContent="center"
                  borderColor="border.muted"
                >
                  <Box as={LuLink} boxSize="3" />
                </Flex>
              </Link>
            </Box>

            <Text cursor="pointer" color="blue.600" fontWeight="semibold" wordBreak="break-all">
              {name}
            </Text>

            <HStack gap="2" textStyle="xs" fontWeight="medium">
              <Badge variant="surface" size="sm">
                {type}
              </Badge>
              {required && (
                <Badge size="sm" variant="surface" colorPalette="red">
                  required
                </Badge>
              )}
            </HStack>
          </HStack>
        </VStack>
      </Flex>
      <Text mt="4" textStyle="sm" color="fg.muted">
        {description}
      </Text>

      {example && (
        <Box mt="3" textStyle="xs" color="fg.muted">
          <Heading as="span" size="xs" fontWeight="medium" mr="2">Example:</Heading>
          <Text as="span" fontFamily="mono">{example}</Text>
        </Box>
      )}

      {children}
    </Box>
  )
}