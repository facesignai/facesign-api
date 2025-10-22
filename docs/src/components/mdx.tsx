import clsx from 'clsx'
import Link from 'next/link'
import {
  Heading as ChakraHeading,
  Box,
  Grid,
  VStack,
  HStack,
  Text,
  Code,
  Separator
} from '@chakra-ui/react'

import { Prose } from '@/components/Prose'
import { ApiEndpoint } from '@/components/ApiEndpoint'
import { FlowDiagram } from '@/components/FlowDiagram'
import { ResponsePreview } from '@/components/ResponsePreview'
import { ApiPlayground } from '@/components/ApiPlayground'
import { CollapsibleSection } from '@/components/CollapsibleSection'
import { DocsLayout } from '@/components/chakra/DocsLayout'
import { ApiEndpointsCard } from '@/components/chakra/ApiEndpointsCard'

// Import new Chakra components
import { DocsCodeBlock } from '@/components/chakra/DocsCodeBlock'
import { InfoAlert } from '@/components/chakra/InfoAlert'
import { WarningAlert } from '@/components/chakra/WarningAlert'
import { PropertiesTable } from '@/components/chakra/PropertiesTable'
import { RequestCodeBlock } from '@/components/chakra/RequestCodeBlock'

export const a = Link
export { Button } from '@/components/Button'

// DEPRECATED: These exports are kept for backward compatibility
// but should be migrated to new components
export { CodeGroup, Code as code, Pre as pre } from '@/components/Code'

export function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout>
      <Box as="article" py={8}>
        <Prose className="flex-auto">{children}</Prose>
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

// Export new Chakra components with the same names as the old ones
// This allows MDX files to use them without changes
export const Note = InfoAlert
export const Warning = WarningAlert

export function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 xl:max-w-none xl:grid-cols-2">
      {children}
    </div>
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
    <div
      className={clsx(
        '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
        sticky && 'xl:sticky xl:top-24',
      )}
    >
      {children}
    </div>
  )
}

export function Properties({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6">
      <ul
        role="list"
        className="m-0 max-w-[calc(var(--container-lg)-(--spacing(8)))] list-none divide-y divide-zinc-900/5 p-0 dark:divide-white/5"
      >
        {children}
      </ul>
    </div>
  )
}

export function Property({
  name,
  children,
  type,
}: {
  name: string
  children: React.ReactNode
  type?: string
}) {
  return (
    <li className="m-0 px-0 py-4 first:pt-0 last:pb-0">
      <dl className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2">
        <dt className="sr-only">Name</dt>
        <dd>
          <code>{name}</code>
        </dd>
        {type && (
          <>
            <dt className="sr-only">Type</dt>
            <dd className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
              {type}
            </dd>
          </>
        )}
        <dt className="sr-only">Description</dt>
        <dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </dd>
      </dl>
    </li>
  )
}

// Export new components for use in MDX
export { ApiEndpoint, FlowDiagram, ResponsePreview, ApiPlayground, CollapsibleSection, ApiEndpointsCard }

// Export new Chakra components for MDX usage
export {
  DocsCodeBlock,
  InfoAlert,
  WarningAlert,
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
