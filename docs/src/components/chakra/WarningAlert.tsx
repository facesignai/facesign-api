'use client'

import { Alert, Box } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface WarningAlertProps {
  children: ReactNode
  title?: string
}

/**
 * WarningAlert - Replacement for the MDX `Warning` component
 * Uses Chakra UI Alert with warning status
 *
 * Usage:
 * <WarningAlert>
 *   This endpoint is rate limited to 100 requests per minute.
 * </WarningAlert>
 *
 * <WarningAlert title="Breaking Change">
 *   This behavior will change in the next major version.
 * </WarningAlert>
 */
export function WarningAlert({ children, title }: WarningAlertProps) {
  return (
    <Alert.Root status="warning" mb={6} variant="subtle">
      <Alert.Indicator />
      <Alert.Content>
        {title && (
          <Alert.Title mb={1} fontWeight="semibold">
            {title}
          </Alert.Title>
        )}
        <Alert.Description>
          <Box color="warning.700" _dark={{ color: 'warning.200' }}>
            {children}
          </Box>
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  )
}