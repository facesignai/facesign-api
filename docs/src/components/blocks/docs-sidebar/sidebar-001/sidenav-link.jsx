import { Box, chakra, Span } from '@chakra-ui/react'

export const SideNavLink = chakra('a', {
  base: {
    gap: '3',
    display: 'flex',
    textStyle: 'sm',
    alignItems: 'center',
    textDecoration: 'none',
    transitionProperty: 'color, border-color',
    transitionDuration: 'normal',
    transitionTimingFunction: 'default',
    focusVisibleRing: 'inside',
    focusRingWidth: '2px',
    _current: {
      fontWeight: 'medium',
      color: 'colorPalette.fg',
    },
  },

  variants: {
    variant: {
      minimal: {},
      filled: {
        borderRadius: 'l2',
        _hover: {
          bg: 'bg.muted',
        },
        _current: {
          color: { base: 'colorPalette.fg', _hover: 'colorPalette.fg' },
          bg: { base: 'colorPalette.subtle', _hover: 'colorPalette.subtle' },
        },
      },
      line: {
        borderStartWidth: '1px',
        borderStartColor: 'bg.muted',
        _hover: {
          borderStartColor: 'bg.emphasized',
        },
        _current: {
          borderStartColor: 'colorPalette.fg!',
        },
      },
    },

    size: {
      sm: {
        px: '2',
        py: '1',
      },
      md: {
        px: '4',
        py: '1.5',
      },
    },
  },

  defaultVariants: {
    variant: 'minimal',
    size: 'md',
  },
})

export const SideNavItem = (props) => {
  const { item, hideIcon, ...rest } = props
  return (
    <SideNavLink
      variant={item.variant}
      href={item.href}
      data-current={item.isActive || undefined}
      {...rest}
    >
      {item.icon && !hideIcon && (
        <Box
          boxSize='4'
          as={item.icon}
          color={item.isActive ? 'colorPalette.fg' : 'fg.subtle'}
        />
      )}
      <Span flex='1'>{item.title}</Span>
    </SideNavLink>
  )
}
