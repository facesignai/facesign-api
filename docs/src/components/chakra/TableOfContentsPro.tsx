'use client'

import {
  Box,
  Heading,
  HStack,
  Stack,
  chakra,
} from '@chakra-ui/react'
import { useEnvironmentContext } from '@chakra-ui/react'
import { useEffect, useState, useCallback } from 'react'
import { LuText } from 'react-icons/lu'

// Styled TOC link component - minimal variant from Chakra Pro
const TocLink = chakra('a', {
  base: {
    py: '1.5',
    px: '3',
    display: 'flex',
    textStyle: 'sm',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    paddingInlineStart: `calc(var(--toc-item-depth) * 0.75rem + 0.75rem)`,
    color: 'fg.muted',
    _current: {
      fontWeight: 'medium',
      color: 'green.600',
      _dark: {
        color: 'green.400',
      }
    },
    _hover: {
      color: 'fg',
    }
  },
})

interface TOCItem {
  id: string
  text: string
  level: number
}

// Custom scroll spy hook from Chakra Pro
function useScrollSpy(options: { data: TOCItem[]; setActiveId: (ids: string[]) => void; rootMargin?: string }) {
  const { data, rootMargin = '-20% 0% -35% 0%', setActiveId } = options
  const env = useEnvironmentContext()

  useEffect(() => {
    const win = env.getWindow()
    const doc = env.getDocument()

    const observer = new win.IntersectionObserver(
      (entries) => {
        const intersectingEntries = entries.filter(
          (entry) => entry.isIntersecting,
        )
        if (intersectingEntries.length > 0) {
          setActiveId(intersectingEntries.map((entry) => entry.target.id))
        }
      },
      { rootMargin },
    )

    for (const { id } of data) {
      const element = doc.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    }

    return () => observer.disconnect()
  }, [data, rootMargin, setActiveId, env])
}

interface TableOfContentsProProps {
  items?: TOCItem[]
  maxDepth?: number
}

export function TableOfContentsPro({ items, maxDepth = 3 }: TableOfContentsProProps) {
  const [headings, setHeadings] = useState<TOCItem[]>(items || [])
  const [activeId, setActiveId] = useState<string[]>([])

  // Extract headings from the page if items not provided
  useEffect(() => {
    if (!items) {
      const elements = Array.from(
        document.querySelectorAll('main h2, main h3, main h4')
      )
      const extractedHeadings: TOCItem[] = elements.map((elem) => ({
        id: elem.id || elem.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
        text: elem.textContent || '',
        level: parseInt(elem.tagName.charAt(1)),
      }))
      const filtered = extractedHeadings.filter(h => h.level <= maxDepth && h.id && h.text)
      setHeadings(filtered)

      // Set initial active item
      if (filtered.length > 0 && activeId.length === 0) {
        setActiveId([filtered[0].id])
      }
    }
  }, [items, maxDepth, activeId.length])

  useScrollSpy({
    data: headings,
    setActiveId,
  })

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setActiveId([id])
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }, [])

  if (headings.length === 0) {
    return null
  }

  return (
    <Box
      as="nav"
      top="100px"
      w="full"
      maxW="xs"
      overflowY="auto"
      position="sticky"
      maxH="calc(100vh - 100px - 2rem)"
      display={{ base: 'none', xl: 'block' }}
    >
      <HStack alignItems="center" mb="4" px="3">
        <LuText color="var(--chakra-colors-fg-subtle)" />
        <Heading textStyle="sm" fontWeight="medium">
          On this page
        </Heading>
      </HStack>

      <Stack gap="0">
        {headings.map((item) => {
          const isActive = activeId.includes(item.id)
          return (
            <TocLink
              key={item.id}
              href={`#${item.id}`}
              css={{
                '--toc-item-depth': item.level - 2, // Adjust depth for h2, h3, h4
              }}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleClick(e, item.id)}
              data-current={isActive || undefined}
              aria-current={isActive ? 'location' : undefined}
            >
              {item.text}
            </TocLink>
          )
        })}
      </Stack>
    </Box>
  )
}