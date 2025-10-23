'use client'

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  Badge,
  Separator,
  Grid,
  Link,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react'
import { DocsLayout } from '@/components/chakra/DocsLayout'
import { useColorModeValue } from '@/components/ui/color-mode'
import { FiGithub, FiArrowRight } from 'react-icons/fi'
import NextLink from 'next/link'
import { TabbedCodeBlock } from '@/components/chakra/TabbedCodeBlock'

interface StepData {
  id: string
  title: string
  description: string
}

const howItWorksSteps: StepData[] = [
  {
    id: 'define-flow',
    title: 'Define Your Flow',
    description: 'Choose which verification steps (nodes) your users go through',
  },
  {
    id: 'integrate-sdk',
    title: 'Integrate SDK',
    description: 'Add FaceSign to your web or mobile app via our SDK',
  },
  {
    id: 'user-verifies',
    title: 'User Verifies',
    description: 'Users complete verification within your app interface',
  },
  {
    id: 'get-results',
    title: 'Get Results',
    description: 'Receive verification results via API callbacks or webhooks',
  },
]

interface StepProps {
  step: StepData
  stepNumber: number
}

const Step = ({ step, stepNumber }: StepProps) => {
  return (
    <Box
      pl="6"
      py="4"
      id={step.id}
      position="relative"
      borderLeftWidth="1px"
      borderLeftColor="border.muted"
    >
      <HStack gap="4" align="flex-start">
        <Flex
          top="4"
          left="-4"
          boxSize="8"
          rounded="l2"
          bg="bg.muted"
          borderWidth={1}
          position="absolute"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="fg.muted" textStyle="sm" fontWeight="semibold">
            {stepNumber}
          </Text>
        </Flex>

        <VStack gap="3" align="stretch" flex={1} ml="4">
          <Text as="h3" textStyle="lg" fontWeight="semibold" color="fg">
            {step.title}
          </Text>
          <Text color="fg.muted" textStyle="sm">
            {step.description}
          </Text>
        </VStack>
      </HStack>
    </Box>
  )
}

