import { type MDXComponents } from 'mdx/types'
import {
  Heading,
  Text,
  Box,
  Code as ChakraCode,
  Link as ChakraLink,
  Separator,
  CodeBlock,
} from '@chakra-ui/react'

import * as mdxComponents from '@/components/mdx'
import { shikiAdapter } from '@/lib/shiki-adapter'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...mdxComponents,
    // Typography overrides - apply styling to MDX HTML elements
    h1: (props) => (
      <Heading
        as="h1"
        fontSize="3xl"
        fontWeight="bold"
        mb={4}
        mt={8}
        color="gray.900"
        _dark={{ color: 'white' }}
        {...props}
      />
    ),
    h2: (props) => (
      <Heading
        as="h2"
        fontSize="2xl"
        fontWeight="semibold"
        mb={4}
        mt={8}
        color="gray.900"
        _dark={{ color: 'white' }}
        {...props}
      />
    ),
    h3: (props) => (
      <Heading
        as="h3"
        fontSize="xl"
        fontWeight="semibold"
        mb={3}
        mt={6}
        color="gray.900"
        _dark={{ color: 'white' }}
        {...props}
      />
    ),
    h4: (props) => (
      <Heading
        as="h4"
        fontSize="lg"
        fontWeight="semibold"
        mb={2}
        mt={4}
        color="gray.900"
        _dark={{ color: 'white' }}
        {...props}
      />
    ),
    p: (props) => (
      <Text
        mb={4}
        lineHeight="tall"
        color="gray.700"
        _dark={{ color: 'gray.300' }}
        {...props}
      />
    ),
    ul: (props) => (
      <ul
        style={{
          marginBottom: 'var(--chakra-spacing-4)',
          paddingLeft: 'var(--chakra-spacing-6)',
          color: 'var(--chakra-colors-gray-700)',
        }}
        className="_dark:color-gray-300"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        style={{
          marginBottom: 'var(--chakra-spacing-4)',
          paddingLeft: 'var(--chakra-spacing-6)',
          color: 'var(--chakra-colors-gray-700)',
        }}
        className="_dark:color-gray-300"
        {...props}
      />
    ),
    code: (props) => {
      const { children, className, ...rest } = props

      // Detect if this is a code block (has language- class) vs inline code
      const isCodeBlock = className?.includes('language-')

      if (isCodeBlock && typeof children === 'string') {
        // Code block with shiki syntax highlighting - render HTML
        return <code className={className} {...rest} dangerouslySetInnerHTML={{ __html: children }} />
      }

      if (!isCodeBlock) {
        // Inline code - use Chakra styling
        return (
          <ChakraCode
            fontSize="sm"
            bg="gray.100"
            px={1.5}
            py={0.5}
            borderRadius="md"
            fontFamily="mono"
            color="gray.800"
            _dark={{
              bg: 'gray.800',
              color: 'gray.200',
            }}
            {...props}
          />
        )
      }

      // Fallback for edge cases
      return <code {...props} />
    },
    pre: (props) => {
      // Simple pre styling with Chakra design system
      // CodeBlock component is used via TabbedCodeBlock and SimpleCodeBlock custom components
      return (
        <pre
          style={{
            marginBottom: 'var(--chakra-spacing-6)',
            borderRadius: 'var(--chakra-radii-md)',
            overflow: 'auto',
            backgroundColor: 'var(--chakra-colors-gray-800)',
            padding: 'var(--chakra-spacing-4)',
            fontSize: 'var(--chakra-fontSizes-xs)',
            fontFamily: 'var(--chakra-fonts-mono)',
          }}
          {...props}
        />
      )
    },
    a: (props) => (
      <ChakraLink
        color="green.600"
        textDecoration="underline"
        _hover={{ color: 'green.700' }}
        _dark={{
          color: 'green.400',
          _hover: { color: 'green.300' },
        }}
        {...props}
      />
    ),
    hr: (props) => (
      <Separator
        my={8}
        borderColor="gray.200"
        _dark={{ borderColor: 'gray.700' }}
        {...props}
      />
    ),
    strong: (props) => (
      <Box
        as="strong"
        fontWeight="semibold"
        color="gray.900"
        _dark={{ color: 'white' }}
        {...props}
      />
    ),
    blockquote: (props) => (
      <blockquote
        style={{
          borderLeft: '4px solid var(--chakra-colors-gray-300)',
          paddingLeft: 'var(--chakra-spacing-4)',
          paddingTop: 'var(--chakra-spacing-2)',
          paddingBottom: 'var(--chakra-spacing-2)',
          fontStyle: 'italic',
          color: 'var(--chakra-colors-gray-600)',
        }}
        {...props}
      />
    ),
  }
}
