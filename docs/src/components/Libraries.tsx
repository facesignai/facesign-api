import Image from 'next/image'
import { Heading, Card, SimpleGrid, HStack, VStack, Text, Button, Badge, Box } from '@chakra-ui/react'
import logoGo from '@/images/logos/go.svg'
import logoNode from '@/images/logos/node.svg'
import logoPython from '@/images/logos/python.svg'

const libraries = [
  {
    href: 'https://www.npmjs.com/package/@facesignai/api',
    name: 'TypeScript/JavaScript',
    description:
      'Official TypeScript SDK with full type safety and IntelliSense support for Node.js and browser environments.',
    logo: logoNode,
    status: 'available',
    buttonText: 'View on npm',
  },
  {
    href: 'https://pypi.org/project/facesign-api/',
    name: 'Python',
    description:
      'Python SDK for server-side integrations with Django, Flask, and FastAPI.',
    logo: logoPython,
    status: 'available',
    buttonText: 'View on PyPI',
  },
  {
    href: 'https://pkg.go.dev/github.com/facesignai/facesign-go',
    name: 'Go',
    description:
      'Lightweight Go SDK for high-performance server applications.',
    logo: logoGo,
    status: 'available',
    buttonText: 'View on pkg.go.dev',
  },
]

export function Libraries() {
  return (
    <Box>
      {/* Available SDKs Section */}
      <Heading as="h2" id="official-libraries" fontSize="2xl" fontWeight="semibold" mb={6} mt={12}>
        Available SDKs
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mb={12}>
        {libraries.map((library) => (
          <Card.Root
            key={library.name}
            borderWidth="1px"
            borderColor="gray.200"
            _dark={{ borderColor: 'gray.700' }}
            _hover={{
              borderColor: 'green.500',
              boxShadow: 'sm',
              _dark: { borderColor: 'green.400' },
            }}
            transition="all 0.2s"
          >
            <Card.Body p={6}>
              <VStack align="start" gap={4}>
                {/* Icon Container */}
                <Box
                  p={3}
                  borderRadius="lg"
                  bg="gray.50"
                  _dark={{ bg: 'gray.800' }}
                >
                  <Image src={library.logo} alt="" width={40} height={40} unoptimized />
                </Box>

                {/* Title and Badge */}
                <VStack align="start" gap={2} w="full">
                  <HStack justify="space-between" w="full">
                    <Text
                      flex="1"
                      minW="0"
                      fontSize="lg"
                      fontWeight="semibold"
                      color="gray.900"
                      _dark={{ color: 'white' }}
                    >
                      {library.name}
                    </Text>
                    <Badge colorPalette="green" size="sm" flexShrink={0}>
                      Available
                    </Badge>
                  </HStack>

                  {/* Description */}
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    _dark={{ color: 'gray.400' }}
                    lineHeight="tall"
                    wordBreak="break-word"
                  >
                    {library.description}
                  </Text>
                </VStack>

                {/* Button */}
                <Button
                  asChild
                  variant="ghost"
                  colorPalette="green"
                  size="sm"
                  mt={2}
                  _hover={{ textDecoration: 'underline' }}
                >
                  <a href={library.href} target="_blank" rel="noopener noreferrer">
                    {library.buttonText} →
                  </a>
                </Button>
              </VStack>
            </Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>
    </Box>
  )
}
