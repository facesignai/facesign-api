'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Card,
  Icon,
} from '@chakra-ui/react'
import { useColorModeValue } from '@/components/ui/color-mode'
import NextLink from 'next/link'
import { DocsLayout } from '@/components/chakra/DocsLayout'
import {
  FiBook,
  FiCode,
  FiZap,
  FiLock,
  FiGlobe,
  FiUsers,
  FiArrowRight
} from 'react-icons/fi'

export default function HomePage() {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <DocsLayout showSidebar={false} showTOC={false}>
      <Container maxW="7xl" py={20}>
        <VStack gap={12} align="center" textAlign="center">
          {/* Hero Section */}
          <VStack gap={6}>
            <Heading
              as="h1"
              size="4xl"
              fontWeight="bold"
              bgGradient="linear(to-r, green.400, teal.500)"
              bgClip="text"
            >
              FaceSign API
            </Heading>
            <Text fontSize="2xl" color="gray.600" maxW="3xl">
              AI-powered identity verification platform with conversational interfaces,
              biometric verification, and document scanning.
            </Text>
            <HStack gap={4} pt={4}>
              <NextLink href="/docs" passHref>
                <Button
                  size="lg"
                  colorScheme="green"
                >
                  Read Documentation
                  <FiArrowRight />
                </Button>
              </NextLink>
              <NextLink href="/api" passHref>
                <Button
                  size="lg"
                  variant="outline"
                >
                  API Reference
                  <FiCode />
                </Button>
              </NextLink>
            </HStack>
          </VStack>

          {/* Features Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8} w="full" pt={12}>
            <Card.Root
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
              transition="all 0.3s"
            >
              <Card.Body>
                <Icon as={FiZap} w={10} h={10} color="green.500" mb={4} />
                <Heading size="md" mb={2}>Lightning Fast</Heading>
                <Text color="gray.600">
                  Real-time verification with instant results. Get verification
                  decisions in seconds, not minutes.
                </Text>
              </Card.Body>
            </Card.Root>

            <Card.Root
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
              transition="all 0.3s"
            >
              <Card.Body>
                <Icon as={FiLock} w={10} h={10} color="green.500" mb={4} />
                <Heading size="md" mb={2}>Secure & Compliant</Heading>
                <Text color="gray.600">
                  Built with security first. GDPR compliant, encrypted data
                  transmission, and secure storage.
                </Text>
              </Card.Body>
            </Card.Root>

            <Card.Root
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
              transition="all 0.3s"
            >
              <Card.Body>
                <Icon as={FiGlobe} w={10} h={10} color="green.500" mb={4} />
                <Heading size="md" mb={2}>Global Coverage</Heading>
                <Text color="gray.600">
                  Support for 100+ document types from 190+ countries.
                  Multi-language support included.
                </Text>
              </Card.Body>
            </Card.Root>

            <Card.Root
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
              transition="all 0.3s"
            >
              <Card.Body>
                <Icon as={FiUsers} w={10} h={10} color="green.500" mb={4} />
                <Heading size="md" mb={2}>AI-Powered</Heading>
                <Text color="gray.600">
                  Conversational AI guides users through verification with
                  natural language interactions.
                </Text>
              </Card.Body>
            </Card.Root>

            <Card.Root
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
              transition="all 0.3s"
            >
              <Card.Body>
                <Icon as={FiBook} w={10} h={10} color="green.500" mb={4} />
                <Heading size="md" mb={2}>Developer Friendly</Heading>
                <Text color="gray.600">
                  RESTful API with comprehensive SDKs for TypeScript, Python,
                  and Go. Built for developers.
                </Text>
              </Card.Body>
            </Card.Root>

            <Card.Root
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
              transition="all 0.3s"
            >
              <Card.Body>
                <Icon as={FiCode} w={10} h={10} color="green.500" mb={4} />
                <Heading size="md" mb={2}>Customizable Flows</Heading>
                <Text color="gray.600">
                  Node-based workflow system lets you build custom verification
                  flows with conditional logic.
                </Text>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>

          {/* Quick Start Section */}
          <Box w="full" pt={12}>
            <VStack gap={6}>
              <Heading size="xl">Get Started in Minutes</Heading>
              <Text fontSize="lg" color="gray.600">
                Install the SDK and create your first verification session
              </Text>
              <Card.Root bg={cardBg} w="full" maxW="2xl">
                <Card.Body>
                  <Box
                    bg={useColorModeValue('gray.100', 'gray.900')}
                    p={4}
                    borderRadius="md"
                    fontFamily="mono"
                  >
                    <Text color="green.500">$ npm install @facesignai/api</Text>
                  </Box>
                </Card.Body>
              </Card.Root>
              <HStack gap={4}>
                <NextLink href="/docs#installation" passHref>
                  <Button variant="outline">
                    View Installation Guide
                  </Button>
                </NextLink>
                <NextLink href="/api" passHref>
                  <Button variant="ghost">
                    Explore API →
                  </Button>
                </NextLink>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </DocsLayout>
  )
}