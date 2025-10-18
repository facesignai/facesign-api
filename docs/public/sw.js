// Service Worker for FaceSign API Documentation
// Provides offline support for core documentation pages

const CACHE_VERSION = '1.0.1'
const CACHE_NAME = `facesign-docs-v${CACHE_VERSION}-${Date.now()}`
const OFFLINE_PAGES = [
  '/',
  '/quickstart',
  '/authentication', 
  '/sessions',
  '/modules',
  '/webhooks',
  '/errors',
  '/languages',
  '/avatars',
  '/client-secrets',
  '/openapi.yaml'
]

const STATIC_ASSETS = [
  '/favicon.ico',
  '/_next/static/css/app.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main.js'
]

// Install service worker and cache resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching offline pages and assets')
        return cache.addAll([...OFFLINE_PAGES, ...STATIC_ASSETS])
      })
      .catch((error) => {
        console.error('[SW] Failed to cache resources:', error)
      })
  )
  
  // Force activation of new service worker
  self.skipWaiting()
})

// Activate service worker and clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            })
        )
      })
  )
  
  // Take control of all pages immediately
  event.waitUntil(self.clients.claim())
})

// Intercept fetch requests
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return

  // Skip non-navigation requests for external domains
  if (!event.request.url.startsWith(self.location.origin)) return

  // Network-first strategy for HTML pages (ensures fresh content)
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and cache the response
          if (response && response.status === 200) {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return response
        })
        .catch(() => {
          // Network failed, fallback to cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                console.log('[SW] Network failed, serving from cache:', event.request.url)
                return cachedResponse
              }
              return new Response('Offline - Please check your connection', {
                status: 503,
                statusText: 'Service Unavailable'
              })
            })
        })
    )
    return
  }

  // Cache-first strategy for static assets (CSS, JS, images)
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Serving static asset from cache:', event.request.url)
          return cachedResponse
        }

        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })

            return response
          })
      })
  )
})

// Handle background sync for API playground requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'api-playground-sync') {
    event.waitUntil(syncApiPlaygroundRequests())
  }
})

async function syncApiPlaygroundRequests() {
  // Implementation for syncing queued API requests when back online
  console.log('[SW] Syncing API playground requests...')
}

// Handle push notifications (future enhancement)
self.addEventListener('push', (event) => {
  if (!event.data) return
  
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: data.data || {}
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  )
})