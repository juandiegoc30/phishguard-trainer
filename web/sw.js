const PHISHGUARD_CACHE = "phishguard-assets-v2";
const CACHED_ASSETS = [
  "assets/img/404-lost-email-transparent.webp",
  "assets/img/404-lost-email-transparent.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PHISHGUARD_CACHE)
      .then((cache) => cache.addAll(CACHED_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("phishguard-") && key !== PHISHGUARD_CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const shouldCache = CACHED_ASSETS.some((asset) => url.pathname.endsWith(`/${asset}`));

  if (!shouldCache) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
