import Link from 'next/link'
import { Button as ChakraButton, Icon } from '@chakra-ui/react'

function ArrowIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="20" height="20" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"
      />
    </svg>
  )
}

type ButtonProps = {
  variant?: 'solid' | 'subtle' | 'outline' | 'ghost' | 'plain' | 'text'
  arrow?: 'left' | 'right'
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
)

export function Button({
  variant = 'solid',
  children,
  arrow,
  ...props
}: ButtonProps) {
  // Map "text" variant to "plain" for backward compatibility
  const chakraVariant = variant === 'text' ? 'plain' : variant
  const arrowIcon = arrow ? (
    <Icon
      transform={arrow === 'left' ? 'rotate(180deg)' : undefined}
      ml={arrow === 'right' ? 1 : undefined}
      mr={arrow === 'left' ? 1 : undefined}
    >
      <ArrowIcon />
    </Icon>
  ) : null

  const inner = (
    <>
      {arrow === 'left' && arrowIcon}
      {children}
      {arrow === 'right' && arrowIcon}
    </>
  )

  if (typeof props.href === 'undefined') {
    return (
      <ChakraButton
        variant={chakraVariant}
        colorPalette="green"
        size="sm"
        {...(props as React.ComponentPropsWithoutRef<'button'>)}
      >
        {inner}
      </ChakraButton>
    )
  }

  return (
    <ChakraButton
      asChild
      variant={chakraVariant}
      colorPalette="green"
      size="sm"
    >
      <Link {...(props as React.ComponentPropsWithoutRef<typeof Link>)}>
        {inner}
      </Link>
    </ChakraButton>
  )
}
