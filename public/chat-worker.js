
// This is a minimal service worker for the chat widget
self.addEventListener('install', (event) => {
  console.log('Chat widget service worker installing');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Chat widget service worker activating');
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Just pass through fetch events
  return;
});
