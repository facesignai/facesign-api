'use client'

import { Box, Flex } from '@chakra-ui/react'
import { DocsNavbarPro } from './DocsNavbarPro'
import { DocsSidebarPro } from './DocsSidebarPro'
import { ApiSidebarPro } from './ApiSidebarPro'
import { TableOfContentsPro } from './TableOfContentsPro'
import { usePathname } from 'next/navigation'

interface DocsLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  showTOC?: boolean
  variant?: 'docs' | 'api'
}

export function DocsLayout({
  children,
  showSidebar = true,
  showTOC = true,
  variant
}: DocsLayoutProps) {
  const pathname = usePathname()

  // Determine if we're on docs or API page
  const isApiPage = pathname?.startsWith('/api')
  const isHomepage = pathname === '/'
  // Show docs sidebar on all pages except API pages and homepage
  const isDocsPage = !isHomepage && !isApiPage

  // Use variant prop or determine from pathname
  const effectiveVariant = variant || (isApiPage ? 'api' : 'docs')

  return (
    <Box minH="100vh">
      <DocsNavbarPro />

      <Flex>
        {/* Sidebar - only show on docs/api pages */}
        {showSidebar && (isDocsPage || isApiPage) && (
          <Box display={{ base: 'none', lg: 'block' }}>
            {effectiveVariant === 'api' ? (
              <ApiSidebarPro activeSection={pathname} />
            ) : (
              <DocsSidebarPro activeSection={pathname} />
            )}
          </Box>
        )}

        {/* Main content area */}
        <Box
          flex="1"
          minW="0"
          ml={showSidebar && (isDocsPage || isApiPage) ? { base: 0, lg: '280px' } : 0}
          display="flex"
        >
          {/* Main content */}
          <Box
            as="main"
            flex="1"
            minW="0"
            py={6}
            px={effectiveVariant === 'api' ? { base: 4, md: 5, lg: 6 } : { base: 4, md: 6, lg: 8 }}
          >
            {children}
          </Box>

          {/* Table of Contents */}
          {showTOC && isDocsPage && (
            <Box
              display={{ base: 'none', xl: 'block' }}
              flexShrink={0}
              w="20rem"
              pl={4}
            >
              <TableOfContentsPro />
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  )
}