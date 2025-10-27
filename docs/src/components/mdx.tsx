import Link from 'next/link'
import React from 'react'
import {
  Heading as ChakraHeading,
  Box,
  Grid,
  VStack,
  HStack,
  Text,
  Code,
  Separator,
  Collapsible
} from '@chakra-ui/react'

import { ApiEndpoint } from '@/components/ApiEndpoint'
import { FlowDiagram } from '@/components/FlowDiagram'
import { ResponsePreview } from '@/components/ResponsePreview'
import { CollapsibleSection } from '@/components/CollapsibleSection'
import { DocsLayout } from '@/components/chakra/DocsLayout'
import { ApiEndpointsCard } from '@/components/chakra/ApiEndpointsCard'

// Import new Chakra components
import { DocsCodeBlock } from '@/components/chakra/DocsCodeBlock'
import { PropertiesTable, type Property } from '@/components/chakra/PropertiesTable'

export const a = Link
export { Button } from '@/components/Button'

export function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout>
      <Box as="article" py={8} width="full">
        {children}
      </Box>
    </DocsLayout>
  )
}

export const h2 = function H2(
  props: React.ComponentPropsWithoutRef<'h2'>,
) {
  return (
    <ChakraHeading
      as="h2"
      textStyle="docs.heading"
      fontSize="2xl"
      mt={8}
      mb={4}
      {...props}
    />
  )
}

// Export Stripe-style Blockquote-based Note and Warning components
// Replaces Alert-based InfoAlert and WarningAlert
export function Note({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <Box
      as="blockquote"
      my={6}
      borderLeft="4px solid"
      borderColor="gray.300"
      pl={4}
      py={3}
      bg="gray.50"
      borderRadius="md"
      _dark={{ borderColor: 'gray.700', bg: 'gray.800' }}
    >
      {title && (
        <Text fontWeight="semibold" mb={2} color="gray.900" _dark={{ color: 'white' }}>
          {title}
        </Text>
      )}
      <Box color="gray.700" _dark={{ color: 'gray.300' }}>
        {children}
      </Box>
    </Box>
  )
}

export function Warning({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <Box
      as="blockquote"
      my={6}
      borderLeft="4px solid"
      borderColor="orange.400"
      pl={4}
      py={3}
      bg="orange.50"
      borderRadius="md"
      _dark={{ borderColor: 'orange.600', bg: 'orange.900/20' }}
    >
      {title && (
        <Text fontWeight="semibold" mb={2} color="orange.900" _dark={{ color: 'orange.200' }}>
          {title}
        </Text>
      )}
      <Box color="orange.800" _dark={{ color: 'orange.300' }}>
        {children}
      </Box>
    </Box>
  )
}

export function Row({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      templateColumns={{ base: '1fr', xl: 'repeat(2, 1fr)' }}
      gap={{ base: 10, xl: 16 }}
      alignItems="start"
      mb={8}
    >
      {children}
    </Grid>
  )
}

export function Col({
  children,
  sticky = false,
}: {
  children: React.ReactNode
  sticky?: boolean
}) {
  return (
    <Box
      position={sticky ? { xl: 'sticky' } : 'relative'}
      top={sticky ? { xl: '6rem' } : 'auto'}
      css={{
        '& > *:first-of-type': { marginTop: 0 },
        '& > *:last-child': { marginBottom: 0 },
      }}
    >
      {children}
    </Box>
  )
}

export function Properties({ children, showType = true }: { children: React.ReactNode; showType?: boolean }) {
  // Convert MDX Property children to PropertiesTable format
  const properties: Property[] = React.Children.toArray(children)
    .filter((child): child is React.ReactElement => {
      return React.isValidElement(child) && typeof child.props === 'object'
    })
    .map((child) => {
      return {
        name: child.props.name || '',
        type: child.props.type,
        description: child.props.children,
      }
    })

  return <PropertiesTable properties={properties} showType={showType} />
}

export function Property({
  name: _name,
  children: _children,
  type: _type,
}: {
  name: string
  children: React.ReactNode
  type?: string
}) {
  // This component is just a data holder for Properties to parse
  // It doesn't render anything itself
  return null
}

export function Details({
  children,
  summary,
}: {
  children: React.ReactNode
  summary?: string
}) {
  return (
    <Collapsible.Root my={4}>
      <Collapsible.Trigger
        px={3}
        py={2}
        bg="gray.100"
        _dark={{ bg: 'gray.800' }}
        borderRadius="md"
        fontWeight="medium"
        fontSize="sm"
        cursor="pointer"
        _hover={{ bg: 'gray.200', _dark: { bg: 'gray.700' } }}
      >
        {summary || 'Show details'}
      </Collapsible.Trigger>
      <Collapsible.Content
        mt={2}
        pl={4}
        borderLeftWidth="2px"
        borderColor="gray.200"
        _dark={{ borderColor: 'gray.700' }}
      >
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

// Export new components for use in MDX
export { ApiEndpoint, FlowDiagram, ResponsePreview, CollapsibleSection, ApiEndpointsCard }

// Export new Chakra components for MDX usage
export {
  DocsCodeBlock,
  PropertiesTable,
  Grid,
  VStack,
  HStack,
  Box,
  Text,
  Code,
  Separator
}

// Export code block component
export { SimpleCodeBlock } from '@/components/chakra/SimpleCodeBlock'

// Export parameter field components
export { ParameterField, ParametersSection } from '@/components/chakra/ParameterField'
