'use client'

import { Box } from '@chakra-ui/react'

interface ProseProps {
  children: React.ReactNode
}

export function Prose({ children }: ProseProps) {
  return (
    <Box maxW="3xl">
      {children}
    </Box>
  )
}


