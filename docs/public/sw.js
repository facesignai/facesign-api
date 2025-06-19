// Service Worker for FaceSign API Documentation
// Provides offline support for core documentation pages

const CACHE_NAME = 'facesign-docs-v1.0.0'
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

// Intercept fetch requests and serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return
  
  // Skip non-navigation requests for external domains
  if (!event.request.url.startsWith(self.location.origin)) return
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', event.request.url)
          return cachedResponse
        }
        
        // Try to fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            
            // Clone response for caching
            const responseToCache = response.clone()
            
            // Cache successful responses for future offline use
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })
            
            return response
          })
          .catch(() => {
            // Network failed, try to serve offline fallback
            if (event.request.destination === 'document') {
              return caches.match('/offline.html') || 
                     caches.match('/') ||
                     new Response('Offline - Please check your connection', {
                       status: 503,
                       statusText: 'Service Unavailable'
                     })
            }
            
            // For other resources, just fail gracefully
            return new Response('Resource not available offline', {
              status: 503,
              statusText: 'Service Unavailable'
            })
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