
// Chat widget service worker
const CACHE_VERSION = 'chat-widget-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const OFFLINE_QUEUE_KEY = 'pullse_offline_messages';

// Assets to cache on install
const STATIC_ASSETS = [
  '/chat-widget.css',
  '/chat-widget-standalone.js',
  '/favicon.ico',
  '/placeholder.svg'
];

// Install event - Cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
      .then(() => self.clients.claim())
  );
  return self.clients.claim();
});

// Fetch event - Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip requests to specific endpoints like authentication
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/auth') || url.pathname.includes('login')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response and update cache in background
          // for non-API requests (assets, etc.)
          if (!url.pathname.startsWith('/api/')) {
            fetch(event.request)
              .then((response) => {
                return caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                  });
              });
          }
          return cachedResponse;
        }

        // If not in cache, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Clone the response since it can only be used once
            let responseToCache = response.clone();
            
            // Open dynamic cache and store the response
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch((error) => {
            // If offline and request is for an API endpoint
            if (url.pathname.startsWith('/api/conversations') && url.pathname.includes('/messages')) {
              // Return offline response with warning
              return new Response(JSON.stringify({
                offline: true,
                message: 'You are currently offline. Messages will be sent when you reconnect.'
              }), {
                headers: {'Content-Type': 'application/json'}
              });
            }
            
            // Return generic fallback for other resources
            return caches.match('/placeholder.svg');
          });
      })
  );
});

// Background sync for offline messages
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

// Sync messages from IndexedDB
async function syncMessages() {
  try {
    // Get all clients
    const clients = await self.clients.matchAll();
    
    // Signal clients to perform sync
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_NEEDED'
      });
    });
    
    return true;
  } catch (error) {
    console.error('[Service Worker] Error syncing messages:', error);
    return false;
  }
}

// Listen for push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.message || 'New message received',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification('New Chat Message', options)
    );
  } catch (error) {
    console.error('[Service Worker] Error showing notification:', error);
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({type: 'window'})
      .then((clientList) => {
        const url = event.notification.data.url;
        
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
