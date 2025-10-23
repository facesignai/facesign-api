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

// Custom scroll spy hook from Chakra Pro - Fixed for nested headings
function useScrollSpy(options: { data: TOCItem[]; setActiveId: (ids: string[]) => void; rootMargin?: string }) {
  const { data, rootMargin = '-20% 0% -35% 0%', setActiveId } = options
  const env = useEnvironmentContext()

  useEffect(() => {
    const win = env.getWindow()
    const doc = env.getDocument()

    // Track all currently intersecting entries
    const intersectingEntries = new Map<string, IntersectionObserverEntry>()

    const updateActiveHeading = () => {
      const entries = Array.from(intersectingEntries.values())

      if (entries.length === 0) return

      // Find the entry closest to the top of the viewport
      // Prefer entries that are just above or at the top
      const sorted = entries.sort((a, b) => {
        const aTop = a.boundingClientRect.top
        const bTop = b.boundingClientRect.top

        // If both are above viewport top (negative), prefer the one closer to 0 (most recent)
        if (aTop < 0 && bTop < 0) {
          return bTop - aTop // More negative = further up = lower priority
        }

        // If both are below viewport top (positive), prefer the one closer to 0 (highest on screen)
        if (aTop >= 0 && bTop >= 0) {
          return aTop - bTop
        }

        // If one is above and one below, prefer the one below (just entered)
        return aTop < 0 ? 1 : -1
      })

      const best = sorted[0]

      // Get the heading info to check level
      const bestHeading = data.find(h => h.id === best.target.id)

      // If we have multiple entries at similar positions, prefer deeper levels
      const similarEntries = sorted.filter(entry => {
        const diff = Math.abs(entry.boundingClientRect.top - best.boundingClientRect.top)
        return diff < 100 // Within 100px considered "similar"
      })

      if (similarEntries.length > 1 && bestHeading) {
        // Find the deepest level among similar entries
        const deepest = similarEntries.reduce((prev, curr) => {
          const prevHeading = data.find(h => h.id === prev.target.id)
          const currHeading = data.find(h => h.id === curr.target.id)

          if (!prevHeading || !currHeading) return prev

          // Higher level number = deeper heading (h4 > h3 > h2)
          return currHeading.level > prevHeading.level ? curr : prev
        }, similarEntries[0])

        setActiveId([deepest.target.id])
      } else {
        setActiveId([best.target.id])
      }
    }

    const observer = new win.IntersectionObserver(
      (entries) => {
        // Update our tracking map
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            intersectingEntries.set(entry.target.id, entry)
          } else {
            intersectingEntries.delete(entry.target.id)
          }
        })

        // Recalculate which heading should be active
        updateActiveHeading()
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
      let attempts = 0
      const maxAttempts = 10
      let timeoutId: NodeJS.Timeout

      const extractHeadings = () => {
        // Try multiple selectors to find headings in the rendered MDX content
        const selectors = [
          'article h2, article h3, article h4',
          'main h2, main h3, main h4',
          '[role="main"] h2, [role="main"] h3, [role="main"] h4'
        ]

        let elements: Element[] = []
        for (const selector of selectors) {
          elements = Array.from(document.querySelectorAll(selector))
          if (elements.length > 0) break
        }

        if (elements.length > 0 || attempts >= maxAttempts) {
          const extractedHeadings: TOCItem[] = elements.map((elem) => ({
            id: elem.id || elem.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
            text: elem.textContent || '',
            level: parseInt(elem.tagName.charAt(1)),
          }))
          const filtered = extractedHeadings.filter(h => h.level <= maxDepth && h.id && h.text)

          if (filtered.length > 0) {
            setHeadings(filtered)
            // Set initial active item only if none is set
            setActiveId(prev => prev.length === 0 ? [filtered[0].id] : prev)
          }
        } else {
          // Content not ready, retry after delay
          attempts++
          timeoutId = setTimeout(extractHeadings, 100)
        }
      }

      // Start extraction with small delay to allow MDX to render
      timeoutId = setTimeout(extractHeadings, 50)

      // Cleanup timeout on unmount
      return () => {
        if (timeoutId) clearTimeout(timeoutId)
      }
    }
  }, [items, maxDepth])

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