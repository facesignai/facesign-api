import { chakra } from '@chakra-ui/react'

export const TocLink = chakra('a', {
  base: {
    py: '1.5',
    display: 'flex',
    textStyle: 'sm',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    paddingInlineStart: `calc(var(--toc-item-depth) * 0.75rem)`,
  },
  variants: {
    variant: {
      line: {
        color: 'fg.muted',
        borderStartWidth: '1px',
        borderStartColor: 'bg.muted',
        _hover: {
          borderStartColor: 'bg.emphasized',
        },
        _current: {
          color: 'colorPalette.fg',
          borderStartColor: {
            base: 'colorPalette.fg',
            _hover: 'colorPalette.fg',
          },
        },
      },
      minimal: {
        color: 'fg.muted',
        _current: {
          fontWeight: 'medium',
          color: { base: 'colorPalette.fg', _hover: 'colorPalette.fg' },
        },
      },
    },

    emphasized: {
      true: {
        fontWeight: 'medium',
        color: 'fg',
      },
    },
  },
  defaultVariants: {
    variant: 'line',
  },
})
