'use client'

import type { ButtonProps, DialogRootProps, IconButtonProps } from '@chakra-ui/react'
import {
  Button,
  Dialog,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Kbd,
  Portal,
  Span,
} from '@chakra-ui/react'
import { LuSearch } from 'react-icons/lu'

export const SearchDialog = (props: Omit<DialogRootProps, 'children'>) => {
  return (
    <Dialog.Root {...props}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p="4">
            <InputGroup startElement={<Icon as={LuSearch} color="fg.muted" />}>
              <Input bg="bg" placeholder="Search..." />
            </InputGroup>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

interface SearchBarTriggerProps extends ButtonProps {
  hideKbd?: boolean
  placeholder?: string
  shortcut?: React.ReactNode
}

export const SearchBarTrigger = (props: SearchBarTriggerProps) => {
  const { hideKbd, placeholder = 'Search docs...', shortcut = '⌘ K', ...rest } = props
  return (
    <Button
      w="full"
      color="fg"
      textStyle="sm"
      size="sm"
      variant="outline"
      colorPalette="gray"
      {...rest}
    >
      <HStack gap="2" flex="1">
        <Icon as={LuSearch} size="sm" color="fg.muted" />
        <Span fontWeight="normal">{placeholder}</Span>
      </HStack>
      {!hideKbd && (
        <Kbd size="sm" colorPalette="gray">
          {shortcut}
        </Kbd>
      )}
    </Button>
  )
}

export const SearchButtonTrigger = (props: IconButtonProps) => {
  return (
    <IconButton size="xs" variant="ghost" aria-label="Search" colorPalette="gray" {...props}>
      <LuSearch />
    </IconButton>
  )
}
