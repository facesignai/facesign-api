import { type Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Spinner, Center } from '@chakra-ui/react'

// Lazy load Redoc to reduce main bundle size (Redoc is ~150KB)
const ApiReferenceClient = dynamic(() => import('./client').then(mod => mod.ApiReferenceClient), {
  loading: () => (
    <Center minH="100vh">
      <Spinner size="xl" color="brand.500" />
    </Center>
  ),
  ssr: false, // Client-only rendering for Redoc
})

export const metadata: Metadata = {
  title: 'API Reference - FaceSign API Documentation',
  description: 'Complete API reference for the FaceSign identity verification API',
}

export default function ApiReferencePage() {
  return <ApiReferenceClient />
}