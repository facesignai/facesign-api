import clsx from 'clsx'
import Link from 'next/link'
import { Heading as ChakraHeading, Box } from '@chakra-ui/react'

import { Prose } from '@/components/Prose'
import { ApiEndpoint } from '@/components/ApiEndpoint'
import { FlowDiagram } from '@/components/FlowDiagram'
import { ResponsePreview } from '@/components/ResponsePreview'
import { ApiPlayground } from '@/components/ApiPlayground'
import { CollapsibleSection } from '@/components/CollapsibleSection'
import { DocsLayout } from '@/components/chakra/DocsLayout'
import { ApiEndpointsCard } from '@/components/chakra/ApiEndpointsCard'

export const a = Link
export { Button } from '@/components/Button'
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

function InfoIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <circle cx="8" cy="8" r="8" strokeWidth="0" />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.75 7.75h1.5v3.5"
      />
      <circle cx="8" cy="4" r=".5" fill="none" />
    </svg>
  )
}

function WarningIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path
        d="M8 1.5L1 14.5h14L8 1.5z"
        strokeWidth="0"
      />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8 6v3.5"
      />
      <circle cx="8" cy="12" r=".5" fill="none" />
    </svg>
  )
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4 text-sm/6 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/5 dark:text-emerald-200 dark:[--tw-prose-links-hover:var(--color-emerald-300)] dark:[--tw-prose-links:var(--color-white)]">
      <InfoIcon className="mt-1 h-4 w-4 flex-none fill-emerald-500 stroke-white dark:fill-emerald-200/20 dark:stroke-emerald-200" />
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

export function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex gap-2.5 rounded-2xl border border-amber-500/20 bg-amber-50/50 p-4 text-sm/6 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/5 dark:text-amber-200 dark:[--tw-prose-links-hover:var(--color-amber-300)] dark:[--tw-prose-links:var(--color-white)]">
      <WarningIcon className="mt-1 h-4 w-4 flex-none fill-amber-500 stroke-white dark:fill-amber-200/20 dark:stroke-amber-200" />
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

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
