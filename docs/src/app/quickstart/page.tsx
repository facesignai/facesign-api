import {
  Badge,
  Box,
  Heading,
  HStack,
  Span,
  Text,
  VStack,
  Code,
  Link,
  Separator,
  Blockquote,
  SimpleGrid
} from '@chakra-ui/react'
import { DocsLayout } from '@/components/chakra/DocsLayout'
import { Prose } from '@/components/chakra/Prose'
import { DocsCodeBlock } from '@/components/chakra/DocsCodeBlock'
import { SimpleCodeBlock } from '@/components/chakra/SimpleCodeBlock'
import { DocLinkCard } from '@/components/chakra/DocLinkCard'

export const metadata = {
  title: 'Quick Start',
  description: 'Get up and running with the FaceSign API in under 5 minutes.',
}

export default function QuickstartPage() {
  return (
    <DocsLayout variant="docs">
      <Prose>
        <VStack align="stretch" gap={8}>
        {/* Header */}
        <Box>
          <Heading as="h1" size="2xl" mb={4}>
            Quick Start
          </Heading>
          <Text fontSize="xl" color="gray.600">
            This quickstart shows a minimal 3-step Dev flow to get a hosted verification session running.
          </Text>
        </Box>

        <Blockquote.Root variant="subtle" my={6}>
          <Blockquote.Content>
            Keep your API keys server-side and use environment variables.
          </Blockquote.Content>
        </Blockquote.Root>

        <Separator />

        {/* Step 1 */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Step 1 — Install and set your API key
          </Heading>
          <Text mb={4}>
            Get your key from the FaceSign dashboard (Settings → API Keys). Set it for local use:
          </Text>

          {/* Environment variable */}
          <DocsCodeBlock
            title=".env"
            code="FACESIGN_API_KEY=sk_test_..."
            language="bash"
          />

          <Text mt={4} mb={2}>Optional SDK installation:</Text>

          <SimpleCodeBlock
            defaultLanguage="npm"
            languageSwitcher="tabs"
            codeExamples={{
              npm: "npm install @facesignai/api",
              python: "pip install facesignai",
            }}
          />
        </Box>

        {/* What are Flows callout */}
        <Blockquote.Root variant="subtle" my={6}>
          <Blockquote.Content>
            <Heading as="h4" size="sm" mb={2}>
              What are Flows?
            </Heading>
            <Text mb={2}>
              Flows define the verification journey using a node-graph system:
            </Text>
            <VStack align="start" gap={1} pl={4}>
              <Text>• <strong>Nodes</strong> are verification steps (start, end, email, document scan, etc.)</Text>
              <Text>• <strong>Edges</strong> connect nodes to define the path through verification</Text>
              <Text>• The example below uses the simplest flow: start → end</Text>
            </VStack>
            <Text mt={2}>
              <Link href="/flows" color="blue.500">Learn more about flows →</Link>
            </Text>
          </Blockquote.Content>
        </Blockquote.Root>

        {/* Step 2 */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Step 2 — Create a session (Dev)
          </Heading>
          <Text mb={4}>
            POST to Dev with a minimal flow (<Code>start</Code> → <Code>end</Code>).
          </Text>

          <SimpleCodeBlock
            headerLeft={
              <HStack>
                <Badge colorPalette="teal" fontWeight="bold">POST</Badge>
                <Span textStyle="xs">/sessions (Dev)</Span>
              </HStack>
            }
            languageSwitcher="dropdown"
            size="lg"
            codeExamples={{
              curl: `curl -X POST https://api.dev.facesign.ai/sessions \\
  -H "Authorization: Bearer $FACESIGN_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "clientReferenceId": "user-123",
    "metadata": { "source": "quickstart" },
    "flow": {
      "nodes": [
        { "id": "start", "type": "start" },  // Entry point
        { "id": "end", "type": "end" }        // Exit point
      ],
      "edges": [
        { "id": "e1", "source": "start", "target": "end" }  // Connect start to end
      ]
    }
  }'`,
              javascript: `const res = await fetch('https://api.dev.facesign.ai/sessions', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${process.env.FACESIGN_API_KEY}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    clientReferenceId: 'user-123',
    metadata: { source: 'quickstart' },
    flow: {
      nodes: [
        { id: 'start', type: 'start' },  // Entry point
        { id: 'end', type: 'end' }        // Exit point
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'end' }  // Connect start to end
      ]
    }
  }),
})
const { session, clientSecret } = await res.json()
console.log('Session ID:', session.id)
console.log('Hosted URL:', clientSecret.url)`,
              python: `import os, requests

payload = {
  "clientReferenceId": "user-123",
  "metadata": { "source": "quickstart" },
  "flow": {
    "nodes": [
      { "id": "start", "type": "start" },  # Entry point
      { "id": "end", "type": "end" }        # Exit point
    ],
    "edges": [
      { "id": "e1", "source": "start", "target": "end" }  # Connect start to end
    ]
  }
}
r = requests.post(
  'https://api.dev.facesign.ai/sessions',
  json=payload,
  headers={'Authorization': f'Bearer {os.environ.get("FACESIGN_API_KEY","")}'}
)
data = r.json()
print('Session ID:', data['session']['id'])
print('Hosted URL:', data['clientSecret']['url'])`
            }}
          />

          <Text mt={4} mb={2}>Example response (shape):</Text>

          <DocsCodeBlock
            title="CreateSessionResponse"
            code={`{
  "session": {
    "id": "sess_abc123",
    "createdAt": 1705314600,
    "status": "requiresInput",  // Waiting for user to start
    "settings": {}
  },
  "clientSecret": {
    "secret": "csea61d44d88d345e1b91622820bb73100",
    "createdAt": 1705314600,
    "expireAt": 1705316400,
    "url": "https://session.dev.facesign.ai?cs=csea61d44d88d345e1b91622820bb73100"  // Send user here
  }
}`}
            language="json"
          />
        </Box>

        {/* Step 3 */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Step 3 — Open the hosted URL
          </Heading>
          <Text>
            Send your user to the <Code>clientSecret.url</Code> to complete verification.
          </Text>
        </Box>

        <Separator />

        {/* Optional: Retrieve session */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Retrieve the session (optional)
          </Heading>
          <Text mb={4}>
            Use the session ID to poll status or fetch results.
          </Text>

          <SimpleCodeBlock
            headerLeft={
              <HStack>
                <Badge colorPalette="green" fontWeight="bold">GET</Badge>
                <Span textStyle="xs">/sessions/{'{id}'} (Dev)</Span>
              </HStack>
            }
            languageSwitcher="dropdown"
            size="lg"
            codeExamples={{
              curl: `curl https://api.dev.facesign.ai/sessions/sess_abc123 \\
  -H "Authorization: Bearer $FACESIGN_API_KEY"`,
              javascript: `const res = await fetch('https://api.dev.facesign.ai/sessions/sess_abc123', {
  headers: { Authorization: \`Bearer \${process.env.FACESIGN_API_KEY}\` },
})
const session = await res.json()
console.log('Status:', session.status)  // requiresInput, processing, complete, canceled`,
              python: `r = requests.get(
  'https://api.dev.facesign.ai/sessions/sess_abc123',
  headers={'Authorization': f'Bearer {os.environ.get("FACESIGN_API_KEY","")}'}
)
session = r.json()
print('Status:', session['status'])  # requiresInput, processing, complete, canceled`
            }}
          />

          <Text mt={4}>
            Session status values: <Code>requiresInput</Code>, <Code>processing</Code>, <Code>complete</Code>, <Code>canceled</Code>
          </Text>
        </Box>

        {/* Receive session updates */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Receive session updates
          </Heading>
          <Blockquote.Root variant="subtle" colorPalette="gray" my={3}>
            <Blockquote.Content>
              Dev webhooks use basic validation. Verify events by fetching the session and checking your clientReferenceId or metadata.
            </Blockquote.Content>
          </Blockquote.Root>

          <DocsCodeBlock
            title="Minimal webhook handler (Next.js API route)"
            language="typescript"
            code={`// app/api/webhooks/facesign/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const event = await req.json()

  // Recommended: fetch session to verify details
  // const r = await fetch('https://api.dev.facesign.ai/sessions/' + event.sessionId, {
  //   headers: { Authorization: 'Bearer ' + process.env.FACESIGN_API_KEY }
  // })
  // const data = await r.json()

  console.log('facesign.event', event.type)
  return NextResponse.json({ received: true })
}`}
          />
        </Box>

        <Separator />

        {/* Next Steps */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Next Steps
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap="4" mt="4">
            <DocLinkCard href="/docs/flows" title="Custom Flows" description="Build verification flows with nodes" />
            <DocLinkCard href="/docs/webhooks" title="Webhooks" description="Real-time session updates" />
            <DocLinkCard href="/customization" title="Customization" description="Brand your verification UI" />
          </SimpleGrid>
        </Box>
        </VStack>
      </Prose>
    </DocsLayout>
  )
}