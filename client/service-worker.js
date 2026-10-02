const CACHE_NAME = 'team-static-v3';
const APP_SHELL = [
  '/', '/index.html', '/services.html', '/work.html', '/about.html', '/process.html', '/contact.html', '/start-project.html',
  '/assets/style.css', '/assets/app.js', '/favicon.svg', '/favicon.ico', '/manifest.webmanifest', '/offline.html',
  '/assets/brand/favicon-32x32.png', '/assets/brand/apple-touch-icon.png', '/assets/brand/icon-192.png', '/assets/brand/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE_NAME).then(c => c.put(req, copy)); return res;
    }).catch(async () => (await caches.match(req)) || caches.match('/offline.html')));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    if (res.ok && ['style','script','image','font'].includes(req.destination)) {
      const copy = res.clone(); caches.open(CACHE_NAME).then(c => c.put(req, copy));
    }
    return res;
  })));
});