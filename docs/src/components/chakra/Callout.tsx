'use client'

import { Alert } from '@chakra-ui/react'

type CalloutType = 'info' | 'success' | 'warning' | 'error'

interface CalloutProps {
  children: React.ReactNode
  type?: CalloutType
  title?: string
}

const typeMap: Record<CalloutType, 'info' | 'success' | 'warning' | 'error'> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
}

export function Callout({ children, type = 'info', title }: CalloutProps) {
  return (
    <Alert.Root status={typeMap[type]} my={4}>
      <Alert.Indicator />
      <Alert.Content>
        {title && <Alert.Title>{title}</Alert.Title>}
        <Alert.Description>{children}</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  )
}


