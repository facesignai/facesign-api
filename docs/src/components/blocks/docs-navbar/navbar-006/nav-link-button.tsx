import { Button, type ButtonProps } from '@chakra-ui/react'

interface NavLinkButtonProps extends ButtonProps {
  href: string
}

export const NavLinkButton = ({ href, children, ...props }: NavLinkButtonProps) => {
  return (
    <Button asChild size="xs" textStyle="sm" {...props}>
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    </Button>
  )
}
