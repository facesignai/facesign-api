'use client'

import { Box, Flex, HStack, IconButton, Menu, Portal } from '@chakra-ui/react'
import { LuMenu } from 'react-icons/lu'
import { FiBook, FiCode, FiGithub } from 'react-icons/fi'
import { ColorModeButton } from '@/components/ui/color-mode'
import { SearchDialog, SearchBarTrigger, SearchButtonTrigger } from './SearchComponents'
import { useSearch } from '@/components/SearchProvider'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import logoSrc from '@/images/logos/logoWide.png'

// Tab link with underline style from navbar-006
const TabNavLink = ({
  href,
  children,
  isActive,
  ...props
}: {
  href: string
  children: React.ReactNode
  isActive?: boolean
  [key: string]: any
}) => (
  <NextLink href={href} passHref legacyBehavior>
    <Box
      as="a"
      h="full"
      display="flex"
      flexShrink={0}
      textStyle="sm"
      alignItems="center"
      fontWeight="medium"
      borderBottomWidth="2px"
      px="2"
      gap="2"
      color={isActive ? 'green.600' : 'fg.muted'}
      borderBottomColor={isActive ? 'green.600' : 'transparent'}
      _hover={{
        color: isActive ? 'green.600' : 'fg',
        borderBottomColor: isActive ? 'green.600' : 'border.emphasized'
      }}
      _dark={{
        color: isActive ? 'green.400' : 'fg.muted',
        borderBottomColor: isActive ? 'green.400' : 'transparent',
        _hover: {
          color: isActive ? 'green.400' : 'fg',
          borderBottomColor: isActive ? 'green.400' : 'border.emphasized'
        }
      }}
      aria-current={isActive ? 'page' : undefined}
      {...props}
    >
      {children}
    </Box>
  </NextLink>
)


export function DocsNavbarPro() {
  const pathname = usePathname()
  const { isOpen: isSearchOpen, setIsOpen: setIsSearchOpen } = useSearch()

  const navItems = [
    { label: 'Docs', href: '/docs', icon: <FiBook /> },
    { label: 'API Reference', href: '/api', icon: <FiCode /> },
  ]

  return (
    <Box
      as="nav"
      top="0"
      width="full"
      zIndex="30"
      position="sticky"
      borderBottomWidth="1px"
      bg="bg"
      backdropFilter="blur(8px)"
    >
      <HStack h="16" px={{ base: 4, md: 6, lg: 8 }} gap="4" minW="0">
        <HStack flex="1" gap="8">
          {/* Logo */}
          <NextLink href="/" passHref legacyBehavior>
            <Box
              as="a"
              display="flex"
              alignItems="center"
              _hover={{ textDecoration: 'none' }}
            >
              <Box h={8} position="relative">
                <Image
                  src={logoSrc}
                  alt="FaceSign"
                  height={32}
                  sizes="128px"
                  style={{ height: 'auto', width: 'auto' }}
                />
              </Box>
            </Box>
          </NextLink>

            {/* Desktop Navigation with underline */}
            <HStack gap="6" overflowY="auto" hideBelow="lg" h="full">
              {navItems.map((item) => {
                let isActive = false
                if (item.href === '/docs') {
                  // Docs tab: active on /docs OR any page that's not /api or homepage
                  isActive = pathname === '/docs' ||
                    (pathname !== '/' && !pathname?.startsWith('/api'))
                } else if (item.href === '/api') {
                  // API tab: active on /api or /api/*
                  isActive = pathname === '/api' || pathname?.startsWith('/api/')
                } else {
                  // Default behavior for other items
                  isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                }

                return (
                  <TabNavLink
                    key={item.href}
                    href={item.href}
                    isActive={isActive}
                    h="16"
                  >
                    {item.icon}
                    {item.label}
                  </TabNavLink>
                )
              })}
            </HStack>
          </HStack>

          {/* Right side actions */}
          <Flex flex="1" align="center" justify="flex-end">
            <HStack as="nav" hideBelow="lg" gap="2">
              {/* Search button */}
              <Box w="64">
                <SearchBarTrigger onClick={() => setIsSearchOpen(true)} />
              </Box>

              {/* GitHub link */}
              <Box
                asChild
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                w="var(--sizes-10)"
                h="var(--sizes-10)"
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: 'gray.100' }}
              >
                <a
                  href="https://github.com/facesignai/facesign-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <FiGithub />
                </a>
              </Box>

              {/* Theme toggle */}
              <ColorModeButton size="sm" />
            </HStack>

            {/* Mobile Navigation */}
            <HStack as="nav" hideFrom="lg">
              <SearchButtonTrigger onClick={() => setIsSearchOpen(true)} />
              <ColorModeButton size="sm" />

              <Menu.Root
                positioning={{
                  placement: 'bottom',
                  overflowPadding: 0,
                  offset: { mainAxis: 17 },
                }}
              >
                <Menu.Trigger asChild>
                  <IconButton
                    aria-label="Menu"
                    variant="ghost"
                    size="sm"
                  >
                    <LuMenu />
                  </IconButton>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content
                      boxShadow="lg"
                      bg="bg"
                      borderRadius="md"
                      py="2"
                    >
                      {navItems.map((item) => {
                        let isActive = false
                        if (item.href === '/docs') {
                          // Docs tab: active on /docs OR any page that's not /api or homepage
                          isActive = pathname === '/docs' ||
                            (pathname !== '/' && !pathname?.startsWith('/api'))
                        } else if (item.href === '/api') {
                          // API tab: active on /api or /api/*
                          isActive = pathname === '/api' || pathname?.startsWith('/api/')
                        } else {
                          // Default behavior for other items
                          isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                        }

                        return (
                          <Menu.Item
                            key={item.href}
                            value={item.label}
                            asChild
                          >
                            <NextLink href={item.href}>
                              <HStack px="4" py="2" color={isActive ? 'green.600' : 'fg'} _hover={{ bg: 'gray.100' }}>
                                {item.icon}
                                <span>{item.label}</span>
                              </HStack>
                            </NextLink>
                          </Menu.Item>
                        )
                      })}

                      <Box borderTopWidth="1px" my="2" />

                      <Menu.Item asChild value="github">
                        <a href="https://github.com/facesignai/facesign-api" target="_blank" rel="noreferrer">
                          <HStack px="4" py="2" _hover={{ bg: 'gray.100' }}>
                            <FiGithub />
                            <span>GitHub</span>
                          </HStack>
                        </a>
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </HStack>
          </Flex>
        </HStack>

      {/* Search Dialog */}
      <SearchDialog
        open={isSearchOpen}
        onOpenChange={(e) => setIsSearchOpen(e.open)}
      />
    </Box>
  )
}