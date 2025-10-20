'use client'

import { Box, Container, Flex, HStack, IconButton, Link, Menu, Portal } from '@chakra-ui/react'
import { useState } from 'react'
import { LuChevronRight, LuMenu } from 'react-icons/lu'
import { Logo } from './logo'
import { ColorModeButton } from '@/components/ui/color-mode'
import { docsLinks } from './data'
import { NavLinkButton } from './nav-link-button'
import { SearchButtonTrigger, SearchDialog } from './search'
import { TabNavLink } from './tab-nav-link'

export const Block = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <Box top="0" width="full" zIndex="30" position="fixed" borderBottomWidth="1px">
      <Container maxW="8xl">
        <HStack h="12" gap="4" minW="0">
          <HStack flex="1" gap="8">
            <Link href="/">
              <Logo />
            </Link>

            <HStack gap="6" overflowY="auto" hideBelow="lg">
              {docsLinks.map((link) => (
                <TabNavLink
                  h="12"
                  key={link.href}
                  href={link.href}
                  aria-current={link.isActive ? 'page' : undefined}
                >
                  {link.label}
                </TabNavLink>
              ))}
            </HStack>
          </HStack>

          <Flex flex="1" align="center" justify="flex-end">
            <MobileNav />
            <HStack as="nav" hideBelow="lg">
              <NavLinkButton href="#" variant="ghost">
                Dashboard
                <LuChevronRight />
              </NavLinkButton>
              <SearchButtonTrigger onClick={() => setIsSearchOpen(true)} />
              <SearchDialog
                open={isSearchOpen}
                onOpenChange={({ open }) => setIsSearchOpen(open)}
              />
              <ColorModeButton size="sm" />
            </HStack>
          </Flex>
        </HStack>
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
              {docsLinks.map((link) => (
                <Menu.Item asChild key={link.href} value={link.label}>
                  <a href={link.href}>{link.label}</a>
                </Menu.Item>
              ))}
              <NavLinkButton mt="1" href="#" size="xs" w="full" color="white">
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
