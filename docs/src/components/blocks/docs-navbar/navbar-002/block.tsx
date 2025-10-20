'use client'

import { Box, Container, Flex, HStack, IconButton, Link, Menu, Portal } from '@chakra-ui/react'
import { useState } from 'react'
import { LuChevronRight, LuGithub, LuMenu } from 'react-icons/lu'
import { Logo } from './logo'
import { ColorModeButton } from '@/components/ui/color-mode'
import { docsLinks } from './data'
import { NavLinkButton } from './nav-link-button'
import { SearchButtonTrigger, SearchDialog } from './search'

export const Block = () => {
  return (
    <Box top="0" width="full" zIndex="30" position="fixed" borderBottomWidth="1px">
      <Container maxW="8xl">
        <Flex height="16" align="center" gap="4" minW="0">
          <Box flex="1">
            <Link href="/">
              <Logo />
            </Link>
          </Box>

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
      <GitHubButton />
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
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </Menu.Item>
              ))}
              <NavLinkButton mt="1" size="xs" w="full" color="white" href="#">
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
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <HStack as="nav" hideBelow="lg" gap="4">
      <HStack gap="8">
        {docsLinks.map((link) => (
          <Link
            key={link.href}
            textStyle="sm"
            color="fg.muted"
            target="_blank"
            _hover={{ color: 'fg', textDecoration: 'none' }}
          >
            {link.label}
          </Link>
        ))}
        <NavLinkButton size="xs" color="white" href="#" textStyle="sm">
          Dashboard
          <LuChevronRight />
        </NavLinkButton>
      </HStack>
      <HStack>
        <GitHubButton />
        <SearchButtonTrigger onClick={() => setIsSearchOpen(true)} />
        <SearchDialog open={isSearchOpen} onOpenChange={({ open }) => setIsSearchOpen(open)} />
        <ColorModeButton size="sm" />
      </HStack>
    </HStack>
  )
}

const GitHubButton = () => {
  return (
    <IconButton asChild variant="ghost" size="xs" aria-label="GitHub" colorPalette="gray">
      <a target="_blank" rel="noopener noreferrer" href="#">
        <LuGithub />
      </a>
    </IconButton>
  )
}
