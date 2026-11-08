/* عامل خدمة بسيط لتطبيق «يمن بزنس»: يحفظ الغلاف (الصفحة والأيقونات) فيفتح التطبيق فوراً؛ البيانات كلها من /exec عبر الشبكة دائماً */
const C = 'yemen-v7', SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'icon-maskable-192.png', 'icon-maskable-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))); self.clients.claim(); });
// الشبكة أولاً للغلاف (تحديث فوري)، والمحفوظ عند انقطاعها؛ ما عدا الغلاف لا يُلمس
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const k = r.clone(); caches.open(C).then(c => c.put(e.request, k)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
