// ========================================
// ANIR SYSTEM V4 SERVICE WORKER
// ========================================

const CACHE_NAME = "anir-system-v4";

const FILES = [
  "./",
  "./index.html",
  "./anir.css",
  "./anir.js",
  "./manifest.json"
];


// ========================================
// INSTALL
// ========================================

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES))

  );

  self.skipWaiting();

});


// ========================================
// ACTIVATE
// ========================================

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))

      );

    })

  );

  self.clients.claim();

});


// ========================================
// FETCH
// ========================================

self.addEventListener("fetch", event => {

  event.respondWith(

    fetch(event.request)
      .then(response => {

        const copy = response.clone();

        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, copy);
          });

        return response;

      })

      .catch(() => {

        return caches.match(event.request);

      })

  );

});
