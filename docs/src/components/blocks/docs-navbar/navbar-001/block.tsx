'use client'

import type { LinkProps } from '@chakra-ui/react'
import { Box, Container, Flex, HStack, IconButton, Link, Menu, Portal } from '@chakra-ui/react'
import { useState } from 'react'
import { LuChevronRight, LuMenu } from 'react-icons/lu'
import { Logo } from './logo'
import { ColorModeButton } from '@/components/ui/color-mode'
import { externalLinks } from './data'
import { NavLinkButton } from './nav-link-button'
import { SearchBarTrigger, SearchButtonTrigger, SearchDialog } from './search'

export const Block = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <Box
      top={0}
      width="full"
      zIndex={30}
      position="fixed"
      borderBottomWidth="1px"
      borderColor="border.muted"
    >
      <Container maxW="8xl">
        <Flex h="16" align="center" gap="4" minW={0}>
          <Box flex="1">
            <Link href="/">
              <Logo />
            </Link>
          </Box>

          <Flex flex="1" hideBelow="lg" align="center">
            <SearchBarTrigger onClick={() => setIsSearchOpen(true)} />
            <SearchDialog open={isSearchOpen} onOpenChange={({ open }) => setIsSearchOpen(open)} />
          </Flex>

          <Flex flex="1" align="center" justify="flex-end">
            <MobileNav />
            <DesktopNav />
          </Flex>
        </Flex>
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
              {externalLinks.map((link) => (
                <Menu.Item asChild key={link.href} value={link.label}>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </Menu.Item>
              ))}
              <NavLinkButton mt="1" href="#" size="xs" w="full">
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

const DesktopNavLink = (props: LinkProps) => {
  return (
    <Link
      textStyle="sm"
      color="fg.muted"
      target="_blank"
      _hover={{ color: 'fg', textDecoration: 'none' }}
      {...props}
    />
  )
}

const DesktopNav = () => {
  return (
    <HStack as="nav" hideBelow="lg" gap="4">
      {externalLinks.map((link) => (
        <DesktopNavLink key={link.href}>{link.label}</DesktopNavLink>
      ))}
      <NavLinkButton href="#" textStyle="sm">
        Dashboard
        <LuChevronRight />
      </NavLinkButton>
      <ColorModeButton size="sm" />
    </HStack>
  )
}
