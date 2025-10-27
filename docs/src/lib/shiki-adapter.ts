import { createShikiAdapter } from '@chakra-ui/react'
import type { Highlighter } from 'shiki'

// Singleton cache for Shiki highlighter instance
let highlighterInstance: Highlighter | null = null
let highlighterPromise: Promise<Highlighter> | null = null

export const shikiAdapter = createShikiAdapter({
  async load() {
    // Return cached instance if available
    if (highlighterInstance) {
      return highlighterInstance
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

// Cleanup function for when the module is disposed (HMR, etc.)
if (typeof window !== 'undefined') {
  const cleanup = () => {
    if (highlighterInstance) {
      highlighterInstance.dispose()
      highlighterInstance = null
      highlighterPromise = null
    }
  }

  // Clean up on page unload
  window.addEventListener('beforeunload', cleanup)

  // HMR cleanup (Vite/Next.js HMR support)
  // @ts-expect-error - HMR API varies by bundler
  if (typeof module !== 'undefined' && module.hot) {
    // @ts-expect-error - HMR API varies by bundler
    module.hot.dispose(cleanup)
  }
}
