'use client'

import {
  Badge,
  Box,
  Flex,
  Icon,
  Input,
  InputGroup,
  Text,
  VStack,
  chakra,
} from '@chakra-ui/react'
import { LuSearch } from 'react-icons/lu'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

// Styled sidebar link component - technical variant for API
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
    py: '2',
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
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  items?: NavItem[]
}

const navigation: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Base URL', href: '/api#base-url' },
      { label: 'Authentication', href: '/api#authentication' },
      { label: 'Rate Limits', href: '/api#rate-limits' },
      { label: 'Error Responses', href: '/api#errors' },
    ],
  },
  {
    title: 'Endpoints',
    items: [
      { label: 'Sessions', href: '/api#sessions' },
      { label: 'Flows', href: '/api#flows' },
      { label: 'Webhooks', href: '/api#webhooks' },
    ],
  },
  {
    title: 'Session Operations',
    items: [
      { label: 'Create Session', href: '/api#create-session', method: 'POST' },
      { label: 'Get Session', href: '/api#get-session', method: 'GET' },
      { label: 'List Sessions', href: '/api#list-sessions', method: 'GET' },
      { label: 'Update Session', href: '/api#update-session', method: 'PATCH' },
      { label: 'Delete Session', href: '/api#delete-session', method: 'DELETE' },
    ],
  },
  {
    title: 'Flow Operations',
    items: [
      { label: 'List Flows', href: '/api#list-flows', method: 'GET' },
      { label: 'Get Flow', href: '/api#get-flow', method: 'GET' },
      { label: 'Create Flow', href: '/api#create-flow', method: 'POST' },
      { label: 'Update Flow', href: '/api#update-flow', method: 'PUT' },
      { label: 'Delete Flow', href: '/api#delete-flow', method: 'DELETE' },
    ],
  },
  {
    title: 'Webhook Events',
    items: [
      { label: 'Event Types', href: '/api#webhook-events' },
      { label: 'Signature Verification', href: '/api#webhook-signature' },
      { label: 'Event Payloads', href: '/api#webhook-payloads' },
      { label: 'Subscribe', href: '/api#webhook-subscribe', method: 'POST' },
      { label: 'Unsubscribe', href: '/api#webhook-unsubscribe', method: 'DELETE' },
    ],
  },
]

const methodColorMap: Record<string, string> = {
  POST: 'blue',
  GET: 'green',
  PUT: 'yellow',
  PATCH: 'orange',
  DELETE: 'red',
}

const MethodBadge = ({ method, active }: { method: string; active?: boolean }) => {
  return (
    <Badge
      size="xs"
      fontWeight="semibold"
      colorPalette={methodColorMap[method]}
      variant={active ? 'solid' : 'subtle'}
    >
      {method}
    </Badge>
  )
}

interface ApiSidebarProps {
  activeSection?: string
}

export function ApiSidebar({ activeSection }: ApiSidebarProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  // Filter navigation items based on search query
  const filteredNavigation = navigation.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(section => section.items.length > 0)

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
      {/* Search bar */}
      <Box p="3" position="relative" zIndex="20" borderBottomWidth="1px">
        <InputGroup startElement={<Icon as={LuSearch} color="fg.muted" />}>
          <Input
            placeholder="Search for endpoints..."
            size="sm"
            variant="subtle"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </Box>

      {/* Navigation items */}
      <Box flex="1" minH="0" overflowY="auto" px="3" py="4">
        <VStack gap="6" align="stretch">
          {filteredNavigation.map((section, index) => (
            <Box key={index}>
              <Flex align="center" h="7" px="3" py="1">
                <Text
                  fontSize="xs"
                  color="fg.muted"
                  fontWeight="medium"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  {section.title}
                </Text>
              </Flex>

              <VStack gap="1" align="stretch">
                {section.items.map((item) => {
                  const isActive = activeSection === item.href || pathname === item.href
                  return (
                    <NextLink key={item.href} href={item.href} passHref legacyBehavior>
                      <SideNavLink
                        data-current={isActive || undefined}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {item.method && (
                          <MethodBadge method={item.method} active={isActive} />
                        )}
                        <Text flex="1" fontSize="sm">
                          {item.label}
                        </Text>
                      </SideNavLink>
                    </NextLink>
                  )
                })}
              </VStack>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Footer */}
      <Box borderTopWidth="1px" px="3" py="4" bg="bg.panel">
        <VStack align="stretch" gap="2">
          <Text fontSize="xs" color="fg.muted" fontWeight="medium">
            Need help?
          </Text>
          <NextLink href="/docs" passHref legacyBehavior>
            <chakra.a
              fontSize="sm"
              color="fg.muted"
              _hover={{ color: 'fg' }}
            >
              View Documentation →
            </chakra.a>
          </NextLink>
        </VStack>
      </Box>
    </Flex>
  )
}