import { Button } from '@/components/Button'
import { HeroPattern } from '@/components/HeroPattern'
import { Box, Container, VStack, Text, Heading } from '@chakra-ui/react'

export default function NotFound() {
  return (
    <>
      <HeroPattern />
      <Container maxW="xl" h="full" centerContent>
        <VStack gap={4} py={16} textAlign="center">
          <Text fontSize="sm" fontWeight="semibold">
            404
          </Text>
          <Heading as="h1" size="xl" mt={2}>
            Page not found
          </Heading>
          <Text fontSize="md" color="gray.600" _dark={{ color: 'gray.400' }} mt={2}>
            Sorry, we couldn't find the page you're looking for.
          </Text>
          <Box mt={8}>
            <Button href="/" arrow="right">
              Back to docs
            </Button>
          </Box>
        </VStack>
      </Container>
    </>
  )
}
