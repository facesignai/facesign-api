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
            This quickstart shows a minimal 3-step Dev flow to integrate FaceSign into your application.
          </Text>
        </Box>

        <Blockquote.Root variant="subtle" my={6}>
          <Blockquote.Content>
            Your API keys carry many privileges and access to sensitive data, so be sure to keep them secure!
          </Blockquote.Content>
        </Blockquote.Root>

        <Separator />

        {/* Step 1 */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Step 1 — Getting an API Key
          </Heading>

          <Blockquote.Root variant="subtle" colorPalette="blue" my={4}>
            <Blockquote.Content>
              <Text mb={2}>
                <strong>For Testing (Sandbox):</strong>
              </Text>
              <VStack align="start" gap={1} pl={4} mb={2}>
                <Text>1. Contact your FaceSign administrator for provisioning</Text>
                <Text>2. Receive your test key (sk_test_...)</Text>
              </VStack>
              <Text>
                <strong>For Production:</strong> Contact <Link href="mailto:sales@facesign.ai" color="blue.500">sales@facesign.ai</Link> for production API credentials (sk_live_...)
              </Text>
            </Blockquote.Content>
          </Blockquote.Root>

          <Text mb={4}>
            Set your API key for local use (optional):
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
              Flows define the avatar behavior and session logic using a node-based system:
            </Text>
            <VStack align="start" gap={1} pl={4}>
              <Text>• <strong>Nodes</strong> are steps in the flow (start, end, email, document scan, etc.)</Text>
              <Text>• Each node has an <strong>outcome</strong> that points to the next node</Text>
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
    "flow": [
      { "id": "startNodeId", "type": "start", "outcome": "endNodeId" },  // Entry point
      { "id": "endNodeId", "type": "end" }        // Exit point
    ]
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
    flow: [
      { id: 'startNodeId', type: 'start', outcome: 'endNodeId' },  // Entry point
      { id: 'endNodeId', type: 'end' }        // Exit point
    ]
  }),
})
const { session, clientSecret } = await res.json()
console.log('Session ID:', session.id)
console.log('Hosted URL:', clientSecret.url)`,
              python: `import os, requests

payload = {
  "clientReferenceId": "user-123",
  "metadata": { "source": "quickstart" },
  "flow": [
    { "id": "startNodeId", "type": "start", "outcome": "endNodeId" },  # Entry point
    { "id": "endNodeId", "type": "end" }        # Exit point
  ]
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
    "id": "XCuCa03d57koRXXieHfy",
    "createdAt": 1762343497093,
    "status": "created",
    "settings": {
      "clientReferenceId": "user-123",
      "metadata": { "source": "quickstart" },
      "flow": [
        { "id": "startNodeId", "type": "start", "outcome": "endNodeId" },
        { "id": "endNodeId", "type": "end" }
      ],
      "avatarId": "June_HR_public"
    },
    "report": { "transcript": [], "lang": "en", "nodeReports": [] }
  },
  "clientSecret": {
    "secret": "csd2f18a89e0c5429aad0e247ff97e12bd",
    "createdAt": 1762343497092,
    "url": "https://session.dev.facesign.ai?cs=csd2f18a89e0c5429aad0e247ff97e12bd",
    "expireAt": 1762350697092
  }
}`}
            language="json"
          />
        </Box>

        {/* Step 3 */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Step 3 — Embed with iframe
          </Heading>
          <Text mb={4}>
            Use the <Code>clientSecret.url</Code> as the iframe src to embed FaceSign into your application:
          </Text>

          <DocsCodeBlock
            title="Embed FaceSign"
            code={`<iframe
  allow='camera; microphone'
  src={clientSecret.url}
  width='100%'
  height='100%'
/>`}
            language="html"
          />

          <Text mt={4} fontSize="sm" color="gray.600">
            Note: The <Code>allow</Code> attribute is required for camera and microphone access.
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
console.log('Status:', session.status)  // created, inProgress, incomplete, complete`,
              python: `r = requests.get(
  'https://api.dev.facesign.ai/sessions/sess_abc123',
  headers={'Authorization': f'Bearer {os.environ.get("FACESIGN_API_KEY","")}'}
)
session = r.json()
print('Status:', session['status'])  # created, inProgress, incomplete, complete`
            }}
          />

          <Text mt={4}>
            Session status values: <Code>created</Code> (initial), <Code>inProgress</Code>, <Code>incomplete</Code>, <Code>complete</Code>
          </Text>
          <Text mt={2} fontSize="sm" color="gray.600">
            Note: All timestamps are in Unix milliseconds (not seconds)
          </Text>
        </Box>

        {/* Receive session updates */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Receive session updates
          </Heading>
          <Blockquote.Root variant="subtle" colorPalette="gray" my={3}>
            <Blockquote.Content>
              Webhooks notify your backend about changes in session state. Fetch the session after receiving webhooks.
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