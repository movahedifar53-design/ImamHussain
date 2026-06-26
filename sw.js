// Imam Hussain Community — service worker.
// AUTO-UPDATE: bump VERSION on every deploy. A new VERSION changes this file,
// so installed apps detect the update, activate immediately (skipWaiting), and
// the page auto-reloads (see controllerchange handler in app.js).
// Strategy: network-first for same-origin requests (content is always fresh
// when online), cache fallback for offline. Audio/externals bypass.
const VERSION = "2026-06-26-3";
const CACHE = "ih-" + VERSION;
const CORE = [
  "./", "index.html", "manifest.json",
  "config.js", "css/styles.css",
  "js/app.js", "js/icons.js",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}));
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Allow the page to trigger an immediate activation.
self.addEventListener("message", (e) => {
  if (e.data === "skipWaiting") self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;       // externals/fonts/youtube → network
  if (url.pathname.includes("/dua/audio/")) return; // don't cache big audio

  e.respondWith((async () => {
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.status === 200 && fresh.type === "basic") {
        const c = await caches.open(CACHE);
        c.put(req, fresh.clone());
      }
      return fresh;
    } catch {
      const cached = await caches.match(req);
      if (cached) return cached;
      if (req.mode === "navigate") return caches.match("index.html");
      throw new Error("offline");
    }
  })());
});
