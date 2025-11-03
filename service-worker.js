// PWA service worker (GitHub Pages friendly)
const CACHE_NAME = "minicrm-v2-cache-v2";
const APP_SHELL = ["./index.html","./styles.css","./app.min.js","./manifest.webmanifest"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(()=>{}));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then((resp)=>{
        const clone=resp.clone(); caches.open(CACHE_NAME).then((c)=>c.put("./index.html", clone)).catch(()=>{});
        return resp;
      }).catch(()=>caches.match("./index.html"))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then((cached)=> cached || fetch(req).then((resp)=>{
      const clone=resp.clone(); caches.open(CACHE_NAME).then((c)=>c.put(req, clone)).catch(()=>{});
      return resp;
    }))
  );
});
