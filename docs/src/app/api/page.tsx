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
import { CodeBlock } from '@/components/chakra/CodeBlock'
import { useColorModeValue } from '@/components/ui/color-mode'

// Define code examples for each endpoint
const endpointCodeExamples = {
  'create-session': {
    curl: `curl -X POST https://api.facesign.ai/v1/sessions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "flow_id": "flow_abc123",
    "user_data": {
      "email": "user@example.com",
      "name": "John Doe"
    }
  }'`,
    javascript: `const session = await client.sessions.create({
  flow_id: "flow_abc123",
  user_data: {
    email: "user@example.com",
    name: "John Doe"
  }
});

console.log("Session URL:", session.url);
console.log("Session ID:", session.id);`,
    python: `session = client.sessions.create(
    flow_id="flow_abc123",
    user_data={
        "email": "user@example.com",
        "name": "John Doe"
    }
)

print(f"Session URL: {session.url}")
print(f"Session ID: {session.id}")`
  },
  'get-session': {
    curl: `curl https://api.facesign.ai/v1/sessions/sess_abc123 \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    javascript: `const session = await client.sessions.get("sess_abc123");

console.log("Status:", session.status);
console.log("Result:", session.result);`,
    python: `session = client.sessions.get("sess_abc123")

print(f"Status: {session.status}")
print(f"Result: {session.result}")`
  },
  'list-sessions': {
    curl: `curl "https://api.facesign.ai/v1/sessions?limit=20&status=complete" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    javascript: `const sessions = await client.sessions.list({
  limit: 20,
  status: "complete"
});

sessions.data.forEach(session => {
  console.log(session.id, session.status);
});`,
    python: `sessions = client.sessions.list(
    limit=20,
    status="complete"
)

for session in sessions.data:
    print(f"{session.id}: {session.status}")`
  },
  'list-flows': {
    curl: `curl https://api.facesign.ai/v1/flows \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    javascript: `const flows = await client.flows.list();

flows.data.forEach(flow => {
  console.log(flow.name, flow.description);
});`,
    python: `flows = client.flows.list()

for flow in flows.data:
    print(f"{flow.name}: {flow.description}")`
  },
  'get-flow': {
    curl: `curl https://api.facesign.ai/v1/flows/flow_abc123 \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    javascript: `const flow = await client.flows.get("flow_abc123");

console.log("Flow name:", flow.name);
console.log("Nodes:", flow.nodes.length);`,
    python: `flow = client.flows.get("flow_abc123")

print(f"Flow name: {flow.name}")
print(f"Nodes: {len(flow.nodes)}")`
  }
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

        {/* List Flows Code Example */}
        <Box id="list-flows-code">
          <ApiCodePanel
            title="List Flows"
            codeExamples={endpointCodeExamples['list-flows']}
          />
        </Box>

        {/* Get Flow Code Example */}
        <Box id="get-flow-code">
          <ApiCodePanel
            title="Get Flow"
            codeExamples={endpointCodeExamples['get-flow']}
          />
        </Box>
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
            Base URL
          </Heading>
          <Box bg={codeBg} p={4} borderRadius="md">
            <Code bg="transparent">https://api.facesign.ai/v1</Code>
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
                content: `{
  "id": "sess_abc123",
  "url": "https://verify.facesign.ai/s/sess_abc123",
  "status": "created",
  "flow_id": "flow_abc123",
  "created_at": "2024-01-15T10:30:00Z",
  "expires_at": "2024-01-15T11:30:00Z"
}`
              }
            }}
          />

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
                content: `{
  "id": "sess_abc123",
  "url": "https://verify.facesign.ai/s/sess_abc123",
  "status": "complete",
  "flow_id": "flow_abc123",
  "result": {
    "verified": true,
    "confidence": 0.98,
    "checks": {
      "document": "passed",
      "biometric": "passed",
      "liveness": "passed"
    }
  },
  "created_at": "2024-01-15T10:30:00Z",
  "completed_at": "2024-01-15T10:35:00Z"
}`
              }
            }}
          />

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
                content: `{
  "data": [
    {
      "id": "sess_abc123",
      "status": "complete",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "sess_def456",
      "status": "inprogress",
      "created_at": "2024-01-15T10:25:00Z"
    }
  ],
  "has_more": true,
  "total_count": 150
}`
              }
            }}
          />
        </Box>

        {/* Flows Endpoints */}
        <Box id="flows">
          <Heading as="h2" size="lg" mb={6}>
            Flows
          </Heading>

          {/* List Flows */}
          <ApiEndpoint
            id="list-flows"
            method="GET"
            path="/flows"
            description="List all available verification flows"
            responses={{
              "200": {
                description: "Success",
                content: `{
  "data": [
    {
      "id": "flow_abc123",
      "name": "Standard KYC",
      "description": "Document + Biometric verification",
      "nodes": 5,
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "flow_def456",
      "name": "Quick Verification",
      "description": "Email + SMS verification only",
      "nodes": 3,
      "created_at": "2024-01-02T00:00:00Z"
    }
  ]
}`
              }
            }}
          />

          {/* Get Flow */}
          <ApiEndpoint
            id="get-flow"
            method="GET"
            path="/flows/:id"
            description="Get detailed information about a specific flow"
            parameters={[
              {
                name: "id",
                type: "string",
                required: true,
                description: "The flow ID",
                example: "flow_abc123"
              }
            ]}
            responses={{
              "200": {
                description: "Success",
                content: `{
  "id": "flow_abc123",
  "name": "Standard KYC",
  "description": "Complete identity verification flow",
  "nodes": [
    {
      "id": "node_1",
      "type": "conversation",
      "config": {...}
    },
    {
      "id": "node_2",
      "type": "document_scan",
      "config": {...}
    }
  ],
  "edges": [
    {
      "from": "node_1",
      "to": "node_2",
      "condition": "success"
    }
  ]
}`
              }
            }}
          />
        </Box>

        {/* Webhooks */}
        <Box id="webhooks">
          <Heading as="h2" size="lg" mb={6}>
            Webhooks
          </Heading>

          <Alert.Root status="info" mb={6}>
            <Alert.Indicator />
            <Alert.Title>
              Webhooks are sent as POST requests with a JSON payload and include a signature header for verification.
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
            Webhook Signature Verification
          </Heading>

          <Text mb={4}>
            All webhook requests include a signature in the <Code>X-FaceSign-Signature</Code> header.
            Verify this signature to ensure the webhook is from FaceSign.
          </Text>

          <Box
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            borderColor="gray.200"
            _dark={{
              borderColor: 'gray.700'
            }}
            mb={6}
          >
            <CodeBlock
              code={`import crypto from 'crypto';

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from('sha256=' + expectedSignature)
  );
}`}
              language="javascript"
            />
          </Box>
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