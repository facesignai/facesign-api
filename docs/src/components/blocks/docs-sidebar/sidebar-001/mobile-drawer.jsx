import { Button, Drawer, Heading, HStack, Portal, Text } from '@chakra-ui/react'
import { Fragment } from 'react'
import { LuChevronRight, LuMenu } from 'react-icons/lu'
import { navigationGroups } from './data'

export const SidebarMobileDrawer = ({
  children,
  breadcrumbItems = [
    navigationGroups[0].title,
    navigationGroups[0].items[0].title,
  ],
  ...props
}) => {
  const [first, ...rest] = breadcrumbItems
  return (
    <Drawer.Root placement='start' {...props}>
      <Drawer.Trigger asChild>
        <Button
          size='sm'
          hideFrom='lg'
          variant='plain'
          colorPalette='gray'
          aria-label='Open menu'
        >
          <HStack>
            <LuMenu />
            <Heading textStyle='sm' fontWeight='medium' color='fg'>
              {first}
            </Heading>
            {rest.map((item) => (
              <Fragment key={item}>
                <LuChevronRight />
                <Text fontSize='sm' color='fg.muted'>
                  {item}
                </Text>
              </Fragment>
            ))}
          </HStack>
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>{children}</Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
