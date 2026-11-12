/* Service worker NRG Guitar Club — network-first supaya update selalu terbaru, cache hanya sebagai cadangan offline */
const V='nrg-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(['./','manifest.webmanifest','icon-192.png']).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  const ok=u.origin===self.location.origin||u.hostname==='www.gstatic.com'||u.hostname==='fonts.gstatic.com'||u.hostname==='fonts.googleapis.com';
  if(!ok)return; /* Firestore & Auth tidak pernah di-cache */
  e.respondWith(fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp)).catch(()=>{})}return res}).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('./'):Response.error()))));
});
