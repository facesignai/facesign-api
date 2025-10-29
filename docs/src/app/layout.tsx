import { type Metadata, type Viewport } from 'next'
import { Provider } from '@/components/ui/provider'
import { SearchProvider } from '@/components/SearchProvider'

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

// Use automatic static optimization - Next.js will statically generate
// pages where possible while allowing client-side providers to hydrate correctly
// (removed force-dynamic to enable static generation, removed force-static to avoid hydration errors)

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
