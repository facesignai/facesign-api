'use client'

import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from './color-mode'

// Create custom theme system
const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        body: { value: 'Inter, system-ui, sans-serif' },
        heading: { value: 'Inter, system-ui, sans-serif' },
        mono: { value: 'JetBrains Mono, monospace' },
      },
      colors: {
        // Custom brand colors for FaceSign
        brand: {
          50: { value: '#f0fdf4' },
          100: { value: '#dcfce7' },
          200: { value: '#bbf7d0' },
          300: { value: '#86efac' },
          400: { value: '#4ade80' },
          500: { value: '#10b981' }, // Primary brand color
          600: { value: '#059669' },
          700: { value: '#047857' },
          800: { value: '#065f46' },
          900: { value: '#064e3b' },
          950: { value: '#052e16' },
        },
      },
    },
    semanticTokens: {
      colors: {
        // Documentation-specific tokens
        'docs.bg': {
          value: { base: 'white', _dark: 'gray.900' },
        },
        'docs.sidebar.bg': {
          value: { base: 'gray.50', _dark: 'gray.950' },
        },
        'docs.code.bg': {
          value: { base: 'gray.100', _dark: 'gray.800' },
        },
        'docs.accent': {
          value: { base: 'brand.500', _dark: 'brand.400' },
        },
      },
    },
    textStyles: {
      'docs.heading': {
        value: {
          fontWeight: 'semibold',
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
        },
      },
      'docs.body': {
        value: {
          fontSize: 'md',
          lineHeight: '1.7',
          color: 'fg.muted',
        },
      },
      'docs.code': {
        value: {
          fontFamily: 'mono',
          fontSize: '0.875em',
          bg: 'docs.code.bg',
          px: '1',
          py: '0.5',
          borderRadius: 'sm',
        },
      },
    },
  },
})

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}