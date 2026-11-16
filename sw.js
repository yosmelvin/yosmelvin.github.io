/* Minimal service worker — network-first for pages, cache-first for static assets. */
var CACHE = 'ymt-v2'; // bump on each release to refresh caches
var PRECACHE = ['/', '/index.html', '/css/style.css', '/manifest.json'];

self.addEventListener('install', function(e) {
    e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(PRECACHE); }).then(function() { return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e) {
    e.waitUntil(caches.keys().then(function(keys) {
        return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    }).then(function() { return self.clients.claim(); }));
});

self.addEventListener('fetch', function(e) {
    var url = new URL(e.request.url);
    if (e.request.method !== 'GET' || url.origin !== location.origin) return;

    // HTML: network-first so content stays fresh
    if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
        e.respondWith(fetch(e.request).then(function(res) {
            var copy = res.clone();
            caches.open(CACHE).then(function(c) { c.put(e.request, copy); });
            return res;
        }).catch(function() { return caches.match(e.request).then(function(r) { return r || caches.match('/index.html'); }); }));
        return;
    }

    // Static assets: cache-first
    e.respondWith(caches.match(e.request).then(function(hit) {
        return hit || fetch(e.request).then(function(res) {
            if (res.ok) {
                var copy = res.clone();
                caches.open(CACHE).then(function(c) { c.put(e.request, copy); });
            }
            return res;
        });
    }));
});
