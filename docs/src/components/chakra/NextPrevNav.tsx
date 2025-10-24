'use client'

import NextLink from 'next/link'
import { Box, Button, Flex } from '@chakra-ui/react'

interface NavItem {
  label: string
  href: string
}

interface NextPrevNavProps {
  prev?: NavItem
  next?: NavItem
}

export function NextPrevNav({ prev, next }: NextPrevNavProps) {
  if (!prev && !next) return null
  return (
    <Flex mt={8} pt={6} borderTopWidth="1px" justify="space-between" gap={4} flexWrap="wrap">
      <Box flex="1" minW="200px">
        {prev && (
          <NextLink href={prev.href} passHref legacyBehavior>
            <Button as="a" variant="outline">← {prev.label}</Button>
          </NextLink>
        )}
      </Box>
      <Box flex="1" minW="200px" textAlign="right">
        {next && (
          <NextLink href={next.href} passHref legacyBehavior>
            <Button as="a" colorScheme="green">{next.label} →</Button>
          </NextLink>
        )}
      </Box>
    </Flex>
  )
}


