const CACHE_NAME = "phishguard-v3";
const LOCAL_ASSETS = [
  "./",
  "./index.html",
  "./favicon.svg",
  "./manifest.webmanifest",
  "./assets/css/tailwind.css",
  "./assets/css/custom.css",
  "./assets/js/app.js",
  "./assets/js/data.js",
  "./assets/js/scoring.js",
  "./assets/img/hero-phishing-training.webp",
  "./assets/img/hero-phishing-training.png",
  "./assets/img/404-lost-email-transparent.webp",
  "./assets/img/404-lost-email-transparent.png",
  "./assets/img/flags/co.svg",
  "./assets/img/flags/us.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(LOCAL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("phishguard-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(new URL("./index.html", self.location).href)
      )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.status === 200 && response.type !== "error") {
          caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
        }
        return response;
      });
    })
  );
});
