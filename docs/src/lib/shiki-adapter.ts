import { createShikiAdapter } from '@chakra-ui/react'

export const shikiAdapter = createShikiAdapter({
  async load() {
    const { createHighlighter } = await import('shiki')
    return createHighlighter({
      langs: ['bash', 'javascript', 'typescript', 'python', 'json'],
      themes: ['github-light', 'github-dark'],
    })
  },
  theme: { light: 'github-light', dark: 'github-dark' },
})
