'use client'

import { Box, Heading, Text, VStack, HStack, Button, Card, SimpleGrid } from '@chakra-ui/react'
import { DocsLayout } from '@/components/chakra/DocsLayout'
import NextLink from 'next/link'

export default function DocsPage() {
  return (
    <DocsLayout variant="docs">
      <VStack align="stretch" gap={10}>
        <Box>
          <Heading as="h1" size="2xl" mb={3}>
            FaceSign Documentation
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Build white‑label verification flows with FaceSign. Guides, concepts, and tutorials.
          </Text>
        </Box>

        <Box>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <NextLink href="/docs/sessions" passHref legacyBehavior>
              <Card.Root as="a" borderWidth="1px" _hover={{ borderColor: 'green.500', transform: 'translateY(-2px)', boxShadow: 'md' }} transition="all 0.2s">
                <Card.Body>
                  <Heading as="h3" size="md" mb={1}>Sessions</Heading>
                  <Text fontSize="sm" color="gray.600">Create and manage verification sessions; lifecycle, statuses, best practices.</Text>
                </Card.Body>
              </Card.Root>
            </NextLink>

            <NextLink href="/docs/flows" passHref legacyBehavior>
              <Card.Root as="a" borderWidth="1px" _hover={{ borderColor: 'green.500', transform: 'translateY(-2px)', boxShadow: 'md' }} transition="all 0.2s">
                <Card.Body>
                  <Heading as="h3" size="md" mb={1}>Flows</Heading>
                  <Text fontSize="sm" color="gray.600">Compose verification nodes with branching and outcomes.</Text>
                </Card.Body>
              </Card.Root>
            </NextLink>

            <NextLink href="/docs/webhooks" passHref legacyBehavior>
              <Card.Root as="a" borderWidth="1px" _hover={{ borderColor: 'green.500', transform: 'translateY(-2px)', boxShadow: 'md' }} transition="all 0.2s">
                <Card.Body>
                  <Heading as="h3" size="md" mb={1}>Webhooks</Heading>
                  <Text fontSize="sm" color="gray.600">Receive real‑time updates about session status changes securely.</Text>
                </Card.Body>
              </Card.Root>
            </NextLink>
          </SimpleGrid>
        </Box>

        <Card.Root bg="gray.50" borderWidth="1px">
          <Card.Body p={6} textAlign="center">
            <Text color="gray.700" mb={3}>Need endpoint details?</Text>
            <HStack justify="center">
              <NextLink href="/api" passHref legacyBehavior>
                <Button as="a" colorScheme="green">Open API Reference</Button>
              </NextLink>
            </HStack>
          </Card.Body>
        </Card.Root>
      </VStack>
    </DocsLayout>
  )
}


