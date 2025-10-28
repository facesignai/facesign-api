import { createShikiAdapter } from '@chakra-ui/react'
import type { Highlighter } from 'shiki'

// Singleton cache for Shiki highlighter instance
let highlighterInstance: Highlighter | null = null
let highlighterPromise: Promise<Highlighter> | null = null

export const shikiAdapter = createShikiAdapter({
  async load() {
    // Check if instance exists and is not disposed
    if (highlighterInstance) {
      try {
        // Test if the instance is still valid by calling a method
        // If it's disposed, this will throw an error
        highlighterInstance.getLoadedThemes()
        return highlighterInstance
      } catch {
        // Instance is disposed, reset it
        highlighterInstance = null
        highlighterPromise = null
      }
    }

    // Return in-flight promise if loading
    if (highlighterPromise) {
      return highlighterPromise
    }

    // Create new instance
    highlighterPromise = (async () => {
      const { createHighlighter } = await import('shiki')
      const highlighter = await createHighlighter({
        langs: ['bash', 'javascript', 'typescript', 'python', 'json', 'go'],
        themes: ['github-light', 'github-dark'],
      })
      highlighterInstance = highlighter
      highlighterPromise = null
      return highlighter
    })()

    return highlighterPromise
  },
  theme: { light: 'github-light', dark: 'github-dark' },
})

// Only cleanup for HMR in development
// Remove beforeunload listener as it causes issues with SPA navigation
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // HMR cleanup (Next.js hot reload support)
  // @ts-expect-error - HMR API varies by bundler
  if (typeof module !== 'undefined' && module.hot) {
    // @ts-expect-error - HMR API varies by bundler
    module.hot.dispose(() => {
      if (highlighterInstance) {
        highlighterInstance.dispose()
        highlighterInstance = null
        highlighterPromise = null
      }
    })
  }
}