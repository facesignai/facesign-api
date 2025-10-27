import { redirect } from 'next/navigation'

export const metadata = {
  title: 'FSNode (moved)',
  description: 'This page has moved to /docs/flows#fsnode.',
}

export default function FSNodeRedirect() {
  redirect('/docs/flows#fsnode')
}
