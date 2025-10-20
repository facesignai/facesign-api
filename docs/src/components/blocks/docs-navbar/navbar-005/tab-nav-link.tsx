'use client'

import { chakra } from '@chakra-ui/react'

export const TabNavLink = chakra('a', {
  base: {
    h: 'full',
    display: 'flex',
    flexShrink: '0',
    textStyle: 'sm',
    alignItems: 'center',
    fontWeight: 'medium',
    borderBottomWidth: '2px',
    _currentPage: {
      color: 'colorPalette.solid',
      borderBottomColor: 'colorPalette.solid',
    },
    _hover: {
      color: { base: 'fg', _currentPage: 'colorPalette.solid' },
      borderBottomColor: { base: 'border.emphasized', _currentPage: 'colorPalette.solid' },
    },
    color: 'fg.muted',
    borderBottomColor: 'transparent',
  },
})
