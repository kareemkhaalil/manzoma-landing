const CACHE_NAME = 'manzoma-pwa-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/icon.png',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap'
];

// Install Event - Pre-cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and pre-cached core assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting legacy cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Cache first / network fallback strategy for static assets
self.addEventListener('fetch', (event) => {
  // Only handle HTTP/HTTPS requests (avoid chrome-extension or other schemes)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache, but fetch fresh in the background for cache update (stale-while-revalidate)
          fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          }).catch(() => {/* Ignore network errors during background sync */});
          
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            // Cache newly fetched assets if they are successful static requests
            if (networkResponse.status === 200 && event.request.method === 'GET') {
              const url = new URL(event.request.url);
              const isStaticAsset = url.pathname.includes('/assets/') || 
                                    url.pathname.endsWith('.js') || 
                                    url.pathname.endsWith('.css') || 
                                    url.pathname.endsWith('.png') ||
                                    url.pathname.endsWith('.jpg') ||
                                    url.pathname.endsWith('.svg');
              
              if (isStaticAsset) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseClone);
                });
              }
            }
            return networkResponse;
          })
          .catch(() => {
            // Offline fallback for index.html (client-side routing)
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
          });
      })
  );
});
