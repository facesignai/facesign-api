'use client'

import {
  Box,
  Flex,
  HStack,
  Stack,
  Text,
  chakra,
  Span,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

// Styled sidebar link component using Chakra Pro style
const SideNavLink = chakra('a', {
  base: {
    gap: '3',
    display: 'flex',
    textStyle: 'sm',
    alignItems: 'center',
    textDecoration: 'none',
    transitionProperty: 'color, background-color',
    transitionDuration: 'normal',
    transitionTimingFunction: 'default',
    focusVisibleRing: 'inside',
    focusRingWidth: '2px',
    borderRadius: 'md',
    px: '3',
    py: '1.5',
    _hover: {
      bg: 'gray.100',
      _dark: {
        bg: 'gray.800',
      }
    },
    _current: {
      fontWeight: 'medium',
      color: 'green.600',
      bg: 'green.50',
      _dark: {
        color: 'green.400',
        bg: 'green.900/20',
      },
      _hover: {
        bg: 'green.50',
        _dark: {
          bg: 'green.900/20',
        }
      }
    },
  },
})

interface NavSection {
  title: string
  items: NavItem[]
}

interface NavItem {
  label: string
  href: string
  items?: NavItem[]
}

const navigation: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Introduction', href: '/docs' },
      { label: 'Quick Start', href: '/quickstart' },
      { label: 'Authentication', href: '/authentication' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { label: 'Sessions', href: '/docs/sessions' },
      { label: 'Flows', href: '/docs/flows' },
      { label: 'Webhooks', href: '/docs/webhooks' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { label: 'Customization', href: '/customization' },
      { label: 'Error Handling', href: '/errors' },
      { label: 'Languages', href: '/languages' },
      { label: 'Avatars', href: '/avatars' },
    ],
  },
  {
    title: 'SDKs',
    items: [
      { label: 'Overview', href: '/sdks' },
    ],
  },
]

interface DocsSidebarProProps {
  activeSection?: string
}

export function DocsSidebarPro({ activeSection }: DocsSidebarProProps) {
  const pathname = usePathname()

  return (
    <Flex
      as="nav"
      direction="column"
      bg="bg"
      top="64px"
      insetStart="0"
      bottom="0"
      zIndex="20"
      width="18rem"
      position="sticky"
      h="calc(100vh - 64px)"
      borderEndWidth="1px"
    >
      {/* Navigation items */}
      <Box flex="1" minH="0" overflowY="auto" px="3" py="6">
        <Stack gap="8">
          {navigation.map((group, index) => (
            <Stack key={index} gap="3">
              <HStack px="3">
                <Text
                  textStyle="sm"
                  fontWeight="semibold"
                  color="fg"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  {group.title}
                </Text>
              </HStack>
              <Stack gap="1">
                {group.items.map((item) => {
                  const isActive = activeSection === item.href || pathname === item.href
                  return (
                    <NextLink key={item.href} href={item.href} passHref legacyBehavior>
                      <SideNavLink
                        data-current={isActive || undefined}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Span flex="1">{item.label}</Span>
                      </SideNavLink>
                    </NextLink>
                  )
                })}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Flex>
  )
}