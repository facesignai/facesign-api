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
  VStack,
  Box,
  Text,
} from '@chakra-ui/react'
import { LuSearch } from 'react-icons/lu'
import { useSearch } from '@/components/SearchProvider'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { truncateContent } from '@/lib/search'

export const SearchDialog = (props: Omit<DialogRootProps, 'children'>) => {
  const { query, setQuery, results, isLoading } = useSearch()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  // Focus input when dialog opens
  useEffect(() => {
    if (props.open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [props.open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      handleNavigate(results[selectedIndex].url)
    }
  }

  const handleNavigate = (url: string) => {
    router.push(url)
    if (props.onOpenChange) {
      props.onOpenChange({ open: false })
    }
  }

  return (
    <Dialog.Root {...props}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="2xl" p="0">
            {/* Search Input */}
            <Box p="4" borderBottomWidth="1px">
              <InputGroup startElement={<Icon as={LuSearch} color="fg.muted" />}>
                <Input
                  ref={inputRef}
                  bg="bg"
                  placeholder="Search documentation..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  border="none"
                  _focus={{ outline: 'none', boxShadow: 'none' }}
                />
              </InputGroup>
            </Box>

            {/* Search Results */}
            <Box maxH="md" overflowY="auto">
              {!query && !isLoading && (
                <Box p="8" textAlign="center">
                  <Text color="fg.muted" fontSize="sm">
                    Type to search documentation
                  </Text>
                </Box>
              )}

              {query && results.length === 0 && !isLoading && (
                <Box p="8" textAlign="center">
                  <Text color="fg.muted" fontSize="sm">
                    {`No results found for "${query}"`}
                  </Text>
                </Box>
              )}

              {results.length > 0 && (
                <VStack align="stretch" gap="0" p="2">
                  {results.map((result, idx) => (
                    <Box
                      key={result.id}
                      p="3"
                      borderRadius="md"
                      bg={idx === selectedIndex ? 'gray.100' : 'transparent'}
                      _dark={{ bg: idx === selectedIndex ? 'gray.800' : 'transparent' }}
                      cursor="pointer"
                      onClick={() => handleNavigate(result.url)}
                      _hover={{
                        bg: 'gray.100',
                        _dark: { bg: 'gray.800' },
                      }}
                    >
                      <VStack align="start" gap="1">
                        <HStack gap="2" fontSize="sm">
                          <Text fontWeight="semibold" color="fg">
                            {result.title}
                          </Text>
                          {result.heading && (
                            <>
                              <Text color="fg.muted">›</Text>
                              <Text color="fg.muted">{result.heading}</Text>
                            </>
                          )}
                        </HStack>
                        <Text fontSize="xs" color="fg.muted" lineClamp={2}>
                          {truncateContent(result.content, 120)}
                        </Text>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>

            {/* Footer */}
            {results.length > 0 && (
              <Box
                p="3"
                borderTopWidth="1px"
                fontSize="xs"
                color="fg.muted"
                textAlign="center"
              >
                Use ↑↓ to navigate, Enter to select, Esc to close
              </Box>
            )}
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