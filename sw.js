// Fame the Game 3D — offline support (network first, cache fallback)
const CACHE='fame3d-v8';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'])).catch(()=>{}));});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const u=req.url;if(/youtube|googlevideo|ytimg/.test(u))return;
  if(req.headers.has('range')||/\.mp3($|\?)/.test(u)){e.respondWith(fetch(req).catch(()=>caches.match(req)));return;}
  e.respondWith(fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return r;})
    .catch(()=>caches.match(req).then(m=>m||(req.mode==='navigate'?caches.match('./index.html'):undefined))));
});
