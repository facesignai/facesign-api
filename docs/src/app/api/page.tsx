'use client'

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Code,
  Table,
  Separator,
  Alert,
} from '@chakra-ui/react'
import { ApiReferenceLayout } from '@/components/chakra/ApiReferenceLayout'
import { ApiEndpoint } from '@/components/chakra/ApiEndpoint'
import { ApiCodePanel } from '@/components/chakra/ApiCodePanel'
import sessionsListFixture from '@/examples/sessions_list.json'
import createSessionFixture from '@/examples/create_session.json'
import getSessionFixture from '@/examples/get_session.json'
import { useColorModeValue } from '@/components/ui/color-mode'
import refreshSessionFixture from '@/examples/refresh_session.json'
import langsFixture from '@/examples/langs.json'
import avatarsFixture from '@/examples/avatars.json'
import { OpenApiRenderer } from '@/components/chakra/OpenApiRenderer'

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
        { "id": "start", "type": "start" },
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
        { id: 'start', type: 'start' },
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
      {"id": "start", "type": "start"},
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
}

export default function ApiReferencePage() {
  const codeBg = useColorModeValue('gray.100', 'gray.900')

  return (
    <ApiReferenceLayout codePanel={
      <VStack align="stretch" gap={8}>
        {/* Create Session Code Example */}
        <Box id="create-session-code">
          <ApiCodePanel
            title="Create Session"
            codeExamples={endpointCodeExamples['create-session']}
          />
        </Box>

        {/* Get Session Code Example */}
        <Box id="get-session-code">
          <ApiCodePanel
            title="Get Session"
            codeExamples={endpointCodeExamples['get-session']}
          />
        </Box>

        {/* List Sessions Code Example */}
        <Box id="list-sessions-code">
          <ApiCodePanel
            title="List Sessions"
            codeExamples={endpointCodeExamples['list-sessions']}
          />
        </Box>

        {/* Flows are provided via Session Settings.flow; no standalone code panel needed */}
      </VStack>
    }>
      <VStack align="stretch" gap={12}>
        {/* Page Header */}
        <Box>
          <Heading as="h1" size="2xl" mb={4}>
            API Reference
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Complete reference for the FaceSign REST API
          </Text>
          <HStack mt={4} gap={4}>
            <Badge>REST API</Badge>
            <Badge>OpenAPI 3.0</Badge>
            <Badge>Version 1.0</Badge>
          </HStack>
        </Box>

        <Separator />

        {/* Base URL */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Base URL (Dev)
          </Heading>
          <Box bg={codeBg} p={4} borderRadius="md">
            <Code bg="transparent">https://api.dev.facesign.ai</Code>
          </Box>
        </Box>

        {/* Authentication Section */}
        <Box id="authentication">
          <Heading as="h2" size="lg" mb={4}>
            Authentication
          </Heading>
          <Text mb={4}>
            All API requests require authentication using an API key in the Authorization header.
          </Text>
          <Box bg={codeBg} p={4} borderRadius="md">
            <Code bg="transparent">Authorization: Bearer YOUR_API_KEY</Code>
          </Box>
        </Box>

        {/* Sessions Endpoints */}
        <Box id="sessions">
          <Heading as="h2" size="lg" mb={6}>
            Sessions
          </Heading>

          {/* Create Session */}
          <ApiEndpoint
            id="create-session"
            method="POST"
            path="/sessions"
            description="Create a new verification session"
            parameters={[
              {
                name: "flow_id",
                type: "string",
                required: true,
                description: "The ID of the flow to use for this session",
                example: "flow_abc123"
              },
              {
                name: "user_data",
                type: "object",
                description: "User information to pre-populate in the session",
                example: '{"email": "user@example.com", "name": "John Doe"}'
              },
              {
                name: "metadata",
                type: "object",
                description: "Custom metadata to attach to the session",
                example: '{"customer_id": "cust_123"}'
              },
              {
                name: "webhook_url",
                type: "string",
                description: "URL to receive webhook events for this session",
                example: "https://your-server.com/webhooks"
              },
              {
                name: "language",
                type: "string",
                description: "ISO 639-1 language code for the session",
                example: "en"
              }
            ]}
            responses={{
              "200": {
                description: "Success",
                content: JSON.stringify(createSessionFixture, null, 2)
              }
            }}
          />
          <OpenApiRenderer spec={require('@/public/openapi.json')} path="/sessions" method="post" />

          {/* Get Session */}
          <ApiEndpoint
            id="get-session"
            method="GET"
            path="/sessions/:id"
            description="Retrieve a session by ID"
            parameters={[
              {
                name: "id",
                type: "string",
                required: true,
                description: "The session ID",
                example: "sess_abc123"
              }
            ]}
            responses={{
              "200": {
                description: "Success",
                content: JSON.stringify(getSessionFixture, null, 2)
              }
            }}
          />
          <OpenApiRenderer spec={require('@/public/openapi.json')} path="/sessions/{sessionId}" method="get" />

          {/* List Sessions */}
          <ApiEndpoint
            id="list-sessions"
            method="GET"
            path="/sessions"
            description="List all sessions with optional filters"
            parameters={[
              {
                name: "limit",
                type: "integer",
                description: "Number of sessions to return (1-100)",
                example: "20"
              },
              {
                name: "starting_after",
                type: "string",
                description: "Cursor for pagination",
                example: "sess_abc123"
              },
              {
                name: "status",
                type: "string",
                description: "Filter by session status",
                example: "complete"
              },
              {
                name: "created_after",
                type: "string",
                description: "Filter sessions created after this date (ISO 8601)",
                example: "2024-01-01T00:00:00Z"
              }
            ]}
            responses={{
              "200": {
                description: "Success",
                content: JSON.stringify(sessionsListFixture, null, 2)
              }
            }}
          />
          <OpenApiRenderer spec={require('@/public/openapi.json')} path="/sessions" method="get" />
        </Box>

        {/* Flows (concept only) */}
        <Box id="flows">
          <Heading as="h2" size="lg" mb={6}>
            Flows (via Session Settings)
          </Heading>
          <Text color="gray.600" mb={4}>
            Flows are configured by sending an <Code>FSFlow</Code> object in the
            <Code ml={1}>session.settings.flow</Code> payload when creating a session. There are no
            standalone <Code>/flows</Code> REST endpoints in the current API.
          </Text>
          <Text>
            See the Sessions → Create Session example above for a minimal flow definition.
          </Text>
        </Box>

        {/* Client Secret */}
        <Box id="client-secret">
          <Heading as="h2" size="lg" mb={6}>
            Client Secret
          </Heading>

          <ApiEndpoint
            id="refresh-client-secret"
            method="GET"
            path="/sessions/:id/refresh"
            description="Generate a new client secret for the specified session"
            parameters={[{
              name: 'id',
              type: 'string',
              required: true,
              description: 'The session ID',
              example: 'sess_abc123'
            }]}
            responses={{
              '200': {
                description: 'Success',
                content: JSON.stringify(refreshSessionFixture, null, 2)
              }
            }}
          />
          <OpenApiRenderer spec={require('@/public/openapi.json')} path="/sessions/{sessionId}/refresh" method="get" />
        </Box>

        {/* Languages */}
        <Box id="languages">
          <Heading as="h2" size="lg" mb={6}>
            Languages
          </Heading>

          <ApiEndpoint
            id="get-langs"
            method="GET"
            path="/langs"
            description="Get supported languages"
            parameters={[]}
            responses={{
              '200': {
                description: 'Success',
                content: JSON.stringify(langsFixture, null, 2),
              },
            }}
          />
          <OpenApiRenderer spec={require('@/public/openapi.json')} path="/langs" method="get" />
        </Box>

        {/* Avatars */}
        <Box id="avatars">
          <Heading as="h2" size="lg" mb={6}>
            Avatars
          </Heading>

          <ApiEndpoint
            id="get-avatars"
            method="GET"
            path="/avatars"
            description="Get available avatars"
            parameters={[]}
            responses={{
              '200': {
                description: 'Success',
                content: JSON.stringify(avatarsFixture, null, 2),
              },
            }}
          />
          <OpenApiRenderer spec={require('@/public/openapi.json')} path="/avatars" method="get" />
        </Box>

        {/* Webhooks */}
        <Box id="webhooks">
          <Heading as="h2" size="lg" mb={6}>
            Webhooks
          </Heading>

          <Alert.Root status="info" mb={6}>
            <Alert.Indicator />
            <Alert.Title>
              Dev webhooks are POST JSON without a signature header. Verify by fetching the session using sessionId from the event.
            </Alert.Title>
          </Alert.Root>

          <Heading as="h3" size="md" mb={4}>
            Event Types
          </Heading>

          <Table.Root variant="line" mb={6}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Event</Table.ColumnHeader>
                <Table.ColumnHeader>Description</Table.ColumnHeader>
                <Table.ColumnHeader>Payload</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
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
                <Table.Cell>Session expired without completion</Table.Cell>
                <Table.Cell><Code fontSize="xs">Session object</Code></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>

          <Heading as="h3" size="md" mb={4}>
            Verifying events (Dev)
          </Heading>

          <Text mb={4}>
            In Dev, verify authenticity by fetching the session using the sessionId present in the event payload and
            cross-checking your expected metadata.
          </Text>
        </Box>

        {/* Error Responses */}
        <Box id="errors">
          <Heading as="h2" size="lg" mb={6}>
            Error Responses
          </Heading>

          <Text mb={4}>
            The API uses standard HTTP status codes and returns detailed error information in the response body.
          </Text>

          <Heading as="h3" size="md" mb={4}>
            Error Response Format
          </Heading>

          <Box bg={codeBg} p={4} borderRadius="md" mb={6}>
            <Code bg="transparent" display="block" whiteSpace="pre">{`{
  "error": {
    "type": "invalid_request_error",
    "message": "The flow_id field is required",
    "code": "missing_required_field",
    "field": "flow_id"
  }
}`}</Code>
          </Box>

          <Heading as="h3" size="md" mb={4}>
            Common Error Codes
          </Heading>

          <Table.Root variant="line">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Error Type</Table.ColumnHeader>
                <Table.ColumnHeader>Description</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell><Badge colorScheme="yellow">400</Badge></Table.Cell>
                <Table.Cell><Code fontSize="sm">invalid_request_error</Code></Table.Cell>
                <Table.Cell>Invalid parameters or missing required fields</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><Badge colorScheme="red">401</Badge></Table.Cell>
                <Table.Cell><Code fontSize="sm">authentication_error</Code></Table.Cell>
                <Table.Cell>Invalid or missing API key</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><Badge colorScheme="red">403</Badge></Table.Cell>
                <Table.Cell><Code fontSize="sm">permission_error</Code></Table.Cell>
                <Table.Cell>API key lacks required permissions</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><Badge colorScheme="red">404</Badge></Table.Cell>
                <Table.Cell><Code fontSize="sm">resource_not_found</Code></Table.Cell>
                <Table.Cell>Requested resource doesn&apos;t exist</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><Badge colorScheme="orange">429</Badge></Table.Cell>
                <Table.Cell><Code fontSize="sm">rate_limit_error</Code></Table.Cell>
                <Table.Cell>Too many requests</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><Badge colorScheme="red">500</Badge></Table.Cell>
                <Table.Cell><Code fontSize="sm">api_error</Code></Table.Cell>
                <Table.Cell>Internal server error</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Box>

        {/* Rate Limits */}
        <Box id="rate-limits">
          <Heading as="h2" size="lg" mb={6}>
            Rate Limits
          </Heading>

          <Text mb={4}>
            The API enforces rate limits to ensure fair usage and system stability.
          </Text>

          <Table.Root variant="line" mb={6}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Endpoint</Table.ColumnHeader>
                <Table.ColumnHeader>Limit</Table.ColumnHeader>
                <Table.ColumnHeader>Window</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Create Session</Table.Cell>
                <Table.Cell>100</Table.Cell>
                <Table.Cell>1 minute</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Get Session</Table.Cell>
                <Table.Cell>1000</Table.Cell>
                <Table.Cell>1 minute</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>List Sessions</Table.Cell>
                <Table.Cell>100</Table.Cell>
                <Table.Cell>1 minute</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>All other endpoints</Table.Cell>
                <Table.Cell>500</Table.Cell>
                <Table.Cell>1 minute</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>

          <Alert.Root status="info">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>
                Rate limit information is included in response headers:
              </Alert.Title>
              <Alert.Description>
                <Code>X-RateLimit-Limit</Code>,
                <Code ml={2}>X-RateLimit-Remaining</Code>,
                <Code ml={2}>X-RateLimit-Reset</Code>
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        </Box>

      </VStack>
    </ApiReferenceLayout>
  )
}