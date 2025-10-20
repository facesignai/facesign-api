'use client'

import {
  Badge,
  Box,
  Flex,
  Icon,
  Input,
  InputGroup,
  Text,
  VStack,
} from '@chakra-ui/react'
import { LuExternalLink, LuSearch } from 'react-icons/lu'
import { apiReferenceData, externalLinks } from './data'
import { SidebarMobileDrawer } from './mobile-drawer'
import { SideNavLink } from './sidenav-link'

export const Block = () => {
  const [firstItem] = apiReferenceData
  return (
    <>
      <Box
        bg='bg'
        top='0'
        left='0'
        bottom='0'
        zIndex='20'
        width='18rem'
        hideBelow='lg'
        position='fixed'
        borderRightWidth='1px'
      >
        <SidebarContent />
      </Box>
      <SidebarMobileDrawer
        breadcrumbItems={[firstItem.category, firstItem.items[0].title]}
      >
        <SidebarContent />
      </SidebarMobileDrawer>
    </>
  )
}

const SidebarContent = () => {
  return (
    <Flex direction='column' h='full'>
      <Box p='3' position='relative' zIndex='20'>
        <InputGroup startElement={<Icon as={LuSearch} color='fg.muted' />}>
          <Input
            placeholder='Search for endpoints...'
            size='sm'
            variant='subtle'
          />
        </InputGroup>
      </Box>

      <Box flex='1' minH='0' overflowY='auto' px='3' pb='6'>
        <VStack gap='4' align='stretch'>
          {apiReferenceData.map((section, index) => (
            <Box key={index}>
              <Flex align='center' h='7' px='3' py='1'>
                <Text
                  fontSize='xs'
                  color='fg.muted'
                  fontWeight='medium'
                  textTransform='uppercase'
                >
                  {section.category}
                </Text>
              </Flex>

              <VStack gap='0' align='stretch'>
                {section.items.map((item, itemIndex) => (
                  <SideNavLink
                    key={itemIndex}
                    href='#'
                    variant='filled'
                    data-current={item.active || undefined}
                  >
                    {item.method && (
                      <MethodBadge method={item.method} active={item.active} />
                    )}
                    <Text flex='1' fontSize='sm'>
                      {item.title}
                    </Text>
                  </SideNavLink>
                ))}
              </VStack>
            </Box>
          ))}
        </VStack>
      </Box>
      <Box borderTopWidth='1px' px='3' py='4' bg='bg.panel'>
        {externalLinks.map((link, index) => (
          <SideNavLink
            key={index}
            href={link.href}
            variant='minimal'
            justifyContent='space-between'
          >
            {link.label}
            <LuExternalLink />
          </SideNavLink>
        ))}
      </Box>
    </Flex>
  )
}

const methodColorMap = {
  POST: 'blue',
  GET: 'green',
  PUT: 'yellow',
  PATCH: 'orange',
  DELETE: 'red',
}

const MethodBadge = (props) => {
  const { method, active } = props
  return (
    <Badge
      size='xs'
      fontWeight='semibold'
      colorPalette={methodColorMap[method]}
      variant={active ? 'solid' : 'subtle'}
    >
      {method}
    </Badge>
  )
}
