'use client'

import {
  Accordion,
  Alert,
  Badge,
  Blockquote,
  Box,
  Card,
  Code,
  CodeBlock,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Separator,
  Span,
  Stack,
  Table,
  Text,
  VStack,
} from '@chakra-ui/react'
import { ApiReferenceLayout } from '@/components/chakra/ApiReferenceLayout'
import { ApiEndpointSplitView } from '@/components/chakra/ApiEndpointSplitView'
import { EndpointsCard } from '@/components/chakra/EndpointsCard'
import { ReferenceTable } from '@/components/chakra/ReferenceTable'
import sessionsListFixture from '@/examples/sessions_list.json'
import createSessionFixture from '@/examples/create_session.json'
import getSessionFixture from '@/examples/get_session.json'
import createSession400 from '@/examples/create_session_400.json'
import getSession404 from '@/examples/get_session_404.json'
import refreshSessionFixture from '@/examples/refresh_session.json'
import refreshSession404 from '@/examples/refresh_session_404.json'
import langsFixture from '@/examples/langs.json'
import avatarsFixture from '@/examples/avatars.json'
import openapiSpec from '@/data/openapi.json'
import { shikiAdapter } from '@/lib/shiki-adapter'
import simpleFlow from '@/examples/flows/simple.json'
import emailFlow from '@/examples/flows/email_collection.json'
import documentFlow from '@/examples/flows/document_verification.json'

/**
 * DESIGN GUIDELINES FOR API DOCUMENTATION
 *
 * This page follows a consistent Stripe-style split-column layout pattern:
 *
 * 1. DARK CODE BLOCKS (bg: gray.900) - "Copy This Code"
 *    - Use for executable code snippets users will copy/paste
 *    - Examples: Request code (cURL, JavaScript, Python), Response JSON, Auth headers
 *    - Component: CodeBlock.Root with dark background and syntax highlighting
 *
 * 2. LIGHT GRAY CONTAINERS (bg: gray.50) - "Reference This Info"
 *    - Use for structured reference data users will read/scan
 *    - Examples: Endpoint listings, Error code tables, Event type tables
 *    - Component: ReferenceTable or Card.Root with gray.50 background
 *
 * 3. WHITE BACKGROUND - "Read This Explanation"
 *    - Use for prose descriptions, conceptual explanations, guides
 *    - Examples: Section descriptions, usage notes, best practices
 *
 * LAYOUT PATTERN:
 * All sections use Grid with 45/55 split (minmax(400px, 45%) / minmax(400px, 55%)):
 * - Left column: Descriptions + Reference information (tables, lists)
 * - Right column: Code examples with syntax highlighting
 */

