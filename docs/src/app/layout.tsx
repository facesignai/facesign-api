import { type Metadata, type Viewport } from 'next'
import { Provider } from '@/components/ui/provider'
import { SearchProvider } from '@/components/SearchProvider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s - FaceSign API Documentation',
    default: 'FaceSign API Documentation',
  },
  description: 'Complete API documentation for FaceSign identity verification',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#10b981',
}

// Force dynamic rendering to avoid SSG context issues with client-side providers
export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body suppressHydrationWarning>
        <Provider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </Provider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Only register service worker in production
              if ('serviceWorker' in navigator && '${process.env.NODE_ENV}' === 'production') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              } else if ('serviceWorker' in navigator && '${process.env.NODE_ENV}' !== 'production') {
                // In development, unregister any existing service workers
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                    console.log('SW unregistered in development mode');
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
