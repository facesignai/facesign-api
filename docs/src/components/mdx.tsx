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
import { RequestCodeBlock } from '@/components/chakra/RequestCodeBlock'

export const a = Link
export { Button } from '@/components/Button'
export { CodeGroup } from '@/components/CodeGroup'

export function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout>
      <Box
        as="article"
        py={8}
        width="full"
        css={{
          '& h1': {
            fontSize: 'var(--chakra-fontSizes-3xl)',
            fontWeight: 'bold',
            marginBottom: 'var(--chakra-spacing-4)',
            marginTop: 'var(--chakra-spacing-8)',
            color: 'var(--chakra-colors-gray-900)',
          },
          '.chakra-ui-dark &': {
            '& h1': { color: 'var(--chakra-colors-white)' },
            '& h2': { color: 'var(--chakra-colors-white)' },
            '& h3': { color: 'var(--chakra-colors-white)' },
            '& p, & ul, & ol': { color: 'var(--chakra-colors-gray-300)' },
            '& code': {
              backgroundColor: 'var(--chakra-colors-gray-800)',
              color: 'var(--chakra-colors-gray-200)',
            },
            '& a': {
              color: 'var(--chakra-colors-green-400)',
              '&:hover': { color: 'var(--chakra-colors-green-300)' },
            },
            '& hr': { borderColor: 'var(--chakra-colors-gray-700)' },
            '& strong': { color: 'var(--chakra-colors-white)' },
            '& blockquote': {
              borderColor: 'var(--chakra-colors-gray-600)',
              color: 'var(--chakra-colors-gray-400)',
            },
          },
          '& h2': {
            fontSize: 'var(--chakra-fontSizes-2xl)',
            fontWeight: 'var(--chakra-fontWeights-semibold)',
            marginBottom: 'var(--chakra-spacing-4)',
            marginTop: 'var(--chakra-spacing-8)',
            color: 'var(--chakra-colors-gray-900)',
          },
          '& h3': {
            fontSize: 'var(--chakra-fontSizes-xl)',
            fontWeight: 'var(--chakra-fontWeights-semibold)',
            marginBottom: 'var(--chakra-spacing-3)',
            marginTop: 'var(--chakra-spacing-6)',
            color: 'var(--chakra-colors-gray-900)',
          },
          '& p': {
            marginBottom: 'var(--chakra-spacing-4)',
            lineHeight: 'var(--chakra-lineHeights-tall)',
            color: 'var(--chakra-colors-gray-700)',
          },
          '& ul, & ol': {
            marginBottom: 'var(--chakra-spacing-4)',
            paddingLeft: 'var(--chakra-spacing-6)',
            color: 'var(--chakra-colors-gray-700)',
          },
          '& li': { marginBottom: 'var(--chakra-spacing-2)' },
          '& code': {
            fontSize: 'var(--chakra-fontSizes-sm)',
            backgroundColor: 'var(--chakra-colors-gray-100)',
            paddingLeft: 'var(--chakra-spacing-1\\.5)',
            paddingRight: 'var(--chakra-spacing-1\\.5)',
            paddingTop: 'var(--chakra-spacing-0\\.5)',
            paddingBottom: 'var(--chakra-spacing-0\\.5)',
            borderRadius: 'var(--chakra-radii-md)',
            fontFamily: 'var(--chakra-fonts-mono)',
            color: 'var(--chakra-colors-gray-800)',
          },
          '& pre': {
            marginBottom: 'var(--chakra-spacing-4)',
            borderRadius: 'var(--chakra-radii-md)',
            overflow: 'auto',
          },
          '& a': {
            color: 'var(--chakra-colors-green-600)',
            textDecoration: 'underline',
            '&:hover': {
              color: 'var(--chakra-colors-green-700)',
            },
          },
          '& hr': {
            marginTop: 'var(--chakra-spacing-8)',
            marginBottom: 'var(--chakra-spacing-8)',
            borderColor: 'var(--chakra-colors-gray-200)',
          },
          '& strong': {
            fontWeight: 'var(--chakra-fontWeights-semibold)',
            color: 'var(--chakra-colors-gray-900)',
          },
          '& blockquote': {
            borderLeftWidth: '4px',
            borderColor: 'var(--chakra-colors-gray-300)',
            paddingLeft: 'var(--chakra-spacing-4)',
            paddingTop: 'var(--chakra-spacing-2)',
            paddingBottom: 'var(--chakra-spacing-2)',
            fontStyle: 'italic',
            color: 'var(--chakra-colors-gray-600)',
          },
        }}
      >
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

export function Properties({ children }: { children: React.ReactNode }) {
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

  return <PropertiesTable properties={properties} />
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
  RequestCodeBlock,
  Grid,
  VStack,
  HStack,
  Box,
  Text,
  Code,
  Separator
}

// Export code block components
export { TabbedCodeBlock } from '@/components/chakra/TabbedCodeBlock'
export { SimpleCodeBlock } from '@/components/chakra/SimpleCodeBlock'

// Export parameter field components
export { ParameterField, ParametersSection } from '@/components/chakra/ParameterField'
