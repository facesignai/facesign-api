'use client'

function _optionalChain(ops) {
  let lastAccessLHS = undefined
  let value = ops[0]
  let i = 1
  while (i < ops.length) {
    const op = ops[i]
    const fn = ops[i + 1]
    i += 2
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      return undefined
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value
      value = fn(value)
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => value.call(lastAccessLHS, ...args))
      lastAccessLHS = undefined
    }
  }
  return value
}

import { Box, Heading, HStack, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import { LuText } from 'react-icons/lu'
import { tocData } from './data'
import { TocLink } from './toc-link'
import { useScrollSpy } from './use-scroll-spy'

export const Block = () => {
  const [activeId, setActiveId] = useState([tocData[0].id])

  useScrollSpy({
    data: tocData,
    setActiveId,
  })

  const handleClick = (id) => {
    setActiveId([id])
    const element = document.getElementById(id)
    _optionalChain([
      element,
      'optionalAccess',
      (_) => _.scrollIntoView,
      'call',
      (_2) => _2({ behavior: 'smooth' }),
    ])
  }

  return (
    <Box
      top='6'
      w='full'
      maxW='xs'
      overflowY='auto'
      position='sticky'
      maxH='calc(100vh - 3rem)'
    >
      <HStack alignItems='center' mb='4' px='3'>
        <LuText />
        <Heading textStyle='sm' fontWeight='medium'>
          On this page
        </Heading>
      </HStack>

      <Stack gap='0'>
        {tocData.map((item) => {
          return (
            <TocLink
              key={item.id}
              variant='minimal'
              css={{
                '--toc-item-depth': item.level,
              }}
              onClick={() => handleClick(item.id)}
              data-current={activeId.includes(item.id) || undefined}
            >
              {item.text}
            </TocLink>
          )
        })}
      </Stack>
    </Box>
  )
}
