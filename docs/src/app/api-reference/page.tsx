import { type Metadata } from 'next'
import { ApiReferenceClient } from './client'

export const metadata: Metadata = {
  title: 'API Reference - FaceSign API Documentation',
  description: 'Complete API reference for the FaceSign identity verification API',
}

export default function ApiReferencePage() {
  return <ApiReferenceClient />
}