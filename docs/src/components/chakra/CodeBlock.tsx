'use client'

import {
  Box,
  Code,
  HStack,
  IconButton,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { LuCopy, LuCheck } from 'react-icons/lu'
import { useColorModeValue } from '@/components/ui/color-mode'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  variant?: 'request' | 'response'
}

export function CodeBlock({
  code,
  language = 'javascript',
  title,
  showLineNumbers = false,
  variant = 'request'
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const bgColor = useColorModeValue(variant === 'response' ? 'gray.50' : 'gray.50', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const headerBg = useColorModeValue('gray.50', 'gray.900')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split('\n')

  return (
    <Box
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
    >
      {(title || variant === 'response') && (
        <HStack
          justify="space-between"
          px={4}
          py={2}
          borderBottomWidth="1px"
          borderColor={borderColor}
          bg={headerBg}
        >
          <Text fontSize="sm" fontWeight="medium">
            {title || (variant === 'response' ? 'application/json' : '')}
          </Text>
          {language && variant !== 'response' && (
            <Text fontSize="xs" color="fg.muted">
              {language}
            </Text>
          )}
        </HStack>
      )}

      <Box position="relative">
        <Box
          bg={bgColor}
          p={4}
          overflowX="auto"
        >
          {showLineNumbers ? (
            <Box as="table" w="full">
              <tbody>
                {lines.map((line, index) => (
                  <tr key={index}>
                    <td>
                      <Text
                        as="span"
                        fontSize="xs"
                        color="fg.muted"
                        pr={4}
                        userSelect="none"
                        textAlign="right"
                        display="inline-block"
                        minW="3ch"
                      >
                        {index + 1}
                      </Text>
                    </td>
                    <td width="100%">
                      <Code
                        as="pre"
                        fontSize="sm"
                        bg="transparent"
                        whiteSpace="pre"
                        display="block"
                      >
                        {line || ' '}
                      </Code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Box>
          ) : (
            <Code
              as="pre"
              fontSize="sm"
              bg="transparent"
              whiteSpace="pre-wrap"
              display="block"
              overflowWrap="break-word"
            >
              {code}
            </Code>
          )}
        </Box>

        <IconButton
          aria-label={copied ? 'Copied!' : 'Copy code'}
          size="sm"
          variant="ghost"
          position="absolute"
          top={2}
          right={2}
          onClick={handleCopy}
          colorPalette={copied ? 'green' : 'gray'}
        >
          {copied ? <LuCheck /> : <LuCopy />}
        </IconButton>
      </Box>
    </Box>
  )
}