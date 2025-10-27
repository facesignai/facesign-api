'use client'

import { Grid, Box } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface SplitViewProps {
  leftContent: ReactNode
  rightContent: ReactNode
  ratio?: string
  gap?: number | object
  alignItems?: 'start' | 'center' | 'end' | 'stretch'
  stickyRight?: boolean
}

/**
 * SplitView component for creating text-on-left / code-on-right layouts
 *
 * @param leftContent - Content for the left column (usually text/description)
 * @param rightContent - Content for the right column (usually code examples)
 * @param ratio - Grid column ratio (default: '1fr 1fr' for 50/50)
 *                Use 'minmax(400px, 45%) minmax(400px, 55%)' for Stripe-style
 * @param gap - Gap between columns (default: 6)
 * @param alignItems - Vertical alignment (default: 'start')
 * @param stickyRight - Make right column sticky while scrolling (default: false)
 *
 * @example
 * ```tsx
 * <SplitView
 *   leftContent={
 *     <>
 *       <Heading size="md" mb={3}>How it works</Heading>
 *       <Text>Create a session by calling...</Text>
 *     </>
 *   }
 *   rightContent={
 *     <CodeBlock language="typescript" code={`...`} />
 *   }
 * />
 * ```
 *
 * @example Stripe-style 45/55 split
 * ```tsx
 * <SplitView
 *   ratio="minmax(400px, 45%) minmax(400px, 55%)"
 *   leftContent={...}
 *   rightContent={...}
 * />
 * ```
 *
 * @example Sticky code example
 * ```tsx
 * <SplitView
 *   stickyRight
 *   leftContent={<LongTextContent />}
 *   rightContent={<CodeExample />}
 * />
 * ```
 */
export function SplitView({
  leftContent,
  rightContent,
  ratio = '1fr 1fr',
  gap = 6,
  alignItems = 'start',
  stickyRight = false,
}: SplitViewProps) {
  return (
    <Grid
      templateColumns={{ base: '1fr', lg: ratio }}
      gap={gap}
      alignItems={alignItems}
      my={8}
    >
      <Box>{leftContent}</Box>
      <Box position={stickyRight ? 'sticky' : 'relative'} top={stickyRight ? '100px' : undefined}>
        {rightContent}
      </Box>
    </Grid>
  )
}