export default function DocsPage() {
  const cardBg = useColorModeValue('white', 'transparent')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <DocsLayout variant="docs">
      <VStack align="stretch" gap={12}>
        {/* Hero Section */}
        <Box>
          <Heading as="h1" size="2xl" mb={4}>
            FaceSign API Documentation
          </Heading>
          <Text fontSize="xl" color="gray.600" mb={6}>
            AI-powered identity verification platform with conversational interfaces,
            biometric verification, and multi-factor authentication.
          </Text>
          <HStack gap={4}>
            <NextLink href="/quickstart" passHref legacyBehavior>
              <Button as="a" colorScheme="green" size="lg">
                Get Started
              </Button>
            </NextLink>
            <Link href="https://github.com/facesignai" target="_blank" _hover={{ textDecoration: 'none' }}>
              <Button variant="outline" size="lg">
                <FiGithub />
                View on GitHub
              </Button>
            </Link>
          </HStack>
        </Box>

        <Separator />

        {/* How It Works - Simplified Vertical List */}
        <Box id="how-it-works">
          <Heading as="h2" size="lg" mb={4}>
            How It Works
          </Heading>
          <Text mb={6} color="gray.600">
            FaceSign is a white-labeled verification SDK that integrates directly into your application.
            Users complete verification entirely within YOUR app - they never leave your domain or see our branding.
          </Text>

          <VStack gap="0" align="stretch" mb={6}>
            {howItWorksSteps.map((step: StepData, index: number) => (
              <Step key={step.id} step={step} stepNumber={index + 1} />
            ))}
          </VStack>

          <Text fontSize="sm" color="gray.600" fontStyle="italic">
            <strong>Your brand, your app, your domain.</strong> FaceSign powers the verification
            invisibly behind the scenes. Users see only your application.
          </Text>
        </Box>

        <Separator />

        {/* Integration Modes */}
        <Box id="integration-modes">
          <Heading as="h2" size="lg" mb={4}>
            Integration Modes
          </Heading>
          <Text mb={6} color="gray.600">
            Choose the integration approach that best fits your stack.
          </Text>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <Card.Body>
                <Badge colorScheme="blue" mb={3}>
                  Server-Side
                </Badge>
                <Heading as="h3" size="md" mb={2}>
                  REST API
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Direct HTTP integration for maximum flexibility and control over verification flows
                </Text>
                <Text fontSize="xs" color="gray.500">
                  <strong>Best for:</strong> Backend services, webhooks, custom implementations
                </Text>
              </Card.Body>
            </Card.Root>

            <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <Card.Body>
                <Badge colorScheme="green" mb={3}>
                  JavaScript/TypeScript
                </Badge>
                <Heading as="h3" size="md" mb={2}>
                  @facesignai/api
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Official TypeScript SDK with type safety and IDE autocompletion
                </Text>
                <Text fontSize="xs" color="gray.500">
                  <strong>Best for:</strong> Node.js, Next.js, React, Vue, Angular applications
                </Text>
              </Card.Body>
            </Card.Root>

            <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <Card.Body>
                <Badge colorScheme="purple" mb={3}>
                  Mobile SDKs
                </Badge>
                <Heading as="h3" size="md" mb={2}>
                  Python & Go
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Native SDKs for Python and Go backend services
                </Text>
                <Text fontSize="xs" color="gray.500">
                  <strong>Best for:</strong> Django, Flask, FastAPI, Go microservices
                </Text>
              </Card.Body>
            </Card.Root>
          </Grid>
        </Box>

        <Separator />

        {/* Installation */}
        <Box id="installation">
          <Heading as="h2" size="lg" mb={4}>
            Installation
          </Heading>
          <Text mb={6} color="gray.600">
            Install the SDK for your preferred language.
          </Text>

          <TabbedCodeBlock
            defaultLanguage="npm"
            codeExamples={{
              npm: "npm install @facesignai/api",
              python: "pip install facesign",
              go: "go get github.com/facesignai/facesign-go",
              curl: "# No installation needed - use cURL directly\ncurl -X POST https://api.dev.facesign.ai/sessions \\\n  -H \"Authorization: Bearer YOUR_API_KEY\"",
            }}
          />

          <Text mt={4} fontSize="sm" color="gray.600">
            See the <NextLink href="/quickstart" passHref legacyBehavior><Link color="green.600">Quick Start guide</Link></NextLink> for complete setup instructions.
          </Text>
        </Box>

        <Separator />

        {/* Quick Links to Main Guides */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Core Concepts
          </Heading>
          <Text mb={6} color="gray.600">
            Learn the fundamentals of building with FaceSign.
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <NextLink href="/sessions" passHref legacyBehavior>
              <Card.Root
                as="a"
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                cursor="pointer"
                _hover={{ borderColor: 'green.500', transform: 'translateY(-2px)', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                <Card.Body>
                  <HStack justify="space-between" mb={2}>
                    <Heading as="h3" size="md">
                      Sessions
                    </Heading>
                    <FiArrowRight color="var(--chakra-colors-green-500)" />
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    Create and manage verification sessions. Learn about session lifecycle, statuses, and best practices.
                  </Text>
                </Card.Body>
              </Card.Root>
            </NextLink>

            <NextLink href="/flows" passHref legacyBehavior>
              <Card.Root
                as="a"
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                cursor="pointer"
                _hover={{ borderColor: 'green.500', transform: 'translateY(-2px)', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                <Card.Body>
                  <HStack justify="space-between" mb={2}>
                    <Heading as="h3" size="md">
                      Flows
                    </Heading>
                    <FiArrowRight color="var(--chakra-colors-green-500)" />
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    Build custom verification flows with nodes and edges. Configure conditional branching and outcomes.
                  </Text>
                </Card.Body>
              </Card.Root>
            </NextLink>

            <NextLink href="/flows" passHref legacyBehavior>
              <Card.Root
                as="a"
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                cursor="pointer"
                _hover={{ borderColor: 'green.500', transform: 'translateY(-2px)', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                <Card.Body>
                  <HStack justify="space-between" mb={2}>
                    <Heading as="h3" size="md">
                      Verification Flows
                    </Heading>
                    <FiArrowRight color="var(--chakra-colors-green-500)" />
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    Build custom verification flows using a node-graph system. Chain together conversation, liveness, document scan, and authentication nodes.
                  </Text>
                </Card.Body>
              </Card.Root>
            </NextLink>

            <NextLink href="/webhooks" passHref legacyBehavior>
              <Card.Root
                as="a"
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                cursor="pointer"
                _hover={{ borderColor: 'green.500', transform: 'translateY(-2px)', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                <Card.Body>
                  <HStack justify="space-between" mb={2}>
                    <Heading as="h3" size="md">
                      Webhooks
                    </Heading>
                    <FiArrowRight color="var(--chakra-colors-green-500)" />
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    Receive real-time updates about session status changes. Secure webhook verification and handling.
                  </Text>
                </Card.Body>
              </Card.Root>
            </NextLink>
          </SimpleGrid>
        </Box>

        <Separator />

        {/* API Reference Link */}
        <Box>
          <Card.Root bg="gray.50" borderWidth="1px" borderColor={borderColor}>
            <Card.Body p={8} textAlign="center">
              <Heading as="h3" size="lg" mb={2}>
                Ready to build?
              </Heading>
              <Text color="gray.600" mb={6}>
                Check out the complete API reference for detailed endpoint documentation.
              </Text>
              <HStack justify="center" gap={4}>
                <NextLink href="/api" passHref legacyBehavior>
                  <Button as="a" colorScheme="green">
                    View API Reference
                  </Button>
                </NextLink>
                <NextLink href="/quickstart" passHref legacyBehavior>
                  <Button as="a" variant="outline">
                    Quick Start Guide
                  </Button>
                </NextLink>
              </HStack>
            </Card.Body>
          </Card.Root>
        </Box>

      </VStack>
    </DocsLayout>
  )
}
