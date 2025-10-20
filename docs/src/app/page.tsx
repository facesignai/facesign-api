import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect the root to the documentation home per plan
  redirect('/docs')
}