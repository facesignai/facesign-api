'use client'

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Link,
  Menu,
  Portal,
  Stack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { LuArrowRight, LuMenu } from 'react-icons/lu'
import { Logo } from './logo'
import { ColorModeButton } from '@/components/ui/color-mode'
import { docsLinks } from './data'
import { NavLinkButton } from './nav-link-button'
import { SearchBarTrigger, SearchButtonTrigger, SearchDialog } from './search'

export const Block = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  return (
    <Box top="0" width="full" zIndex="30" position="fixed" borderBottomWidth="1px">
      <Container maxW="8xl">
        <Flex height="16" align="center" gap="4" minW="0">
          <HStack gap="8">
            <Link href="/">
              <Logo />
            </Link>
            <SearchBarTrigger size="xs" hideBelow="lg" onClick={() => setIsSearchOpen(true)} />
            <SearchDialog open={isSearchOpen} onOpenChange={({ open }) => setIsSearchOpen(open)} />
          </HStack>

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
      <SearchButtonTrigger size="sm" onClick={() => setIsSearchOpen(true)} />
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
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </Menu.Item>
              ))}
              <Stack mt="1">
                <Button w="full" size="xs" variant="outline" colorPalette="gray">
                  Login
                </Button>
                <Button w="full" size="xs" color="white">
                  Sign up
                </Button>
              </Stack>
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
      {docsLinks.map((link) => (
        <NavLinkButton colorPalette="gray" key={link.href} href={link.href} variant="ghost">
          {link.label}
        </NavLinkButton>
      ))}
      <NavLinkButton href="#">
        Get Started
        <LuArrowRight />
      </NavLinkButton>
      <ColorModeButton size="sm" />
    </HStack>
  )
}