// Define code examples for each endpoint (Dev by default)
const endpointCodeExamples = {
  'create-session': {
    curl: `curl -X POST https://api.dev.facesign.ai/sessions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "clientReferenceId": "user-123",
    "metadata": { "source": "web-app" },
    "flow": {
      "nodes": [
        { "id": "start", "type": "start", "outcome": "greeting" },
        { "id": "greeting", "type": "conversation", "prompt": "Hello! What's your name?", "transitions": [{ "id": "t1", "condition": "true" }] },
        { "id": "end", "type": "end" }
      ],
      "edges": [
        { "id": "e1", "source": "start", "target": "greeting" },
        { "id": "e2", "source": "greeting", "target": "end" }
      ]
    }
  }'`,
    javascript: `const res = await fetch('https://api.dev.facesign.ai/sessions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    clientReferenceId: 'user-123',
    metadata: { source: 'web-app' },
    flow: {
      nodes: [
        { id: 'start', type: 'start', outcome: 'greeting' },
        { id: 'greeting', type: 'conversation', prompt: "Hello! What's your name?", transitions: [{ id: 't1', condition: 'true' }] },
        { id: 'end', type: 'end' }
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'greeting' },
        { id: 'e2', source: 'greeting', target: 'end' }
      ]
    }
  })
})
const data = await res.json()
console.log(data.session.id, data.clientSecret.url)`,
    python: `import requests
payload = {
  "clientReferenceId": "user-123",
  "metadata": {"source": "web-app"},
  "flow": {
    "nodes": [
      {"id": "start", "type": "start", "outcome": "greeting"},
      {"id": "greeting", "type": "conversation", "prompt": "Hello! What's your name?", "transitions": [{"id": "t1", "condition": "true"}]},
      {"id": "end", "type": "end"}
    ],
    "edges": [
      {"id": "e1", "source": "start", "target": "greeting"},
      {"id": "e2", "source": "greeting", "target": "end"}
    ]
  }
}
r = requests.post('https://api.dev.facesign.ai/sessions', json=payload, headers={'Authorization': 'Bearer YOUR_API_KEY'})
print(r.json()['session']['id'])`
  },
  'get-session': {
    curl: `curl https://api.dev.facesign.ai/sessions/sess_abc123 \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    javascript: `const res = await fetch('https://api.dev.facesign.ai/sessions/sess_abc123', { headers: { Authorization: 'Bearer YOUR_API_KEY' }})
const data = await res.json()
console.log(data.session.status)`,
    python: `import requests
r = requests.get('https://api.dev.facesign.ai/sessions/sess_abc123', headers={'Authorization': 'Bearer YOUR_API_KEY'})
print(r.json()['session']['status'])`
  },
  'list-sessions': {
    curl: `curl "https://api.dev.facesign.ai/sessions?limit=20&status=complete" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    javascript: `const res = await fetch('https://api.dev.facesign.ai/sessions?limit=20&status=complete', { headers: { Authorization: 'Bearer YOUR_API_KEY' }})
const data = await res.json()
console.log(data.sessions.length, data.hasMore)`,
    python: `import requests
r = requests.get('https://api.dev.facesign.ai/sessions', params={'limit':20,'status':'complete'}, headers={'Authorization':'Bearer YOUR_API_KEY'})
data = r.json()
print(len(data['sessions']), data.get('hasMore'))`
  },
  'refresh-session': {
    curl: `curl https://api.dev.facesign.ai/sessions/sess_abc123/refresh \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    javascript: `const res = await fetch('https://api.dev.facesign.ai/sessions/sess_abc123/refresh', { headers: { Authorization: 'Bearer YOUR_API_KEY' }})\nconst data = await res.json()\nconsole.log(data.clientSecret.url)`,
    python: `import requests\nr = requests.get('https://api.dev.facesign.ai/sessions/sess_abc123/refresh', headers={'Authorization': 'Bearer YOUR_API_KEY'})\nprint(r.json()['clientSecret']['url'])`
  },
  'get-langs': {
    curl: `curl https://api.dev.facesign.ai/langs \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    javascript: `const res = await fetch('https://api.dev.facesign.ai/langs', { headers: { Authorization: 'Bearer YOUR_API_KEY' }})\nconsole.log((await res.json()).langs)`,
    python: `import requests\nprint(requests.get('https://api.dev.facesign.ai/langs', headers={'Authorization': 'Bearer YOUR_API_KEY'}).json()['langs'])`
  },
  'get-avatars': {
    curl: `curl https://api.dev.facesign.ai/avatars \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    javascript: `const res = await fetch('https://api.dev.facesign.ai/avatars', { headers: { Authorization: 'Bearer YOUR_API_KEY' }})\nconsole.log((await res.json()).avatars.length)`,
    python: `import requests\nprint(len(requests.get('https://api.dev.facesign.ai/avatars', headers={'Authorization': 'Bearer YOUR_API_KEY'}).json()['avatars']))`
  },
}

export default function ApiReferencePage() {
  return (
    <ApiReferenceLayout>
      <VStack align="stretch" gap={12}>
        {/* Page Header */}
        <Box>
          <Heading as="h1" size="2xl" mb={4}>
            API Reference
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Complete reference for the FaceSign REST API
          </Text>
        </Box>
        <Separator />

        {/* Base URL */}
        <Box id="base-url">
          <Grid
            templateColumns={{ base: '1fr', lg: 'minmax(400px, 45%) minmax(400px, 55%)' }}
            gap={6}
            alignItems="start"
          >
            {/* Left - Description */}
            <Box>
              <Heading as="h2" size="lg" mb={4}>
                Base URL
              </Heading>
              <Text color="gray.600">
                All API requests should be made to the base URL shown on the right. The development environment is used for testing and integration.
              </Text>
            </Box>

            {/* Right - Code */}
            <Box>
              <CodeBlock.AdapterProvider value={shikiAdapter}>
                <CodeBlock.Root code="https://api.dev.facesign.ai" language="text" size="sm" bg="gray.900">
                  <CodeBlock.Header borderBottomWidth="1px" bg="gray.900" color="white" borderColor="gray.700">
                    <CodeBlock.Title>
                      BASE URL
                    </CodeBlock.Title>
                    <CodeBlock.Control>
                      <CodeBlock.CopyTrigger asChild>
                        <IconButton variant="ghost" size="2xs" color="white">
                          <CodeBlock.CopyIndicator />
                        </IconButton>
                      </CodeBlock.CopyTrigger>
                    </CodeBlock.Control>
                  </CodeBlock.Header>
                  <CodeBlock.Content maxH="360px" overflowY="auto" bg="gray.900">
                    <CodeBlock.Code color="white">
                      <CodeBlock.CodeText />
                    </CodeBlock.Code>
                  </CodeBlock.Content>
                </CodeBlock.Root>
              </CodeBlock.AdapterProvider>
            </Box>
          </Grid>
        </Box>

        {/* Authentication Section */}
        <Box id="authentication">
          <Grid
            templateColumns={{ base: '1fr', lg: 'minmax(400px, 45%) minmax(400px, 55%)' }}
            gap={6}
            alignItems="start"
          >
            {/* Left - Description */}
            <Box>
              <Heading as="h2" size="lg" mb={4}>
                Authentication
              </Heading>
              <Text color="gray.600" mb={4}>
                All API requests require authentication using an API key in the Authorization header.
              </Text>
              <Text color="gray.600">
                You can manage your API keys in the FaceSign dashboard. Keep your API keys secure and never share them publicly.
              </Text>
            </Box>

            {/* Right - Code */}
            <Box>
              <CodeBlock.AdapterProvider value={shikiAdapter}>
                <CodeBlock.Root
                  code="Authorization: Bearer YOUR_API_KEY"
                  language="text"
                  size="sm"
                  bg="gray.900"
                >
                  <CodeBlock.Header
                    borderBottomWidth="1px"
                    bg="gray.900"
                    color="white"
                    borderColor="gray.700"
                  >
                    <HStack flex="1">
                      <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">
                        YOUR API KEY
                      </Text>
                    </HStack>
                    <CodeBlock.Control>
                      <CodeBlock.CopyTrigger asChild>
                        <IconButton variant="ghost" size="2xs" color="white">
                          <CodeBlock.CopyIndicator />
                        </IconButton>
                      </CodeBlock.CopyTrigger>
                    </CodeBlock.Control>
                  </CodeBlock.Header>
                  <CodeBlock.Content maxH="360px" overflowY="auto" bg="gray.900">
                    <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                      <CodeBlock.CodeText />
                    </CodeBlock.Code>
                  </CodeBlock.Content>
                </CodeBlock.Root>
              </CodeBlock.AdapterProvider>
            </Box>
          </Grid>
        </Box>

        {/* Rate Limits */}
        <Box id="rate-limits">
          <Heading as="h2" size="lg" mb={6}>
            Rate Limits
          </Heading>

          <Grid
            templateColumns={{ base: '1fr', lg: 'minmax(400px, 45%) minmax(400px, 55%)' }}
            gap={8}
          >
            {/* Left - Description */}
            <Box>
              <Text>
                The API enforces rate limits to ensure fair usage and system stability.
              </Text>
            </Box>

            {/* Right - Rate Limits Accordion */}
            <Box borderWidth="1px" rounded="l2">
              <Flex
                bg="bg.subtle"
                borderBottomWidth="1px"
                px="4"
                py="3"
                fontWeight="medium"
                flex="1"
                textStyle="sm"
                roundedTop="l2"
              >
                <Span flex="1">Endpoint</Span>
                <Span w="20ch">Limit</Span>
                <Span w="20ch">Window</Span>
              </Flex>

              <Accordion.Root multiple>
                <Accordion.Item value="create" _last={{ borderBottomWidth: '0' }}>
                  <Accordion.ItemTrigger colorPalette="gray" px="4" rounded="none">
                    <Flex flex="1" align="center">
                      <Box textStyle="xs">Create Session</Box>
                    </Flex>
                    <Flex align="center" gap="8">
                      <Span w="20ch" textStyle="xs" fontFamily="mono">100</Span>
                      <Span w="20ch" textStyle="xs" fontFamily="mono">1 minute</Span>
                      <Accordion.ItemIndicator />
                    </Flex>
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent rounded="none">
                    <Accordion.ItemBody py="0" bg="bg.subtle">
                      <Box bg="bg.subtle" p="4" borderTopWidth="1px" w="full">
                        <Stack gap="3" textStyle="sm">
                          <Flex gap="2">
                            <Span flex="1" textStyle="sm">Description</Span>
                            <Text flex="1" color="fg.muted">Max requests to create sessions.</Text>
                          </Flex>
                        </Stack>
                      </Box>
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>

                <Accordion.Item value="get" _last={{ borderBottomWidth: '0' }}>
                  <Accordion.ItemTrigger colorPalette="gray" px="4" rounded="none">
                    <Flex flex="1" align="center">
                      <Box textStyle="xs">Get Session</Box>
                    </Flex>
                    <Flex align="center" gap="8">
                      <Span w="20ch" textStyle="xs" fontFamily="mono">1000</Span>
                      <Span w="20ch" textStyle="xs" fontFamily="mono">1 minute</Span>
                      <Accordion.ItemIndicator />
                    </Flex>
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent rounded="none">
                    <Accordion.ItemBody py="0" bg="bg.subtle">
                      <Box bg="bg.subtle" p="4" borderTopWidth="1px" w="full">
                        <Stack gap="3" textStyle="sm">
                          <Flex gap="2">
                            <Span flex="1" textStyle="sm">Description</Span>
                            <Text flex="1" color="fg.muted">Max requests to retrieve session by ID.</Text>
                          </Flex>
                        </Stack>
                      </Box>
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>

                <Accordion.Item value="list" _last={{ borderBottomWidth: '0' }}>
                  <Accordion.ItemTrigger colorPalette="gray" px="4" rounded="none">
                    <Flex flex="1" align="center">
                      <Box textStyle="xs">List Sessions</Box>
                    </Flex>
                    <Flex align="center" gap="8">
                      <Span w="20ch" textStyle="xs" fontFamily="mono">100</Span>
                      <Span w="20ch" textStyle="xs" fontFamily="mono">1 minute</Span>
                      <Accordion.ItemIndicator />
                    </Flex>
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent rounded="none">
                    <Accordion.ItemBody py="0" bg="bg.subtle">
                      <Box bg="bg.subtle" p="4" borderTopWidth="1px" w="full">
                        <Stack gap="3" textStyle="sm">
                          <Flex gap="2">
                            <Span flex="1" textStyle="sm">Description</Span>
                            <Text flex="1" color="fg.muted">Max requests to list sessions.</Text>
                          </Flex>
                        </Stack>
                      </Box>
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>

                <Accordion.Item value="other" _last={{ borderBottomWidth: '0' }}>
                  <Accordion.ItemTrigger colorPalette="gray" px="4" rounded="none">
                    <Flex flex="1" align="center">
                      <Box textStyle="xs">All other endpoints</Box>
                    </Flex>
                    <Flex align="center" gap="8">
                      <Span w="20ch" textStyle="xs" fontFamily="mono">500</Span>
                      <Span w="20ch" textStyle="xs" fontFamily="mono">1 minute</Span>
                      <Accordion.ItemIndicator />
                    </Flex>
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent rounded="none">
                    <Accordion.ItemBody py="0" bg="bg.subtle">
                      <Box bg="bg.subtle" p="4" borderTopWidth="1px" w="full">
                        <Stack gap="3" textStyle="sm">
                          <Flex gap="2">
                            <Span flex="1" textStyle="sm">Description</Span>
                            <Text flex="1" color="fg.muted">General per-minute limit.</Text>
                          </Flex>
                        </Stack>
                      </Box>
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              </Accordion.Root>
            </Box>

            <Blockquote.Root variant="subtle" colorPalette="gray">
              <Blockquote.Content>
                Rate limit information is included in response headers: <Code>X-RateLimit-Limit</Code>,
                <Code ml={2}>X-RateLimit-Remaining</Code>, <Code ml={2}>X-RateLimit-Reset</Code>
              </Blockquote.Content>
            </Blockquote.Root>
          </Grid>
        </Box>

        {/* Error Responses */}
        <Box id="errors">
          <Heading as="h2" size="lg" mb={6}>
            Error Responses
          </Heading>

          <Grid
            templateColumns={{ base: '1fr', lg: 'minmax(400px, 45%) minmax(400px, 55%)' }}
            gap={6}
            alignItems="start"
            mb={12}
          >
            {/* Left - Description and Error Codes Table */}
            <Box>
              <Text mb={6}>
                The API uses standard HTTP status codes and returns detailed error information in the response body.
              </Text>

              <Heading as="h3" size="md" mb={4}>
                Common Error Codes
              </Heading>

              <ReferenceTable headers={['Status', 'Error Type', 'Description']}>
                <Table.Row>
                  <Table.Cell><Badge colorScheme="yellow">400</Badge></Table.Cell>
                  <Table.Cell><Code fontSize="sm">validation_error</Code></Table.Cell>
                  <Table.Cell>Invalid parameters or missing required fields</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Badge colorScheme="red">401</Badge></Table.Cell>
                  <Table.Cell><Code fontSize="sm">authentication_error</Code></Table.Cell>
                  <Table.Cell>Invalid or missing API key</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Badge colorScheme="red">404</Badge></Table.Cell>
                  <Table.Cell><Code fontSize="sm">not_found_error</Code></Table.Cell>
                  <Table.Cell>Requested resource doesn&apos;t exist</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Badge colorScheme="orange">429</Badge></Table.Cell>
                  <Table.Cell><Code fontSize="sm">rate_limit_error</Code></Table.Cell>
                  <Table.Cell>Too many requests</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Badge colorScheme="red">500</Badge></Table.Cell>
                  <Table.Cell><Code fontSize="sm">server_error</Code></Table.Cell>
                  <Table.Cell>Internal server error</Table.Cell>
                </Table.Row>
              </ReferenceTable>
            </Box>

            {/* Right - Error Response Format (standardized code block) */}
            <Box>
              <Heading as="h3" size="md" mb={4}>
                Error Response Format
              </Heading>
              <CodeBlock.AdapterProvider value={shikiAdapter}>
                <CodeBlock.Root code={JSON.stringify({
                  error: {
                    type: 'validation_error',
                    message: 'The flow field is required',
                    code: 'missing_required_field'
                  }
                }, null, 2)} language="json" size="sm" bg="gray.50">
                  <CodeBlock.Header borderBottomWidth="1px" bg="gray.100" borderColor="gray.200">
                    <CodeBlock.Title>Error Response</CodeBlock.Title>
                    <CodeBlock.Control>
                      <CodeBlock.CopyTrigger asChild>
                        <IconButton variant="ghost" size="2xs">
                          <CodeBlock.CopyIndicator />
                        </IconButton>
                      </CodeBlock.CopyTrigger>
                    </CodeBlock.Control>
                  </CodeBlock.Header>
                  <CodeBlock.Content maxH="360px" overflowY="auto" bg="gray.50">
                    <CodeBlock.Code fontSize="xs" overflowX="auto" color="gray.800">
                      <CodeBlock.CodeText />
                    </CodeBlock.Code>
                  </CodeBlock.Content>
                </CodeBlock.Root>
              </CodeBlock.AdapterProvider>
            </Box>
          </Grid>
        </Box>

        {/* Flows Section */}
        <Box id="flows">
          <Heading as="h2" size="lg" mb={6}>
            Flows
          </Heading>

          {/* Flows Overview */}
          <Grid
            templateColumns={{ base: '1fr', lg: 'minmax(400px, 45%) minmax(400px, 55%)' }}
            gap={6}
            alignItems="start"
            mb={12}
          >
            {/* Left - Description */}
            <Box>
              <Text color="gray.600" mb={4}>
                Flows define the verification steps users go through. A flow is a graph of <strong>nodes</strong> (verification steps) connected by <strong>edges</strong> (transitions).
              </Text>
              <Text color="gray.600" mb={4}>
                Each flow must have exactly one <Code>start</Code> node and at least one <Code>end</Code> node. Nodes execute in sequence based on edge connections and outcome conditions.
              </Text>
              <Text color="gray.600">
                Flows are reusable - create one flow definition and use it across thousands of sessions.
              </Text>
            </Box>

            {/* Right - Simple Flow Example */}
            <Box>
              <CodeBlock.AdapterProvider value={shikiAdapter}>
                <CodeBlock.Root
                  code={JSON.stringify(simpleFlow, null, 2)}
                  language="json"
                  size="md"
                  bg="gray.900"
                >
                  <CodeBlock.Header borderBottomWidth="1px" bg="gray.900" color="white" borderColor="gray.700">
                    <CodeBlock.Title>
                      MINIMAL FLOW
                    </CodeBlock.Title>
                    <CodeBlock.Control>
                      <CodeBlock.CopyTrigger asChild>
                        <IconButton variant="ghost" size="2xs" color="white">
                          <CodeBlock.CopyIndicator />
                        </IconButton>
                      </CodeBlock.CopyTrigger>
                    </CodeBlock.Control>
                  </CodeBlock.Header>
                  <CodeBlock.Content maxH="500px" overflowY="auto" bg="gray.900">
                    <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                      <CodeBlock.CodeText />
                    </CodeBlock.Code>
                  </CodeBlock.Content>
                </CodeBlock.Root>
              </CodeBlock.AdapterProvider>
            </Box>
          </Grid>

          {/* Node Types Table */}
          <Grid
            templateColumns={{ base: '1fr', lg: 'minmax(400px, 45%) minmax(400px, 55%)' }}
            gap={6}
            alignItems="start"
            mb={12}
          >
            {/* Left - Node Types Reference */}
            <Box>
              <Heading as="h3" size="md" mb={4}>
                Available Node Types
              </Heading>
              <Card.Root bg="gray.50" borderColor="gray.200" mb={4}>
                <Card.Body p={4}>
                  <Table.Root variant="line" size="sm">
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell fontWeight="semibold" fontSize="xs"><Code>start</Code></Table.Cell>
                        <Table.Cell fontSize="xs" color="gray.700">Flow entry point (required, one per flow)</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell fontWeight="semibold" fontSize="xs"><Code>end</Code></Table.Cell>
                        <Table.Cell fontSize="xs" color="gray.700">Flow exit point (required, one or more)</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell fontWeight="semibold" fontSize="xs"><Code>conversation</Code></Table.Cell>
                        <Table.Cell fontSize="xs" color="gray.700">AI-powered conversational interaction</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell fontWeight="semibold" fontSize="xs"><Code>liveness_detection</Code></Table.Cell>
                        <Table.Cell fontSize="xs" color="gray.700">Deepfake detection and liveness check</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell fontWeight="semibold" fontSize="xs"><Code>document_scan</Code></Table.Cell>
                        <Table.Cell fontSize="xs" color="gray.700">ID document scanning (passport, driver&apos;s license)</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell fontWeight="semibold" fontSize="xs"><Code>recognition</Code></Table.Cell>
                        <Table.Cell fontSize="xs" color="gray.700">1:N face recognition from collection</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell fontWeight="semibold" fontSize="xs"><Code>face_scan</Code></Table.Cell>
                        <Table.Cell fontSize="xs" color="gray.700">1:1 face matching or capture</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell fontWeight="semibold" fontSize="xs"><Code>enter_email</Code></Table.Cell>
                        <Table.Cell fontSize="xs" color="gray.700">Email address collection</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell fontWeight="semibold" fontSize="xs"><Code>data_validation</Code></Table.Cell>
                        <Table.Cell fontSize="xs" color="gray.700">Conditional data validation (age, address, etc.)</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell fontWeight="semibold" fontSize="xs"><Code>two_factor</Code></Table.Cell>
                        <Table.Cell fontSize="xs" color="gray.700">SMS or Email OTP verification</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>
                </Card.Body>
              </Card.Root>
              <Text fontSize="sm" color="gray.600">
                Each node type has specific configuration options and outcome enums. See the TypeScript SDK for full type definitions.
              </Text>
            </Box>

            {/* Right - Email Collection Flow Example */}
            <Box>
              <CodeBlock.AdapterProvider value={shikiAdapter}>
                <CodeBlock.Root
                  code={JSON.stringify(emailFlow, null, 2)}
                  language="json"
                  size="sm"
                  bg="gray.900"
                >
                  <CodeBlock.Header borderBottomWidth="1px" bg="gray.900" color="white" borderColor="gray.700">
                    <CodeBlock.Title>
                      EMAIL COLLECTION FLOW
                    </CodeBlock.Title>
                    <CodeBlock.Control>
                      <CodeBlock.CopyTrigger asChild>
                        <IconButton variant="ghost" size="2xs" color="white">
                          <CodeBlock.CopyIndicator />
                        </IconButton>
                      </CodeBlock.CopyTrigger>
                    </CodeBlock.Control>
                  </CodeBlock.Header>
                  <CodeBlock.Content maxH="500px" overflowY="auto" bg="gray.900">
                    <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                      <CodeBlock.CodeText />
                    </CodeBlock.Code>
                  </CodeBlock.Content>
                </CodeBlock.Root>
              </CodeBlock.AdapterProvider>
            </Box>
          </Grid>

          {/* Conditional Branching */}
          <Grid
            templateColumns={{ base: '1fr', lg: 'minmax(400px, 45%) minmax(400px, 55%)' }}
            gap={6}
            alignItems="start"
            mb={12}
          >
            {/* Left - Description */}
            <Box>
              <Heading as="h3" size="md" mb={4}>
                Conditional Branching
              </Heading>
              <Text color="gray.600" mb={4}>
                Nodes can have multiple outcomes, allowing you to create conditional logic. Each node type defines specific outcome values (e.g., <Code>scanSuccess</Code>, <Code>userCancelled</Code> for document_scan).
              </Text>
              <Text color="gray.600" mb={4}>
                Use the <Code>outcomes</Code> object to map each outcome to a target node ID. Edges use the <Code>condition</Code> field to specify which outcome triggers the transition.
              </Text>
              <Card.Root bg="blue.50" borderColor="blue.200" mt={4}>
                <Card.Body p={4}>
                  <HStack gap={2} mb={2}>
                    <Badge colorScheme="blue" size="sm">TIP</Badge>
                    <Text fontSize="sm" fontWeight="semibold" color="blue.900">
                      Outcome-based routing
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="blue.800">
                    The <Code>outcomes</Code> object on each node maps outcome values to the next node ID. This creates a clear branching structure based on verification results.
                  </Text>
                </Card.Body>
              </Card.Root>
            </Box>

            {/* Right - Document Verification Flow Example */}
            <Box>
              <CodeBlock.AdapterProvider value={shikiAdapter}>
                <CodeBlock.Root
                  code={JSON.stringify(documentFlow, null, 2)}
                  language="json"
                  size="sm"
                  bg="gray.900"
                >
                  <CodeBlock.Header borderBottomWidth="1px" bg="gray.900" color="white" borderColor="gray.700">
                    <CodeBlock.Title>
                      CONDITIONAL FLOW
                    </CodeBlock.Title>
                    <CodeBlock.Control>
                      <CodeBlock.CopyTrigger asChild>
                        <IconButton variant="ghost" size="2xs" color="white">
                          <CodeBlock.CopyIndicator />
                        </IconButton>
                      </CodeBlock.CopyTrigger>
                    </CodeBlock.Control>
                  </CodeBlock.Header>
                  <CodeBlock.Content maxH="500px" overflowY="auto" bg="gray.900">
                    <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                      <CodeBlock.CodeText />
                    </CodeBlock.Code>
                  </CodeBlock.Content>
                </CodeBlock.Root>
              </CodeBlock.AdapterProvider>
            </Box>
          </Grid>
        </Box>

        {/* Sessions Endpoints */}
        <Box id="sessions">
          <Heading as="h2" size="lg" mb={6}>
            Sessions
          </Heading>

          {/* Sessions Intro */}
          <Grid
            templateColumns={{ base: '1fr', lg: 'minmax(400px, 45%) minmax(400px, 55%)' }}
            gap={6}
            alignItems="start"
            mb={12}
          >
            {/* Left - Description */}
            <Box>
              <Text color="gray.600" mb={4}>
                Sessions represent individual verification flows. Each session contains a unique URL that you share with end users to begin identity verification. Sessions track progress through your configured flow and collect verification results.
              </Text>
              <Text color="gray.600">
                Learn more in the Sessions guide or see the Session object reference.
              </Text>
            </Box>

            {/* Right - Endpoints Card */}
            <Box>
              <EndpointsCard
                endpoints={[
                  {
                    method: 'POST',
                    path: '/sessions',
                    description: 'Create a new verification session',
                    href: '#create-session',
                  },
                  {
                    method: 'GET',
                    path: '/sessions/:id',
                    description: 'Retrieve a session by ID',
                    href: '#get-session',
                  },
                  {
                    method: 'GET',
                    path: '/sessions',
                    description: 'List all sessions with filters',
                    href: '#list-sessions',
                  },
                ]}
              />
            </Box>
          </Grid>

          {/* Session Status Reference */}
          <Grid
            templateColumns={{ base: '1fr', lg: 'minmax(400px, 45%) minmax(400px, 55%)' }}
            gap={6}
            alignItems="start"
            mb={12}
          >
            {/* Left - Description */}
            <Box>
              <Heading as="h3" size="md" mb={4} id="session-status">
                Session Status Values
              </Heading>
              <Text color="gray.600" mb={4}>
                Every session has a <Code>status</Code> field indicating its current state. Use these values to understand session lifecycle and determine next actions.
              </Text>
            </Box>

            {/* Right - Status Reference Table */}
            <Box>
              <Card.Root bg="gray.50" borderColor="gray.200">
                <Card.Body p={4}>
                  <Table.Root variant="line" size="sm">
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell fontWeight="semibold" fontSize="xs"><Code>requiresInput</Code></Table.Cell>
                        <Table.Cell fontSize="xs" color="gray.700">Session is awaiting user input or action</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell fontWeight="semibold" fontSize="xs"><Code>processing</Code></Table.Cell>
                        <Table.Cell fontSize="xs" color="gray.700">Session is being processed by verification services</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell fontWeight="semibold" fontSize="xs"><Code>complete</Code></Table.Cell>
                        <Table.Cell fontSize="xs" color="gray.700">Session has completed (successfully or with errors)</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell fontWeight="semibold" fontSize="xs"><Code>canceled</Code></Table.Cell>
                        <Table.Cell fontSize="xs" color="gray.700">Session was canceled before completion</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>
                </Card.Body>
              </Card.Root>
              <Text fontSize="sm" color="gray.600" mt={3}>
                Check the <Code>report</Code> object on completed sessions for detailed verification results and outcomes.
              </Text>
            </Box>
          </Grid>

          {/* Create Session */}
          <ApiEndpointSplitView
            id="create-session"
            method="POST"
            path="/sessions"
            description="Create a new verification session"
            parameters={[
              { name: 'flow_id', type: 'string', required: true, description: 'The ID of the flow to use for this session', example: 'flow_abc123' },
              { name: 'user_data', type: 'object', description: 'User information to pre-populate in the session', example: '{"email": "user@example.com", "name": "John Doe"}' },
              { name: 'metadata', type: 'object', description: 'Custom metadata to attach to the session', example: '{"customer_id": "cust_123"}' },
              { name: 'webhook_url', type: 'string', description: 'URL to receive webhook events for this session', example: 'https://your-server.com/webhooks' },
              { name: 'language', type: 'string', description: 'ISO 639-1 language code for the session', example: 'en' }
            ]}
            requestBody={{
              content: `{
  "flow_id": "flow_abc123",
  "user_data": { "email": "user@example.com" },
  "metadata": { "customer_id": "cust_123" }
}`
            }}
            responses={{
              '200': { description: 'Success', content: JSON.stringify(createSessionFixture, null, 2) },
              '400': { description: 'Bad Request', content: JSON.stringify(createSession400, null, 2) }
            }}
            codeExamples={endpointCodeExamples['create-session']}
            spec={openapiSpec}
            specPath="/sessions"
            specMethod="post"
          />

          {/* Get Session */}
          <ApiEndpointSplitView
            id="get-session"
            method="GET"
            path="/sessions/:id"
            description="Retrieve a session by ID"
            parameters={[{ name: 'id', type: 'string', required: true, description: 'The session ID', example: 'sess_abc123' }]}
            responses={{
              '200': { description: 'Success', content: JSON.stringify(getSessionFixture, null, 2) },
              '404': { description: 'Not Found', content: JSON.stringify(getSession404, null, 2) }
            }}
            codeExamples={endpointCodeExamples['get-session']}
            spec={openapiSpec}
            specPath="/sessions/{sessionId}"
            specMethod="get"
          />

          {/* List Sessions */}
          <ApiEndpointSplitView
            id="list-sessions"
            method="GET"
            path="/sessions"
            description="List all sessions with optional filters"
            parameters={[
              { name: 'limit', type: 'integer', description: 'Number of sessions to return (1-100)', example: '20' },
              { name: 'starting_after', type: 'string', description: 'Cursor for pagination', example: 'sess_abc123' },
              { name: 'status', type: 'string', description: 'Filter by session status', example: 'complete' },
              { name: 'created_after', type: 'string', description: 'Filter sessions created after this date (ISO 8601)', example: '2024-01-01T00:00:00Z' }
            ]}
            responses={{ '200': { description: 'Success', content: JSON.stringify(sessionsListFixture, null, 2) } }}
            codeExamples={endpointCodeExamples['list-sessions']}
            spec={openapiSpec}
            specPath="/sessions"
            specMethod="get"
          />
        </Box>

        {/* Client Secret */}
        <Box id="client-secret">
          <Heading as="h2" size="lg" mb={6}>
            Client Secret
          </Heading>

          <ApiEndpointSplitView
            id="refresh-session"
            method="GET"
            path="/sessions/:id/refresh"
            description="Generate a new client secret for the specified session"
            parameters={[{ name: 'id', type: 'string', required: true, description: 'The session ID', example: 'sess_abc123' }]}
            responses={{
              '200': { description: 'Success', content: JSON.stringify(refreshSessionFixture, null, 2) },
              '404': { description: 'Not Found', content: JSON.stringify(refreshSession404, null, 2) }
            }}
            codeExamples={endpointCodeExamples['refresh-session']}
            spec={openapiSpec}
            specPath="/sessions/{sessionId}/refresh"
            specMethod="get"
          />
        </Box>

        {/* Languages */}
        <Box id="languages">
          <Heading as="h2" size="lg" mb={6}>
            Languages
          </Heading>

          <ApiEndpointSplitView
            id="langs"
            method="GET"
            path="/langs"
            description="Get supported languages"
            responses={{ '200': { description: 'Success', content: JSON.stringify(langsFixture, null, 2) } }}
            codeExamples={endpointCodeExamples['get-langs']}
            spec={openapiSpec}
            specPath="/langs"
            specMethod="get"
          />
        </Box>

        {/* Avatars */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            Avatars
          </Heading>

          <ApiEndpointSplitView
            id="avatars"
            method="GET"
            path="/avatars"
            description="Get available avatars"
            responses={{ '200': { description: 'Success', content: JSON.stringify(avatarsFixture, null, 2) } }}
            codeExamples={endpointCodeExamples['get-avatars']}
            spec={openapiSpec}
            specPath="/avatars"
            specMethod="get"
          />
        </Box>

        {/* Webhooks */}
        <Box id="webhooks">
          <Heading as="h2" size="lg" mb={6}>
            Webhooks
          </Heading>

          {/* Webhooks Intro */}
          <Grid
            templateColumns={{ base: '1fr', lg: 'minmax(400px, 45%) minmax(400px, 55%)' }}
            gap={6}
            alignItems="start"
            mb={12}
          >
            {/* Left - Description */}
            <Box>
              <Text color="gray.600" mb={4}>
                FaceSign uses webhooks to notify your application when events occur, such as session completion or failure. Webhooks enable asynchronous workflows and real-time updates to your systems.
              </Text>
              <Text color="gray.600">
                Learn more in the Webhooks guide for best practices on handling webhook events securely and reliably.
              </Text>
            </Box>

            {/* Right - Security Note */}
            <Box>
              <Alert.Root status="info">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Development Environment</Alert.Title>
                  <Alert.Description>
                    Dev webhooks are POST JSON without a signature header. Verify authenticity by fetching the session using the sessionId from the event.
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            </Box>
          </Grid>

          {/* Event Types Section */}
          <Grid
            templateColumns={{ base: '1fr', lg: 'minmax(400px, 45%) minmax(400px, 55%)' }}
            gap={6}
            alignItems="start"
            mb={12}
          >
            {/* Left - Event Types Table */}
            <Box>
              <Heading as="h3" size="md" mb={4} id="webhook-events">
                Event Types
              </Heading>
              <ReferenceTable headers={['Event', 'Description', 'Payload']}>
                <Table.Row>
                  <Table.Cell><Code fontSize="sm">session.created</Code></Table.Cell>
                  <Table.Cell>Session was created</Table.Cell>
                  <Table.Cell><Code fontSize="xs">Session object</Code></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Code fontSize="sm">session.started</Code></Table.Cell>
                  <Table.Cell>User opened the verification URL</Table.Cell>
                  <Table.Cell><Code fontSize="xs">Session object</Code></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Code fontSize="sm">session.completed</Code></Table.Cell>
                  <Table.Cell>Session completed successfully</Table.Cell>
                  <Table.Cell><Code fontSize="xs">Session + result</Code></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Code fontSize="sm">session.failed</Code></Table.Cell>
                  <Table.Cell>Session failed verification</Table.Cell>
                  <Table.Cell><Code fontSize="xs">Session + error</Code></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Code fontSize="sm">session.expired</Code></Table.Cell>
                  <Table.Cell>Session expired before completion</Table.Cell>
                  <Table.Cell><Code fontSize="xs">Session object</Code></Table.Cell>
                </Table.Row>
              </ReferenceTable>
            </Box>

            {/* Right - Webhook Payload Example */}
            <Box>
              <Heading as="h3" size="md" mb={4}>
                Example Payload
              </Heading>
              <CodeBlock.AdapterProvider value={shikiAdapter}>
                <CodeBlock.Root
                  code={`{
  "event": "session.completed",
  "sessionId": "sess_abc123",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "session": {
      "id": "sess_abc123",
      "status": "complete",
      "clientReferenceId": "user-123"
    },
    "result": {
      "verified": true,
      "confidence": 0.98
    }
  }
}`}
                  language="json"
                  size="sm"
                  bg="gray.900"
                >
                  <CodeBlock.Header
                    borderBottomWidth="1px"
                    bg="gray.900"
                    color="white"
                    borderColor="gray.700"
                  >
                    <HStack flex="1">
                      <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">
                        WEBHOOK PAYLOAD
                      </Text>
                    </HStack>
                    <CodeBlock.Control>
                      <CodeBlock.CopyTrigger asChild>
                        <IconButton variant="ghost" size="2xs" color="white">
                          <CodeBlock.CopyIndicator />
                        </IconButton>
                      </CodeBlock.CopyTrigger>
                    </CodeBlock.Control>
                  </CodeBlock.Header>
                  <CodeBlock.Content bg="gray.900" maxH="500px" overflowY="auto">
                    <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                      <CodeBlock.CodeText />
                    </CodeBlock.Code>
                  </CodeBlock.Content>
                </CodeBlock.Root>
              </CodeBlock.AdapterProvider>
            </Box>
          </Grid>

          {/* Handling Webhooks Section */}
          <Grid
            templateColumns={{ base: '1fr', lg: 'minmax(400px, 45%) minmax(400px, 55%)' }}
            gap={6}
            alignItems="start"
            mb={12}
          >
            {/* Left - Best Practices */}
            <Box>
              <Heading as="h3" size="md" mb={4} id="webhook-verification">
                Verifying events (Dev)
              </Heading>
              <Text mb={4}>
                In Dev, verify authenticity by fetching the session using the sessionId from the event and cross-checking expected metadata.
              </Text>

              <Heading as="h3" size="md" mb={4} id="webhook-handling">
                Handling webhooks
              </Heading>
              <Text mb={4}>Respond quickly, process asynchronously, and handle duplicates using event IDs.</Text>

              <Heading as="h3" size="md" mb={4} id="webhook-security">
                Security
              </Heading>
              <Text>Dev includes standard headers. IP allowlisting is recommended in production.</Text>
            </Box>

            {/* Right - Handler Example */}
            <Box>
              <Heading as="h3" size="md" mb={4}>
                Handler Example
              </Heading>
              <CodeBlock.AdapterProvider value={shikiAdapter}>
                <CodeBlock.Root
                  code={`app.post('/webhooks', async (req, res) => {
  const { event, sessionId, data } = req.body

  // Respond quickly
  res.sendStatus(200)

  // Process asynchronously
  await processWebhook({ event, sessionId, data })
})

async function processWebhook(webhook) {
  // Verify session exists
  const session = await fetchSession(webhook.sessionId)

  // Handle event
  switch (webhook.event) {
    case 'session.completed':
      await handleCompletion(session, webhook.data)
      break
    case 'session.failed':
      await handleFailure(session, webhook.data)
      break
  }
}`}
                  language="javascript"
                  size="sm"
                  bg="gray.900"
                >
                  <CodeBlock.Header
                    borderBottomWidth="1px"
                    bg="gray.900"
                    color="white"
                    borderColor="gray.700"
                  >
                    <HStack flex="1">
                      <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">
                        NODE.JS / EXPRESS
                      </Text>
                    </HStack>
                    <CodeBlock.Control>
                      <CodeBlock.CopyTrigger asChild>
                        <IconButton variant="ghost" size="2xs" color="white">
                          <CodeBlock.CopyIndicator />
                        </IconButton>
                      </CodeBlock.CopyTrigger>
                    </CodeBlock.Control>
                  </CodeBlock.Header>
                  <CodeBlock.Content bg="gray.900" maxH="500px" overflowY="auto">
                    <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                      <CodeBlock.CodeText />
                    </CodeBlock.Code>
                  </CodeBlock.Content>
                </CodeBlock.Root>
              </CodeBlock.AdapterProvider>
            </Box>
          </Grid>

        </Box>

      </VStack>
    </ApiReferenceLayout>
  )
}