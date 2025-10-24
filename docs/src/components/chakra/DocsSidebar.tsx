'use client'

import {
  Box,
  HStack,
  Stack,
  Text,
  chakra,
  Span,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

// Styled sidebar link component - filled variant for Docs
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
    },
    _current: {
      fontWeight: 'medium',
      color: 'green.600',
      bg: 'green.50',
      _hover: {
        bg: 'green.50',
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
      { label: 'Introduction', href: '/docs#introduction' },
      { label: 'Installation', href: '/docs#installation' },
      { label: 'Authentication', href: '/docs#authentication' },
      { label: 'First Session', href: '/docs#first-session' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { label: 'Sessions', href: '/docs#sessions' },
      { label: 'Flows', href: '/docs#flows' },
      { label: 'Modules', href: '/docs#modules' },
      { label: 'Webhooks', href: '/docs#webhooks' },
    ],
  },
  {
    title: 'Verification Modules',
    items: [
      { label: 'Email Verification', href: '/docs#email-verification' },
      { label: 'SMS Verification', href: '/docs#sms-verification' },
      { label: 'Document Authentication', href: '/docs#document-authentication' },
      { label: 'Identity Verification', href: '/docs#identity-verification' },
    ],
  },
  {
    title: 'Biometric Features',
    items: [
      { label: 'Face Recognition', href: '/docs#face-recognition' },
      { label: 'Liveness Detection', href: '/docs#liveness-detection' },
      { label: 'Age Estimation', href: '/docs#age-estimation' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { label: 'Customization', href: '/docs#customization' },
      { label: 'Error Handling', href: '/docs#error-handling' },
      { label: 'Languages', href: '/docs#languages' },
      { label: 'Avatars', href: '/docs#avatars' },
    ],
  },
  {
    title: 'SDKs',
    items: [
      { label: 'JavaScript/TypeScript', href: '/docs#sdk-javascript' },
      { label: 'Python', href: '/docs#sdk-python' },
      { label: 'Go', href: '/docs#sdk-go' },
    ],
  },
]

interface DocsSidebarProps {
  activeSection?: string
}

export function DocsSidebar({ activeSection }: DocsSidebarProps) {
  const pathname = usePathname()

  return (
    <Box
      as="nav"
      bg="bg"
      top="64px"
      insetStart="0"
      bottom="0"
      zIndex="20"
      width="18rem"
      position="sticky"
      h="calc(100vh - 64px)"
      borderEndWidth="1px"
      overflowY="auto"
      px="3"
      py="6"
    >
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
  )
}