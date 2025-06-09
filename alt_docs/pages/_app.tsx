import type { AppProps } from '@/protocol_docs/node_modules/next/app'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
} 