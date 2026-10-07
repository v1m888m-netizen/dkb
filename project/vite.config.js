import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [tailwindcss(), {
    name: 'offline-shell',
    generateBundle(_, bundle) {
      const assets = [...new Set(['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', ...Object.keys(bundle).map((name) => `./${name}`)])]
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: `
const CACHE = 'dkb-prototype-${Date.now()}';
const PREFIX = 'dkb-prototype-';
const ASSETS = ${JSON.stringify(assets)};
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (event.request.mode === 'navigate') {
      try { return await fetch(event.request); }
      catch { return await cache.match(new URL('./index.html', self.registration.scope)) || Response.error(); }
    }
    // These are public, immutable same-origin build assets. Ignore the preview
    // server's Vary: Origin header so module requests hit the precached shell.
    return await cache.match(event.request, { ignoreVary: true }) || fetch(event.request);
  })());
});` })
    },
  }],
  test: { environment: 'jsdom', restoreMocks: true },
})
