import Image from 'next/image'
import { Heading, Card, HStack, Text, Button } from '@chakra-ui/react'
import logoGo from '@/images/logos/go.svg'
import logoNode from '@/images/logos/node.svg'
import logoPhp from '@/images/logos/php.svg'
import logoPython from '@/images/logos/python.svg'
import logoRuby from '@/images/logos/ruby.svg'

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

const upcomingLibraries = [
  {
    name: 'PHP',
    description:
      'PHP SDK for Laravel, Symfony, and vanilla PHP applications.',
    logo: logoPhp,
    status: 'planned',
    timeline: 'Q3 2024',
  },
  {
    name: 'Ruby',
    description:
      'Ruby SDK for Rails applications and Ruby web frameworks.',
    logo: logoRuby,
    status: 'planned',
    timeline: 'Q4 2024',
  },
]

export function Libraries() {
  return (
    <div>
      <Heading as="h2" id="official-libraries" mb={4}>
        Available SDKs
      </Heading>
      <HStack wrap="wrap" gap="4">
        {libraries.map((library) => (
          <Card.Root key={library.name} maxW="md" flex="1" borderWidth="1px">
            <Card.Body>
              <HStack gap="3" align="start">
                <Image src={library.logo} alt="" width={24} height={24} unoptimized />
                <div style={{ minWidth: 0 }}>
                  <HStack gap="2">
                    <Text fontWeight="semibold">{library.name}</Text>
                    <Text as="span" color="green.600" fontSize="xs">Available</Text>
                  </HStack>
                  <Text mt="1" color="fg.muted" fontSize="sm" overflowWrap="anywhere" lineClamp={3}>
                    {library.description}
                  </Text>
                  <Button asChild variant="plain" size="sm" mt="2">
                    <a href={library.href}>{library.buttonText}</a>
                  </Button>
                </div>
              </HStack>
            </Card.Body>
          </Card.Root>
        ))}
      </HStack>

      <Heading as="h2" id="upcoming-libraries" mt={10} mb={4}>
        Planned SDKs
      </Heading>
      <HStack wrap="wrap" gap="4">
        {upcomingLibraries.map((library) => (
          <Card.Root key={library.name} maxW="md" flex="1" borderWidth="1px" opacity={0.85}>
            <Card.Body>
              <HStack gap="3" align="start">
                <Image src={library.logo} alt="" width={24} height={24} unoptimized />
                <div style={{ minWidth: 0 }}>
                  <HStack gap="2">
                    <Text fontWeight="semibold">{library.name}</Text>
                    <Text as="span" color="amber.700" fontSize="xs">{library.timeline}</Text>
                  </HStack>
                  <Text mt="1" color="fg.muted" fontSize="sm" overflowWrap="anywhere" lineClamp={3}>
                    {library.description}
                  </Text>
                  <Text mt="2" fontSize="xs" color="fg.muted">Coming soon</Text>
                </div>
              </HStack>
            </Card.Body>
          </Card.Root>
        ))}
      </HStack>
    </div>
  )
}
