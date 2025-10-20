'use client'

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  Portal,
  Stack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { LuChevronDown, LuChevronRight, LuExternalLink, LuMenu, LuSparkles } from 'react-icons/lu'
import { Logo } from './logo'
import { ColorModeButton } from '@/components/ui/color-mode'
import { NavLinkButton } from './nav-link-button'
import { SearchBarTrigger, SearchButtonTrigger, SearchDialog } from './search'
import { TabNavLink } from './tab-nav-link'

const headerLinks = [
  { href: '#reference', label: 'Reference' },
  { href: '#guides', label: 'Guides' },
  { href: '#examples', label: 'Examples' },
  { href: '#changelog', label: 'Changelog' },
]

const pathname = '#reference'

export const Block = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <Box top="0" width="full" zIndex="30" position="fixed" borderBottomWidth="1px">
      <Container maxW="8xl">
        <Stack gap="0">
          <Flex height="16" gap="4" minW={0} align="center">
            <HStack flex="1" gap="4">
              <Link href="/">
                <Logo />
              </Link>
              <VersionMenu />
            </HStack>

            <Flex flex="1" hideBelow="lg" align="center">
              <SearchBarTrigger
                placeholder="Search"
                shortcut="/"
                onClick={() => setIsSearchOpen(true)}
              />
              <SearchDialog
                open={isSearchOpen}
                onOpenChange={({ open }) => setIsSearchOpen(open)}
              />
            </Flex>

            <Flex flex="1" align="center" justify="flex-end">
              <MobileNav />
              <DesktopNav />
            </Flex>
          </Flex>
          <HStack h="12" gap="6" overflowY="auto">
            {headerLinks.map((link) => (
              <TabNavLink
                key={link.href}
                href={link.href}
                aria-current={pathname.startsWith(link.href) ? 'page' : undefined}
              >
                {link.label}
              </TabNavLink>
            ))}
          </HStack>
        </Stack>
      </Container>
    </Box>
  )
}

const MobileNav = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <HStack as="nav" hideFrom="lg">
      <SearchButtonTrigger onClick={() => setIsSearchOpen(true)} />
      <SearchDialog open={isSearchOpen} onOpenChange={({ open }) => setIsSearchOpen(open)} />
      <ColorModeButton size="sm" />
      <Menu.Root
        positioning={{
          placement: 'bottom',
          overflowPadding: 0,
          offset: { mainAxis: 17 },
        }}
      >
        <Menu.Trigger asChild>
          <IconButton aria-label="More actions" variant="ghost" size="xs" colorPalette="gray">
            <LuMenu />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content
              _open={{ animation: 'backdrop-in' }}
              _closed={{ animation: 'backdrop-out' }}
              boxShadow="none"
              borderRadius="none"
              bg="bg.canvas"
              maxW="unset"
              px={{ base: '4', md: '6' }}
              width="var(--available-width)"
              height="var(--available-height)"
              alignItems="center"
              py="6"
            >
              {headerLinks.map((link) => (
                <Menu.Item asChild key={link.href} value={link.label}>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </Menu.Item>
              ))}
              <Menu.Separator />
              {versions.map((version) => (
                <Menu.Item asChild key={version.value} value={version.value}>
                  <Link href={version.href}>{version.label}</Link>
                </Menu.Item>
              ))}
              <Menu.Separator />
              <NavLinkButton mt="1" w="full" size="xs" href="#">
                Dashboard
                <LuChevronRight />
              </NavLinkButton>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </HStack>
  )
}

const DesktopNav = () => {
  return (
    <HStack as="nav" hideBelow="lg" gap="2">
      <Button variant="ghost" size="xs" textStyle="sm">
        Ask AI <Icon as={LuSparkles} color="colorPalette.fg" />
      </Button>
      <NavLinkButton variant="ghost" size="xs" textStyle="sm" href="#">
        Log in
      </NavLinkButton>
      <NavLinkButton size="xs" textStyle="sm" href="#">
        Get started
      </NavLinkButton>
      <ColorModeButton size="sm" />
    </HStack>
  )
}

const versions = [
  { value: 'v2', label: 'v2', href: '#v2' },
  { value: 'v1', label: 'v1', href: '#v1' },
  { value: 'v0', label: 'v0 (beta)', href: '#v0' },
]

const VersionMenu = () => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="ghost" size="xs" textStyle="sm">
          v2.10.4 <LuChevronDown />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {versions.map((version) => (
              <Menu.Item asChild key={version.value} value={version.value}>
                <a href={version.href}>
                  <Menu.ItemText>{version.label}</Menu.ItemText>
                  <LuExternalLink />
                </a>
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
