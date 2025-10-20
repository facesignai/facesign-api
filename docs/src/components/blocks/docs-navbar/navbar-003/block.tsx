'use client'

import { Box, Container, Flex, HStack, IconButton, Link, Menu, Portal } from '@chakra-ui/react'
import { useState } from 'react'
import { LuGithub, LuMenu } from 'react-icons/lu'
import { Logo } from './logo'
import { ColorModeButton } from '@/components/ui/color-mode'
import { externalLinks } from './data'
import { SearchBarTrigger, SearchButtonTrigger, SearchDialog } from './search'

export const Block = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <Box
      top="0"
      width="full"
      zIndex="30"
      position="fixed"
      borderBottomWidth="1px"
      borderColor="border.muted"
    >
      <Container maxW="8xl">
        <Flex height="16" align="center" gap="4" minW={0}>
          <HStack as="nav" flex="1" gap="8">
            <Link href="/">
              <Logo />
            </Link>
            <HStack hideBelow="lg" gap="8">
              {externalLinks.map((link) => (
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
            </HStack>
          </HStack>

          <HStack hideBelow="lg" align="center" justify="flex-end">
            <SearchBarTrigger onClick={() => setIsSearchOpen(true)} />
            <SearchDialog open={isSearchOpen} onOpenChange={({ open }) => setIsSearchOpen(open)} />
            <GitHubButton />
            <ColorModeButton size="sm" />
          </HStack>
          <MobileNav />
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
              {externalLinks.map((link) => (
                <Menu.Item asChild key={link.href} value={link.label}>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
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
