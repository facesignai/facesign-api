'use client'

import { useColorMode } from './ui/color-mode'
import { useEffect, useState } from 'react'
import { IconButton, Box } from '@chakra-ui/react'
import { LuSun, LuMoon } from 'react-icons/lu'

export function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Box w={6} h={6} />
  }

  return (
    <IconButton
      onClick={toggleColorMode}
      size="sm"
      variant="ghost"
      aria-label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} theme`}
    >
      {colorMode === 'light' ? <LuSun /> : <LuMoon />}
    </IconButton>
  )
}
