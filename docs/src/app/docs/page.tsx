'use client'

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Alert,
  Tabs,
  Card,
  Badge,
  Separator,
  Grid,
  Link,
  CodeBlock,
  IconButton,
} from '@chakra-ui/react'
import { DocsLayout } from '@/components/chakra/DocsLayout'
import { useColorModeValue } from '@/components/ui/color-mode'
import { FiExternalLink, FiGithub, FiPackage } from 'react-icons/fi'
import { shikiAdapter } from '@/lib/shiki-adapter'

export default function DocsPage() {
  const cardBg = useColorModeValue('white', 'gray.800')

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
            <Button colorScheme="green" size="lg">
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
            >
              <FiGithub />
              View on GitHub
            </Button>
          </HStack>
        </Box>

        <Separator />

        {/* Introduction */}
        <Box id="introduction">
          <Heading as="h2" size="lg" mb={4}>
            Introduction
          </Heading>
          <Text mb={4}>
            FaceSign is an AI-powered identity verification platform that helps businesses
            verify their users&apos; identities through conversational interfaces, biometric
            verification, and document scanning.
          </Text>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
            <Card.Root bg={cardBg}>
              <Card.Body>
                <Heading size="sm" mb={2}>Conversational AI</Heading>
                <Text fontSize="sm">
                  Natural language interactions guided by AI avatars
                </Text>
              </Card.Body>
            </Card.Root>
            <Card.Root bg={cardBg}>
              <Card.Body>
                <Heading size="sm" mb={2}>Biometric Authentication</Heading>
                <Text fontSize="sm">
                  Face recognition, liveness detection, and age estimation
                </Text>
              </Card.Body>
            </Card.Root>
            <Card.Root bg={cardBg}>
              <Card.Body>
                <Heading size="sm" mb={2}>Document Verification</Heading>
                <Text fontSize="sm">
                  ID document scanning and authentication
                </Text>
              </Card.Body>
            </Card.Root>
            <Card.Root bg={cardBg}>
              <Card.Body>
                <Heading size="sm" mb={2}>Global Coverage</Heading>
                <Text fontSize="sm">
                  Support for multiple languages and regions
                </Text>
              </Card.Body>
            </Card.Root>
          </Grid>
        </Box>

        {/* Installation */}
        <Box id="installation">
          <Heading as="h2" size="lg" mb={4}>
            Installation
          </Heading>
          <Text mb={4}>
            Get started with FaceSign by installing the SDK for your preferred language.
          </Text>

          <Tabs.Root defaultValue="js" variant="enclosed">
            <Tabs.List>
              <Tabs.Trigger value="js">JavaScript/TypeScript</Tabs.Trigger>
              <Tabs.Trigger value="python">Python</Tabs.Trigger>
              <Tabs.Trigger value="go">Go</Tabs.Trigger>
            </Tabs.List>
            <Tabs.ContentGroup>
              <Tabs.Content value="js">
                <CodeBlock.AdapterProvider value={shikiAdapter}>
                  <CodeBlock.Root
                    code="npm install @facesignai/api"
                    language="bash"
                    size="sm"
                    meta={{ colorScheme: 'dark' }}
                  >
                    <CodeBlock.Header
                      py="2"
                      borderBottomWidth="1px"
                      bg="gray.900"
                      color="white"
                      borderColor="gray.700"
                    >
                      <HStack flex="1">
                        <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">
                          NPM
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
                    <CodeBlock.Content bg="gray.900">
                      <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                        <CodeBlock.CodeText />
                      </CodeBlock.Code>
                    </CodeBlock.Content>
                  </CodeBlock.Root>
                </CodeBlock.AdapterProvider>
                <Text mt={2} fontSize="sm">
                  Or using yarn:
                </Text>
                <CodeBlock.AdapterProvider value={shikiAdapter}>
                  <CodeBlock.Root
                    code="yarn add @facesignai/api"
                    language="bash"
                    size="sm"
                    meta={{ colorScheme: 'dark' }}
                  >
                    <CodeBlock.Header
                      py="2"
                      borderBottomWidth="1px"
                      bg="gray.900"
                      color="white"
                      borderColor="gray.700"
                    >
                      <HStack flex="1">
                        <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">
                          YARN
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
                    <CodeBlock.Content bg="gray.900">
                      <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                        <CodeBlock.CodeText />
                      </CodeBlock.Code>
                    </CodeBlock.Content>
                  </CodeBlock.Root>
                </CodeBlock.AdapterProvider>
              </Tabs.Content>
              <Tabs.Content value="python">
                <CodeBlock.AdapterProvider value={shikiAdapter}>
                  <CodeBlock.Root
                    code="pip install facesignai"
                    language="bash"
                    size="sm"
                    meta={{ colorScheme: 'dark' }}
                  >
                    <CodeBlock.Header
                      py="2"
                      borderBottomWidth="1px"
                      bg="gray.900"
                      color="white"
                      borderColor="gray.700"
                    >
                      <HStack flex="1">
                        <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">
                          PIP
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
                    <CodeBlock.Content bg="gray.900">
                      <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                        <CodeBlock.CodeText />
                      </CodeBlock.Code>
                    </CodeBlock.Content>
                  </CodeBlock.Root>
                </CodeBlock.AdapterProvider>
              </Tabs.Content>
              <Tabs.Content value="go">
                <CodeBlock.AdapterProvider value={shikiAdapter}>
                  <CodeBlock.Root
                    code="go get github.com/facesignai/api-go"
                    language="bash"
                    size="sm"
                    meta={{ colorScheme: 'dark' }}
                  >
                    <CodeBlock.Header
                      py="2"
                      borderBottomWidth="1px"
                      bg="gray.900"
                      color="white"
                      borderColor="gray.700"
                    >
                      <HStack flex="1">
                        <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">
                          GO GET
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
                    <CodeBlock.Content bg="gray.900">
                      <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                        <CodeBlock.CodeText />
                      </CodeBlock.Code>
                    </CodeBlock.Content>
                  </CodeBlock.Root>
                </CodeBlock.AdapterProvider>
              </Tabs.Content>
            </Tabs.ContentGroup>
          </Tabs.Root>
        </Box>

        {/* Authentication */}
        <Box id="authentication">
          <Heading as="h2" size="lg" mb={4}>
            Authentication
          </Heading>
          <Text mb={4}>
            Authenticate your requests using API keys in the request headers.
          </Text>
          <Alert.Root status="info" mb={4}>
            <Alert.Indicator />
            <Alert.Title>
              API keys are available in your FaceSign dashboard under Settings → API Keys.
            </Alert.Title>
          </Alert.Root>

          <Tabs.Root defaultValue="js" variant="enclosed">
            <Tabs.List>
              <Tabs.Trigger value="js">JavaScript</Tabs.Trigger>
              <Tabs.Trigger value="python">Python</Tabs.Trigger>
              <Tabs.Trigger value="curl">cURL</Tabs.Trigger>
            </Tabs.List>
            <Tabs.ContentGroup>
              <Tabs.Content value="js">
                <CodeBlock.AdapterProvider value={shikiAdapter}>
                  <CodeBlock.Root
                    code={`import { FaceSignClient } from '@facesignai/api';

const client = new FaceSignClient({
  apiKey: process.env.FACESIGN_API_KEY
});`}
                    language="javascript"
                    size="sm"
                    meta={{ colorScheme: 'dark' }}
                  >
                    <CodeBlock.Header py="2" borderBottomWidth="1px" bg="gray.900" color="white" borderColor="gray.700">
                      <HStack flex="1">
                        <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">JAVASCRIPT</Text>
                      </HStack>
                      <CodeBlock.Control>
                        <CodeBlock.CopyTrigger asChild>
                          <IconButton variant="ghost" size="2xs" color="white">
                            <CodeBlock.CopyIndicator />
                          </IconButton>
                        </CodeBlock.CopyTrigger>
                      </CodeBlock.Control>
                    </CodeBlock.Header>
                    <CodeBlock.Content bg="gray.900">
                      <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                        <CodeBlock.CodeText />
                      </CodeBlock.Code>
                    </CodeBlock.Content>
                  </CodeBlock.Root>
                </CodeBlock.AdapterProvider>
              </Tabs.Content>
              <Tabs.Content value="python">
                <CodeBlock.AdapterProvider value={shikiAdapter}>
                  <CodeBlock.Root
                    code={`from facesignai import FaceSignClient

client = FaceSignClient(
    api_key=os.environ["FACESIGN_API_KEY"]
)`}
                    language="python"
                    size="sm"
                    meta={{ colorScheme: 'dark' }}
                  >
                    <CodeBlock.Header py="2" borderBottomWidth="1px" bg="gray.900" color="white" borderColor="gray.700">
                      <HStack flex="1">
                        <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">PYTHON</Text>
                      </HStack>
                      <CodeBlock.Control>
                        <CodeBlock.CopyTrigger asChild>
                          <IconButton variant="ghost" size="2xs" color="white">
                            <CodeBlock.CopyIndicator />
                          </IconButton>
                        </CodeBlock.CopyTrigger>
                      </CodeBlock.Control>
                    </CodeBlock.Header>
                    <CodeBlock.Content bg="gray.900">
                      <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                        <CodeBlock.CodeText />
                      </CodeBlock.Code>
                    </CodeBlock.Content>
                  </CodeBlock.Root>
                </CodeBlock.AdapterProvider>
              </Tabs.Content>
              <Tabs.Content value="curl">
                <CodeBlock.AdapterProvider value={shikiAdapter}>
                  <CodeBlock.Root
                    code={`curl -X POST https://api.facesign.ai/v1/sessions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                    language="bash"
                    size="sm"
                    meta={{ colorScheme: 'dark' }}
                  >
                    <CodeBlock.Header py="2" borderBottomWidth="1px" bg="gray.900" color="white" borderColor="gray.700">
                      <HStack flex="1">
                        <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">CURL</Text>
                      </HStack>
                      <CodeBlock.Control>
                        <CodeBlock.CopyTrigger asChild>
                          <IconButton variant="ghost" size="2xs" color="white">
                            <CodeBlock.CopyIndicator />
                          </IconButton>
                        </CodeBlock.CopyTrigger>
                      </CodeBlock.Control>
                    </CodeBlock.Header>
                    <CodeBlock.Content bg="gray.900">
                      <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                        <CodeBlock.CodeText />
                      </CodeBlock.Code>
                    </CodeBlock.Content>
                  </CodeBlock.Root>
                </CodeBlock.AdapterProvider>
              </Tabs.Content>
            </Tabs.ContentGroup>
          </Tabs.Root>
        </Box>

        {/* First Session */}
        <Box id="first-session">
          <Heading as="h2" size="lg" mb={4}>
            Creating Your First Session
          </Heading>
          <Text mb={4}>
            Sessions are the core of FaceSign&apos;s verification process. Create a session
            to start verifying a user&apos;s identity.
          </Text>

          <CodeBlock.AdapterProvider value={shikiAdapter}>
            <CodeBlock.Root
              code={`const session = await client.sessions.create({
  flow_id: "your-flow-id",
  user_data: {
    email: "user@example.com",
    name: "John Doe"
  }
});

console.log("Session URL:", session.url);
console.log("Session ID:", session.id);`}
              language="javascript"
              size="sm"
              meta={{ colorScheme: 'dark' }}
            >
              <CodeBlock.Header py="2" borderBottomWidth="1px" bg="gray.900" color="white" borderColor="gray.700">
                <HStack flex="1">
                  <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">JAVASCRIPT</Text>
                </HStack>
                <CodeBlock.Control>
                  <CodeBlock.CopyTrigger asChild>
                    <IconButton variant="ghost" size="2xs" color="white">
                      <CodeBlock.CopyIndicator />
                    </IconButton>
                  </CodeBlock.CopyTrigger>
                </CodeBlock.Control>
              </CodeBlock.Header>
              <CodeBlock.Content bg="gray.900">
                <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                  <CodeBlock.CodeText />
                </CodeBlock.Code>
              </CodeBlock.Content>
            </CodeBlock.Root>
          </CodeBlock.AdapterProvider>
        </Box>

        {/* Core Concepts */}
        <Box id="sessions">
          <Heading as="h2" size="lg" mb={4}>
            Sessions
          </Heading>
          <Text mb={4}>
            Sessions track the verification journey through four primary statuses:
          </Text>
          <VStack align="stretch" gap={3}>
            <HStack>
              <Badge colorScheme="gray">requiresInput</Badge>
              <Text fontSize="sm">Session created and awaiting user input</Text>
            </HStack>
            <HStack>
              <Badge colorScheme="blue">processing</Badge>
              <Text fontSize="sm">Session started; processing underway</Text>
            </HStack>
            <HStack>
              <Badge colorScheme="orange">canceled</Badge>
              <Text fontSize="sm">Session canceled by user or halted</Text>
            </HStack>
            <HStack>
              <Badge colorScheme="green">complete</Badge>
              <Text fontSize="sm">Flow ended; results available</Text>
            </HStack>
          </VStack>
        </Box>

        {/* Flows */}
        <Box id="flows">
          <Heading as="h2" size="lg" mb={4}>
            Verification Flows
          </Heading>
          <Text mb={4}>
            FaceSign uses a node-based flow system to create customizable verification
            workflows. Each flow consists of nodes (verification steps) connected by
            edges (transitions).
          </Text>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
            <Card.Root bg={cardBg}>
              <Card.Body>
                <Badge colorScheme="purple" mb={2}>Node Types</Badge>
                <VStack align="start" gap={1} mt={2}>
                  <Text fontSize="sm">• Conversation Nodes</Text>
                  <Text fontSize="sm">• Biometric Verification</Text>
                  <Text fontSize="sm">• Document Scanning</Text>
                  <Text fontSize="sm">• Email/SMS Verification</Text>
                </VStack>
              </Card.Body>
            </Card.Root>
            <Card.Root bg={cardBg}>
              <Card.Body>
                <Badge colorScheme="teal" mb={2}>Edge Logic</Badge>
                <VStack align="start" gap={1} mt={2}>
                  <Text fontSize="sm">• Conditional Branching</Text>
                  <Text fontSize="sm">• Success/Failure Paths</Text>
                  <Text fontSize="sm">• Custom Rules</Text>
                  <Text fontSize="sm">• Retry Logic</Text>
                </VStack>
              </Card.Body>
            </Card.Root>
          </Grid>
        </Box>

        {/* Modules */}
        <Box id="modules">
          <Heading as="h2" size="lg" mb={4}>
            Verification Modules
          </Heading>
          <Text mb={4}>
            FaceSign provides various verification modules that can be combined
            to create comprehensive identity verification flows.
          </Text>
        </Box>

        {/* Email Verification */}
        <Box id="email-verification">
          <Heading as="h3" size="md" mb={3}>
            Email Verification
          </Heading>
          <Text mb={4}>
            Verify user email addresses with one-time passwords (OTP) or magic links.
          </Text>
          <CodeBlock.AdapterProvider value={shikiAdapter}>
            <CodeBlock.Root
              code={`{
  "type": "email_verification",
  "config": {
    "method": "otp",
    "otp_length": 6,
    "expiry_minutes": 10
  }
}`}
              language="json"
              size="sm"
              meta={{ colorScheme: 'dark' }}
            >
              <CodeBlock.Header py="2" borderBottomWidth="1px" bg="gray.900" color="white" borderColor="gray.700">
                <HStack flex="1">
                  <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">JSON</Text>
                </HStack>
                <CodeBlock.Control>
                  <CodeBlock.CopyTrigger asChild>
                    <IconButton variant="ghost" size="2xs" color="white">
                      <CodeBlock.CopyIndicator />
                    </IconButton>
                  </CodeBlock.CopyTrigger>
                </CodeBlock.Control>
              </CodeBlock.Header>
              <CodeBlock.Content bg="gray.900">
                <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                  <CodeBlock.CodeText />
                </CodeBlock.Code>
              </CodeBlock.Content>
            </CodeBlock.Root>
          </CodeBlock.AdapterProvider>
        </Box>

        {/* SMS Verification */}
        <Box id="sms-verification">
          <Heading as="h3" size="md" mb={3}>
            SMS Verification
          </Heading>
          <Text mb={4}>
            Send verification codes via SMS to validate phone numbers.
          </Text>
          <CodeBlock.AdapterProvider value={shikiAdapter}>
            <CodeBlock.Root
              code={`{
  "type": "sms_verification",
  "config": {
    "otp_length": 6,
    "expiry_minutes": 5,
    "sender_id": "FaceSign"
  }
}`}
              language="json"
              size="sm"
              meta={{ colorScheme: 'dark' }}
            >
              <CodeBlock.Header py="2" borderBottomWidth="1px" bg="gray.900" color="white" borderColor="gray.700">
                <HStack flex="1">
                  <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">JSON</Text>
                </HStack>
                <CodeBlock.Control>
                  <CodeBlock.CopyTrigger asChild>
                    <IconButton variant="ghost" size="2xs" color="white">
                      <CodeBlock.CopyIndicator />
                    </IconButton>
                  </CodeBlock.CopyTrigger>
                </CodeBlock.Control>
              </CodeBlock.Header>
              <CodeBlock.Content bg="gray.900">
                <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                  <CodeBlock.CodeText />
                </CodeBlock.Code>
              </CodeBlock.Content>
            </CodeBlock.Root>
          </CodeBlock.AdapterProvider>
        </Box>

        {/* Document Authentication */}
        <Box id="document-authentication">
          <Heading as="h3" size="md" mb={3}>
            Document Authentication
          </Heading>
          <Text mb={4}>
            Scan and verify government-issued ID documents using advanced OCR and
            authentication techniques.
          </Text>
          <Alert.Root status="warning" mb={4}>
            <Alert.Indicator />
            <Alert.Title>
              Document scanning requires camera access and works best on mobile devices.
            </Alert.Title>
          </Alert.Root>
        </Box>

        {/* Identity Verification */}
        <Box id="identity-verification">
          <Heading as="h3" size="md" mb={3}>
            Identity Verification
          </Heading>
          <Text mb={4}>
            Perform biometric verification including face recognition, liveness detection,
            and age estimation.
          </Text>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
            <Card.Root bg={cardBg}>
              <Card.Body>
                <Heading size="xs" mb={2}>Face Recognition</Heading>
                <Text fontSize="sm">
                  Match faces against reference documents
                </Text>
              </Card.Body>
            </Card.Root>
            <Card.Root bg={cardBg}>
              <Card.Body>
                <Heading size="xs" mb={2}>Liveness Detection</Heading>
                <Text fontSize="sm">
                  Ensure the person is physically present
                </Text>
              </Card.Body>
            </Card.Root>
            <Card.Root bg={cardBg}>
              <Card.Body>
                <Heading size="xs" mb={2}>Age Estimation</Heading>
                <Text fontSize="sm">
                  Verify age for compliance requirements
                </Text>
              </Card.Body>
            </Card.Root>
          </Grid>
        </Box>

        {/* Webhooks */}
        <Box id="webhooks">
          <Heading as="h2" size="lg" mb={4}>
            Webhooks
          </Heading>
          <Text mb={4}>
            Receive real-time notifications about session events and verification results.
          </Text>
          <CodeBlock.AdapterProvider value={shikiAdapter}>
            <CodeBlock.Root
              code={`POST https://your-server.com/webhooks/facesign
Content-Type: application/json

{
  "id": "evt_123",
  "type": "session.completed",
  "createdAt": 1705314600,
  "sessionId": "sess_123"
}`}
              language="bash"
              size="sm"
              meta={{ colorScheme: 'dark' }}
            >
              <CodeBlock.Header py="2" borderBottomWidth="1px" bg="gray.900" color="white" borderColor="gray.700">
                <HStack flex="1">
                  <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">WEBHOOK</Text>
                </HStack>
                <CodeBlock.Control>
                  <CodeBlock.CopyTrigger asChild>
                    <IconButton variant="ghost" size="2xs" color="white">
                      <CodeBlock.CopyIndicator />
                    </IconButton>
                  </CodeBlock.CopyTrigger>
                </CodeBlock.Control>
              </CodeBlock.Header>
              <CodeBlock.Content bg="gray.900">
                <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                  <CodeBlock.CodeText />
                </CodeBlock.Code>
              </CodeBlock.Content>
            </CodeBlock.Root>
          </CodeBlock.AdapterProvider>
        </Box>

        {/* Error Handling */}
        <Box id="error-handling">
          <Heading as="h2" size="lg" mb={4}>
            Error Handling
          </Heading>
          <Text mb={4}>
            FaceSign API uses standard HTTP response codes and provides detailed error messages.
          </Text>
          <VStack align="stretch" gap={3}>
            <HStack>
              <Badge colorScheme="green">200</Badge>
              <Text fontSize="sm">Success</Text>
            </HStack>
            <HStack>
              <Badge colorScheme="yellow">400</Badge>
              <Text fontSize="sm">validation_error - Invalid parameters</Text>
            </HStack>
            <HStack>
              <Badge colorScheme="red">401</Badge>
              <Text fontSize="sm">authentication_error - Invalid API key</Text>
            </HStack>
            <HStack>
              <Badge colorScheme="red">404</Badge>
              <Text fontSize="sm">not_found_error - Resource not found</Text>
            </HStack>
            <HStack>
              <Badge colorScheme="orange">429</Badge>
              <Text fontSize="sm">rate_limit_error - Too many requests</Text>
            </HStack>
            <HStack>
              <Badge colorScheme="red">500</Badge>
              <Text fontSize="sm">server_error - Internal error</Text>
            </HStack>
          </VStack>
        </Box>

        {/* SDKs */}
        <Box id="sdk-javascript">
          <Heading as="h2" size="lg" mb={4}>
            SDKs
          </Heading>
        </Box>

        <Box>
          <Heading as="h3" size="md" mb={3}>
            JavaScript/TypeScript SDK
          </Heading>
          <HStack gap={4} mb={4}>
            <Link
              href="https://www.npmjs.com/package/@facesignai/api"
              target="_blank"
              rel="noopener noreferrer"
            >
              <HStack>
                <FiPackage />
                <Text>NPM Package</Text>
                <FiExternalLink />
              </HStack>
            </Link>
            <Link
              href="https://github.com/facesignai/api-js"
              target="_blank"
              rel="noopener noreferrer"
            >
              <HStack>
                <FiGithub />
                <Text>GitHub</Text>
                <FiExternalLink />
              </HStack>
            </Link>
          </HStack>
          <CodeBlock.AdapterProvider value={shikiAdapter}>
            <CodeBlock.Root
              code={`// TypeScript support included
import { FaceSignClient, Session } from '@facesignai/api';

const client = new FaceSignClient({
  apiKey: process.env.FACESIGN_API_KEY
});

// Full type safety
const session: Session = await client.sessions.create({...});`}
              language="typescript"
              size="sm"
              meta={{ colorScheme: 'dark' }}
            >
              <CodeBlock.Header py="2" borderBottomWidth="1px" bg="gray.900" color="white" borderColor="gray.700">
                <HStack flex="1">
                  <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">TYPESCRIPT</Text>
                </HStack>
                <CodeBlock.Control>
                  <CodeBlock.CopyTrigger asChild>
                    <IconButton variant="ghost" size="2xs" color="white">
                      <CodeBlock.CopyIndicator />
                    </IconButton>
                  </CodeBlock.CopyTrigger>
                </CodeBlock.Control>
              </CodeBlock.Header>
              <CodeBlock.Content bg="gray.900">
                <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                  <CodeBlock.CodeText />
                </CodeBlock.Code>
              </CodeBlock.Content>
            </CodeBlock.Root>
          </CodeBlock.AdapterProvider>
        </Box>

        <Box id="sdk-python">
          <Heading as="h3" size="md" mb={3}>
            Python SDK
          </Heading>
          <HStack gap={4} mb={4}>
            <Link
              href="https://pypi.org/project/facesignai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <HStack>
                <FiPackage />
                <Text>PyPI Package</Text>
                <FiExternalLink />
              </HStack>
            </Link>
          </HStack>
          <CodeBlock.AdapterProvider value={shikiAdapter}>
            <CodeBlock.Root
              code={`# Async/await support
import asyncio
from facesignai import FaceSignClient

client = FaceSignClient(api_key="...")

async def verify_user():
    session = await client.sessions.create_async(...)
    return session`}
              language="python"
              size="sm"
              meta={{ colorScheme: 'dark' }}
            >
              <CodeBlock.Header py="2" borderBottomWidth="1px" bg="gray.900" color="white" borderColor="gray.700">
                <HStack flex="1">
                  <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">PYTHON</Text>
                </HStack>
                <CodeBlock.Control>
                  <CodeBlock.CopyTrigger asChild>
                    <IconButton variant="ghost" size="2xs" color="white">
                      <CodeBlock.CopyIndicator />
                    </IconButton>
                  </CodeBlock.CopyTrigger>
                </CodeBlock.Control>
              </CodeBlock.Header>
              <CodeBlock.Content bg="gray.900">
                <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                  <CodeBlock.CodeText />
                </CodeBlock.Code>
              </CodeBlock.Content>
            </CodeBlock.Root>
          </CodeBlock.AdapterProvider>
        </Box>

        <Box id="sdk-go">
          <Heading as="h3" size="md" mb={3}>
            Go SDK
          </Heading>
          <CodeBlock.AdapterProvider value={shikiAdapter}>
            <CodeBlock.Root
              code={`package main

import (
    "github.com/facesignai/api-go"
)

client := facesign.NewClient("your-api-key")
session, err := client.Sessions.Create(&facesign.SessionCreateParams{
    FlowID: "flow_123",
})`}
              language="go"
              size="sm"
              meta={{ colorScheme: 'dark' }}
            >
              <CodeBlock.Header py="2" borderBottomWidth="1px" bg="gray.900" color="white" borderColor="gray.700">
                <HStack flex="1">
                  <Text textStyle="xs" color="gray.400" fontFamily="mono" fontWeight="bold">GO</Text>
                </HStack>
                <CodeBlock.Control>
                  <CodeBlock.CopyTrigger asChild>
                    <IconButton variant="ghost" size="2xs" color="white">
                      <CodeBlock.CopyIndicator />
                    </IconButton>
                  </CodeBlock.CopyTrigger>
                </CodeBlock.Control>
              </CodeBlock.Header>
              <CodeBlock.Content bg="gray.900">
                <CodeBlock.Code fontSize="xs" overflowX="auto" color="white">
                  <CodeBlock.CodeText />
                </CodeBlock.Code>
              </CodeBlock.Content>
            </CodeBlock.Root>
          </CodeBlock.AdapterProvider>
        </Box>

      </VStack>
    </DocsLayout>
  )
}