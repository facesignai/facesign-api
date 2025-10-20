'use client'

import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Link,
  Menu,
  Portal,
  chakra,
  Kbd,
} from '@chakra-ui/react'
import { ColorModeButton } from '@/components/ui/color-mode'
import { FiMenu, FiSearch, FiGithub, FiBook, FiCode } from 'react-icons/fi'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import logoSrc from '@/images/logos/logo192.png'

// Tab link with underline style
const TabNavLink = chakra('a', {
  base: {
    h: 'full',
    display: 'flex',
    flexShrink: '0',
    textStyle: 'sm',
    alignItems: 'center',
    fontWeight: 'medium',
    borderBottomWidth: '2px',
    px: '2',
    gap: '2',
    _currentPage: {
      color: 'green.600',
      borderBottomColor: 'green.600',
      _dark: {
        color: 'green.400',
        borderBottomColor: 'green.400',
      }
    },
    _hover: {
      color: { base: 'fg', _currentPage: 'green.600' },
      borderBottomColor: {
        base: 'border.emphasized',
        _currentPage: 'green.600',
      },
      _dark: {
        color: { base: 'fg', _currentPage: 'green.400' },
        borderBottomColor: {
          base: 'border.emphasized',
          _currentPage: 'green.400',
        },
      }
    },
    color: 'fg.muted',
    borderBottomColor: 'transparent',
  },
})

interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

const navItems: NavItem[] = [
  { label: 'Docs', href: '/docs', icon: <FiBook /> },
  { label: 'API Reference', href: '/api', icon: <FiCode /> },
]

// Search dialog component
const SearchDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (e: { open: boolean }) => void }) => {
  return (
    <Portal>
      {open && (
        <>
          <Box
            position="fixed"
            inset="0"
            bg="blackAlpha.600"
            zIndex="modal"
            onClick={() => onOpenChange({ open: false })}
          />
          <Box
            position="fixed"
            top="20%"
            left="50%"
            transform="translateX(-50%)"
            zIndex="modal"
            w="90%"
            maxW="600px"
            bg="bg"
            borderRadius="lg"
            boxShadow="lg"
            p="4"
          >
            <HStack>
              <FiSearch />
              <input
                type="text"
                placeholder="Search documentation..."
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '16px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                }}
                autoFocus
              />
            </HStack>
          </Box>
        </>
      )}
    </Portal>
  )
}

export function DocsNavbar() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

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
      <Container maxW="8xl">
        <HStack h="16" gap="4" minW="0">
          <HStack flex="1" gap="8">
            {/* Logo */}
            <NextLink href="/" passHref>
              <Link display="flex" alignItems="center" gap="2" _hover={{ textDecoration: 'none' }}>
                <Box w={8} h={8} position="relative">
                  <Image
                    src={logoSrc}
                    alt="FaceSign"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </Box>
                <Box fontWeight="semibold" fontSize="lg">
                  FaceSign API
                </Box>
              </Link>
            </NextLink>

            {/* Desktop Navigation with underline */}
            <HStack gap="6" overflowY="auto" hideBelow="lg" h="full">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                return (
                  <NextLink key={item.href} href={item.href} passHref legacyBehavior>
                    <TabNavLink
                      h="16"
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.icon}
                      {item.label}
                    </TabNavLink>
                  </NextLink>
                )
              })}
            </HStack>
          </HStack>

          {/* Right side actions */}
          <Flex flex="1" align="center" justify="flex-end">
            <HStack as="nav" hideBelow="lg" gap="2">
              {/* Search button */}
              <chakra.button
                onClick={() => setIsSearchOpen(true)}
                display="flex"
                alignItems="center"
                gap="2"
                px="3"
                py="1.5"
                fontSize="sm"
                borderWidth="1px"
                borderRadius="md"
                _hover={{ bg: 'gray.50', _dark: { bg: 'gray.800' } }}
              >
                <FiSearch />
                Search
                <HStack gap="1" ml="2">
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </HStack>
              </chakra.button>

              {/* GitHub link */}
              <Link
                href="https://github.com/facesignai/api"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton
                  variant="ghost"
                  size="sm"
                  aria-label="GitHub"
                >
                  <FiGithub />
                </IconButton>
              </Link>

              {/* Theme toggle */}
              <ColorModeButton size="sm" />
            </HStack>

            {/* Mobile Navigation */}
            <HStack as="nav" hideFrom="lg">
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
              >
                <FiSearch />
              </IconButton>

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
                    <FiMenu />
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
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                        return (
                          <Menu.Item
                            key={item.href}
                            value={item.label}
                            asChild
                          >
                            <NextLink href={item.href}>
                              <HStack
                                px="4"
                                py="2"
                                color={isActive ? 'green.600' : 'fg'}
                                _hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}
                              >
                                {item.icon}
                                <span>{item.label}</span>
                              </HStack>
                            </NextLink>
                          </Menu.Item>
                        )
                      })}

                      <Box borderTopWidth="1px" my="2" />

                      <Menu.Item asChild value="github">
                        <a href="https://github.com/facesignai/api" target="_blank" rel="noreferrer">
                          <HStack px="4" py="2" _hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}>
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
      </Container>

      {/* Search Dialog */}
      <SearchDialog
        open={isSearchOpen}
        onOpenChange={({ open }) => setIsSearchOpen(open)}
      />
    </Box>
  )
}