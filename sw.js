// Imam Hussain Community — service worker.
// Network-first for same-origin requests (code/data updates always land when
// online), cache fallback for offline. Audio and external (YouTube) bypass.
const CACHE = "ih-v1";
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

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Only handle our own origin; let audio stream & externals go to network.
  if (url.origin !== location.origin) return;
  if (url.pathname.includes("/dua/audio/")) return;

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
