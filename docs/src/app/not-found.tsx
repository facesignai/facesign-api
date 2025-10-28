import { Button } from '@/components/Button'
import { HeroPattern } from '@/components/HeroPattern'
import { Box, Container, VStack, Text, Heading, Card, HStack, SimpleGrid } from '@chakra-ui/react'
import { LuBook, LuFileText, LuCode, LuRocket } from 'react-icons/lu'
import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <HeroPattern />
      <Container maxW="4xl" h="full" centerContent py={20}>
        <VStack gap={8} textAlign="center">
          {/* Large gradient 404 */}
          <Box>
            <Text
              fontSize="9xl"
              fontWeight="black"
              bgGradient="to-r"
              gradientFrom="green.400"
              gradientTo="green.600"
              bgClip="text"
              letterSpacing="tight"
              lineHeight="1"
            >
              404
            </Text>
          </Box>

          {/* Heading and description */}
          <VStack gap={3}>
            <Heading as="h1" size="3xl" fontWeight="bold" lineHeight="1.2">
              Page not found
            </Heading>
            <Text fontSize="lg" color="gray.600" _dark={{ color: 'gray.400' }} maxW="md">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
            </Text>
          </VStack>

          {/* Action buttons */}
          <HStack gap={4} mt={4}>
            <Button href="/" arrow="left" variant="solid">
              Back to home
            </Button>
            <Button href="/docs" variant="outline">
              Browse docs
            </Button>
          </HStack>

          {/* Popular pages card */}
          <Card.Root
            mt={8}
            w="full"
            maxW="2xl"
            variant="outline"
            borderColor="gray.200"
            _dark={{ borderColor: 'gray.700' }}
          >
            <Card.Header>
              <Heading size="sm">Popular pages</Heading>
            </Card.Header>
            <Card.Body>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                <Link href="/docs" style={{ textDecoration: 'none' }}>
                  <HStack
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: 'gray.50', _dark: { bg: 'gray.800' } }}
                    cursor="pointer"
                    transition="all 0.2s"
                  >
                    <Box color="green.500">
                      <LuFileText />
                    </Box>
                    <Text fontWeight="medium">Documentation</Text>
                  </HStack>
                </Link>
                <Link href="/api" style={{ textDecoration: 'none' }}>
                  <HStack
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: 'gray.50', _dark: { bg: 'gray.800' } }}
                    cursor="pointer"
                    transition="all 0.2s"
                  >
                    <Box color="blue.500">
                      <LuCode />
                    </Box>
                    <Text fontWeight="medium">API Reference</Text>
                  </HStack>
                </Link>
                <Link href="/quickstart" style={{ textDecoration: 'none' }}>
                  <HStack
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: 'gray.50', _dark: { bg: 'gray.800' } }}
                    cursor="pointer"
                    transition="all 0.2s"
                  >
                    <Box color="purple.500">
                      <LuRocket />
                    </Box>
                    <Text fontWeight="medium">Quick Start</Text>
                  </HStack>
                </Link>
                <Link href="/sdks" style={{ textDecoration: 'none' }}>
                  <HStack
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: 'gray.50', _dark: { bg: 'gray.800' } }}
                    cursor="pointer"
                    transition="all 0.2s"
                  >
                    <Box color="orange.500">
                      <LuBook />
                    </Box>
                    <Text fontWeight="medium">SDKs</Text>
                  </HStack>
                </Link>
              </SimpleGrid>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Container>
    </>
  )
}
