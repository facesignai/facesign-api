'use client'

import { Box, Flex } from '@chakra-ui/react'
import { DocsNavbarPro } from './DocsNavbarPro'
import { ApiSidebarPro } from './ApiSidebarPro'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface ApiReferenceLayoutProps {
  children: ReactNode
  codePanel: ReactNode
}

export function ApiReferenceLayout({ children, codePanel }: ApiReferenceLayoutProps) {
  const pathname = usePathname()

  return (
    <Box minH="100vh">
      <DocsNavbarPro />

      <Flex gap={0}>
        {/* Left Sidebar - API Navigation */}
        <Box display={{ base: 'none', lg: 'block' }}>
          <ApiSidebarPro activeSection={pathname} />
        </Box>

        {/* Center - Main Documentation Content */}
        <Box
          flex="1"
          minW="0"
          ml={{ base: 0, lg: '280px' }}
          py={8}
          px={{ base: 6, md: 10, lg: 12 }}
        >
          {children}
        </Box>

        {/* Right Panel - Code Examples */}
        <Box
          flex="1"
          minW="0"
          display={{ base: 'none', xl: 'block' }}
          py={8}
          pr={12}
        >
          {codePanel}
        </Box>
      </Flex>
    </Box>
  )
}