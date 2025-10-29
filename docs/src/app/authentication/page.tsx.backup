import { Metadata } from 'next'
import { Prose } from '@/components/chakra/Prose'
import { DocLinkCard } from '@/components/chakra/DocLinkCard'
import { SimpleGrid, Heading, Card, HStack, VStack, Text, Code, Badge, Circle, Box, Table, Link } from '@chakra-ui/react'
import { SimpleCodeBlock } from '@/components/chakra/SimpleCodeBlock'
import { Warning } from '@/components/mdx'
import { DocsLayout } from '@/components/chakra/DocsLayout'
import { LuCheck, LuX } from 'react-icons/lu'

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Learn how to authenticate your API requests with FaceSign.',
}

export default function AuthenticationPage() {
  return (
    <DocsLayout variant="docs">
      <Prose>
      <Heading as="h1" size="2xl" mb={4}>Authentication</Heading>
      <Text fontSize="xl" color="gray.600" _dark={{ color: 'gray.400' }} mb={6}>
        The FaceSign API uses API keys to authenticate requests. You can view and manage your API
        keys in the FaceSign Dashboard.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4}>API Keys</Heading>
      <p>FaceSign provides two types of API keys:</p>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} my={6}>
        <Card.Root>
          <Card.Body>
            <HStack mb={3}>
              <Badge colorPalette="gray" size="sm">TEST</Badge>
              <Heading size="sm">Test Mode Keys</Heading>
            </HStack>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Start with <Code>sk_test_</Code>
            </Text>
            <Text fontSize="sm">
              Perfect for development and testing. Same capabilities as production keys but won&apos;t charge your account. All sessions are clearly marked as test mode.
            </Text>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Body>
            <HStack mb={3}>
              <Badge colorPalette="gray" size="sm">LIVE</Badge>
              <Heading size="sm">Production Mode Keys</Heading>
            </HStack>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Start with <Code>sk_live_</Code>
            </Text>
            <Text fontSize="sm">
              For your live environment. All transactions are real and will be processed according to your plan.
            </Text>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>

      <Heading as="h2" size="lg" mt={8} mb={4}>Getting your API keys</Heading>

      <VStack align="stretch" gap={4} my={6}>
        <HStack align="start">
          <Circle size="8" bg="blue.500" color="white" fontWeight="bold" flexShrink={0}>
            1
          </Circle>
          <Box flex="1">
            <Text fontWeight="medium" mb={1}>Log in to your FaceSign Dashboard</Text>
            <Text fontSize="sm" color="gray.600">
              Navigate to{' '}
              <Link href="https://dashboard.facesign.ai" color="blue.500" textDecoration="underline">
                dashboard.facesign.ai
              </Link>
            </Text>
          </Box>
        </HStack>

        <HStack align="start">
          <Circle size="8" bg="blue.500" color="white" fontWeight="bold" flexShrink={0}>
            2
          </Circle>
          <Box flex="1">
            <Text fontWeight="medium" mb={1}>Navigate to API Keys settings</Text>
            <Text fontSize="sm" color="gray.600">
              Go to <strong>Settings</strong> → <strong>API Keys</strong>
            </Text>
          </Box>
        </HStack>

        <HStack align="start">
          <Circle size="8" bg="blue.500" color="white" fontWeight="bold" flexShrink={0}>
            3
          </Circle>
          <Box flex="1">
            <Text fontWeight="medium" mb={1}>Copy your API key</Text>
            <Text fontSize="sm" color="gray.600">
              Choose the appropriate environment (test or production) and copy your API key
            </Text>
          </Box>
        </HStack>
      </VStack>

      <Warning title="Security Warning">
        Keep your API keys secure! Never commit them to version control or expose them in
        client-side code.
      </Warning>

      <Heading as="h2" size="lg" mt={8} mb={4}>Using API keys</Heading>
      <p>Include your API key in the Authorization header of every request:</p>

      <SimpleCodeBlock
        defaultLanguage="bash"
        languageSwitcher="tabs"
        codeExamples={{
          bash: `curl https://api.dev.facesign.ai/sessions \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
          javascript: `import Client from '@facesignai/api'

const client = new Client({
  auth: 'YOUR_API_KEY',
  serverUrl: 'https://api.dev.facesign.ai'
})`,
          python: `import facesignai

client = facesignai.Client(
    auth='YOUR_API_KEY',
    base_url='https://api.dev.facesign.ai'
)`,
        }}
      />

      <Heading as="h3" size="md" mt={6} mb={3}>Environment Variables</Heading>
      <p>We strongly recommend using environment variables to store your API keys:</p>

      <SimpleCodeBlock
        defaultLanguage="bash"
        languageSwitcher="tabs"
        codeExamples={{
          bash: `# .env file
FACESIGN_API_KEY=YOUR_API_KEY`,
          javascript: `import Client from '@facesignai/api'

const client = new Client({
  auth: process.env.FACESIGN_API_KEY,
  serverUrl: 'https://api.dev.facesign.ai'
})`,
          python: `import os
import facesignai

client = facesignai.Client(
    auth=os.environ.get('FACESIGN_API_KEY'),
    base_url='https://api.dev.facesign.ai'
)`,
        }}
      />

      <Heading as="h2" size="lg" mt={8} mb={4}>Client-side authentication</Heading>
      <p>
        <strong>Never use your API key on the client side!</strong> Instead, create a session on
        your backend and provide the client secret URL to your end users:
      </p>

      <SimpleCodeBlock
        title="Create session on backend"
        language="javascript"
        code={`import Client from '@facesignai/api'

const client = new Client({
  auth: process.env.FACESIGN_API_KEY,
  serverUrl: 'https://api.dev.facesign.ai'
})

const { session, clientSecret } = await client.session.create({
  clientReferenceId: 'user-123',
  metadata: {},
  flow: { nodes: [...], edges: [...] }
})

// Send clientSecret to your frontend
return { clientSecret }`}
      />

      <Heading as="h2" size="lg" mt={8} mb={4}>Test vs Production Keys</Heading>
      <p>Choose the right key type for your environment:</p>

      <Box my={6} borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row bg="gray.50" _dark={{ bg: 'gray.800' }}>
              <Table.ColumnHeader>Feature</Table.ColumnHeader>
              <Table.ColumnHeader>Test Mode</Table.ColumnHeader>
              <Table.ColumnHeader>Production Mode</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell fontWeight="medium">Key prefix</Table.Cell>
              <Table.Cell><Code>sk_test_</Code></Table.Cell>
              <Table.Cell><Code>sk_live_</Code></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell fontWeight="medium">Environment</Table.Cell>
              <Table.Cell>Development & Testing</Table.Cell>
              <Table.Cell>Production</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell fontWeight="medium">Sessions marked</Table.Cell>
              <Table.Cell>
                <HStack>
                  <LuCheck color="green" />
                  <Text>Yes, as test mode</Text>
                </HStack>
              </Table.Cell>
              <Table.Cell>
                <HStack>
                  <LuX color="gray" />
                  <Text>No</Text>
                </HStack>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell fontWeight="medium">Full API access</Table.Cell>
              <Table.Cell>
                <HStack>
                  <LuCheck color="green" />
                  <Text>Yes</Text>
                </HStack>
              </Table.Cell>
              <Table.Cell>
                <HStack>
                  <LuCheck color="green" />
                  <Text>Yes</Text>
                </HStack>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell fontWeight="medium">Safe to commit</Table.Cell>
              <Table.Cell>
                <HStack>
                  <LuX color="red" />
                  <Text>Never</Text>
                </HStack>
              </Table.Cell>
              <Table.Cell>
                <HStack>
                  <LuX color="red" />
                  <Text>Never</Text>
                </HStack>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Box>

      <Heading as="h2" size="lg" mt={8} mb={4}>Quick Reference</Heading>

      <Card.Root my={6} bg="gray.50" borderColor="gray.200" _dark={{ bg: 'gray.900', borderColor: 'gray.700' }}>
        <Card.Body>
          <Heading size="sm" mb={4}>API Key Format</Heading>
          <VStack align="stretch" gap={3}>
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>Test Keys</Text>
              <Code display="block" p={2} fontSize="sm">
                sk_test_[your_key_here]
              </Code>
            </Box>
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>Production Keys</Text>
              <Code display="block" p={2} fontSize="sm">
                sk_live_[your_key_here]
              </Code>
            </Box>
            <Box pt={2} borderTopWidth="1px" borderColor="gray.200" _dark={{ borderColor: 'gray.700' }}>
              <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={2}>Authorization Header</Text>
              <Code display="block" p={2} fontSize="xs" bg="white" _dark={{ bg: 'gray.900' }}>
                Authorization: Bearer YOUR_API_KEY
              </Code>
            </Box>
          </VStack>
        </Card.Body>
      </Card.Root>

      <Heading as="h2" size="lg" mt={8} mb={4}>Next steps</Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap="4" mt="8">
        <DocLinkCard
          href="/quickstart"
          title="Quickstart"
          description="Get started with FaceSign"
        />
        <DocLinkCard
          href="/docs/sessions"
          title="Sessions"
          description="Create and manage sessions"
        />
        <DocLinkCard href="/api" title="API Reference" description="Full API documentation" />
      </SimpleGrid>
    </Prose>
    </DocsLayout>
  )
}
