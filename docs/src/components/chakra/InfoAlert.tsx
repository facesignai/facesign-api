'use client'

import { Alert, Box } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface InfoAlertProps {
  children: ReactNode
  title?: string
}

/**
 * InfoAlert - Replacement for the MDX `Note` component
 * Uses Chakra UI Alert with info status
 *
 * Usage:
 * <InfoAlert>
 *   Keep your API keys server-side and use environment variables.
 * </InfoAlert>
 *
 * <InfoAlert title="Pro tip">
 *   You can use webhooks to get real-time updates.
 * </InfoAlert>
 */
export function InfoAlert({ children, title }: InfoAlertProps) {
  return (
    <Alert.Root status="info" mb={6} variant="subtle">
      <Alert.Indicator />
      <Alert.Content>
        {title && (
          <Alert.Title mb={1} fontWeight="semibold">
            {title}
          </Alert.Title>
        )}
        <Alert.Description>
          <Box color="info.700" _dark={{ color: 'info.200' }}>
            {children}
          </Box>
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  )
}