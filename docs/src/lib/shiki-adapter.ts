import { createShikiAdapter } from '@chakra-ui/react'

export const shikiAdapter = createShikiAdapter({
  async load() {
    // Always create a fresh highlighter instance
    // This avoids disposal issues in React Strict Mode
    const { createHighlighter } = await import('shiki')
    return createHighlighter({
      langs: ['bash', 'javascript', 'typescript', 'python', 'json', 'go'],
      themes: ['github-light', 'github-dark'],
    })
  },
  theme: { light: 'github-light', dark: 'github-dark' },
})
