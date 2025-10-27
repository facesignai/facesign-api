'use client'

import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react'
import * as React from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'

export interface ColorModeProviderProps {
  children: React.ReactNode
}

export function ColorModeProvider({ children }: ColorModeProviderProps) {
  return <>{children}</>
}

export function useColorMode() {
  // For Chakra v3, we need to use the context directly
  const [colorMode, setColorMode] = React.useState<'light' | 'dark'>('light')

  React.useEffect(() => {
    // Get from localStorage or system preference
    const stored = localStorage.getItem('chakra-ui-color-mode')
    if (stored) {
      setColorMode(stored as 'light' | 'dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setColorMode(prefersDark ? 'dark' : 'light')
    }
  }, [])

  const toggleColorMode = React.useCallback(() => {
    setColorMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('chakra-ui-color-mode', next)
      document.documentElement.classList.toggle('dark', next === 'dark')
      return next
    })
  }, [])

  return {
    colorMode,
    setColorMode: (mode: 'light' | 'dark') => {
      setColorMode(mode)
      localStorage.setItem('chakra-ui-color-mode', mode)
      document.documentElement.classList.toggle('dark', mode === 'dark')
    },
    toggleColorMode,
  }
}

export function useColorModeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode()
  return colorMode === 'light' ? light : dark
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === 'light' ? <LuSun /> : <LuMoon />
}

interface ColorModeButtonProps {
  size?: 'sm' | 'md' | 'lg'
}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode, colorMode } = useColorMode()
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        size={props.size || 'md'}
        ref={ref}
        aria-label={colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  )
})

ColorModeButton.displayName = 'ColorModeButton'