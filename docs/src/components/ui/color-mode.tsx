'use client'

import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react'
import { ThemeProvider, useTheme as useNextTheme } from 'next-themes'
import type { ComponentProps } from 'react'
import * as React from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'

export interface ColorModeProviderProps extends ComponentProps<typeof ThemeProvider> {}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  )
}

export function useColorMode() {
  const { resolvedTheme, setTheme } = useNextTheme()
  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }
  return {
    colorMode: resolvedTheme as 'light' | 'dark',
    setColorMode: setTheme,
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