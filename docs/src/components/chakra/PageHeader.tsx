'use client'

import { Box, Heading, Text, HStack, Badge } from '@chakra-ui/react'

interface PageHeaderProps {
  title: string
  description?: string
  badges?: Array<{ label: string; colorScheme?: string }>
}

export function PageHeader({ title, description, badges }: PageHeaderProps) {
  return (
    <Box mb={6}>
      <HStack gap={3} flexWrap="wrap" mb={2}>
        {badges?.map((b, i) => (
          <Badge key={i} colorPalette={b.colorScheme || 'gray'}>{b.label}</Badge>
        ))}
      </HStack>
      <Heading as="h1" size="2xl" mb={2}>
        {title}
      </Heading>
      {description && (
        <Text fontSize="lg" color="gray.600">
          {description}
        </Text>
      )}
    </Box>
  )
}


