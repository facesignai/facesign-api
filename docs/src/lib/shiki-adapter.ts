import { createShikiAdapter } from '@chakra-ui/react'
import type { Highlighter } from 'shiki'

// Singleton cache for the highlighter instance
let highlighterPromise: Promise<Highlighter> | null = null

export const shikiAdapter = createShikiAdapter({
  async load() {
    // Return cached promise if available
    if (highlighterPromise) {
      return highlighterPromise
    }

    // Create and cache the highlighter promise
    highlighterPromise = (async () => {
      const { createHighlighter } = await import('shiki')
      return createHighlighter({
        langs: ['bash', 'javascript', 'typescript', 'python', 'json', 'go'],
        themes: ['github-light', 'github-dark'],
      })
    })()

    return highlighterPromise
  },
  theme: { light: 'github-light', dark: 'github-dark' },
})
