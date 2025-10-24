'use client'

import NextLink from 'next/link'
import { Card, Heading, Text } from '@chakra-ui/react'

interface DocLinkCardProps {
  href: string
  title: string
  description?: string
}

export function DocLinkCard({ href, title, description }: DocLinkCardProps) {
  return (
    <NextLink href={href} passHref legacyBehavior>
      <Card.Root
        as="a"
        borderWidth="1px"
        _hover={{ borderColor: 'green.500', transform: 'translateY(-2px)', boxShadow: 'md' }}
        transition="all 0.2s"
     >
        <Card.Body>
          <Heading as="h3" size="md" mb={1}>{title}</Heading>
          {description && <Text color="gray.600" fontSize="sm">{description}</Text>}
        </Card.Body>
      </Card.Root>
    </NextLink>
  )
}


