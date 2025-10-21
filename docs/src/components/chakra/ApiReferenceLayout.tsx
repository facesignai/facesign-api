'use client'

import { Box, Flex } from '@chakra-ui/react'
import { DocsNavbarPro } from './DocsNavbarPro'
import { ApiSidebarPro } from './ApiSidebarPro'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface ApiReferenceLayoutProps {
  children: ReactNode
  codePanel?: ReactNode
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
          py={6}
          px={{ base: 5, md: 8, lg: 10 }}
        >
          {children}
        </Box>

        {/* Right Panel - Code Examples (optional) */}
        {codePanel ? (
          <Box
            flex="1"
            minW="0"
            display={{ base: 'none', xl: 'block' }}
            py={6}
            pr={10}
          >
            {codePanel}
          </Box>
        ) : null}
      </Flex>
    </Box>
  )
}