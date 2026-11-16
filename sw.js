/* Minimal service worker — network-first for pages, cache-first for static assets. */
var CACHE = 'ymt-v6'; // bump on each release to refresh caches
var PRECACHE = [
    '/',
    '/index.html',
    '/privacy.html',
    '/posts/',
    '/posts/posts.js',
    '/rss.xml',
    '/css/style.css',
    '/css/agency.min.css',
    '/fonts/fonts.css',
    '/js/i18n.js',
    '/js/projects.js',
    '/js/project-modal.js',
    '/js/site.js',
    '/js/palette.js',
    '/js/theme.js',
    '/js/consent.js',
    '/js/contact_me.js',
    '/manifest.json',
    '/img/header-bg.jpg',
    '/img/portfolio/sahamai-1-sm.jpg',
    '/img/portfolio/osppay-1-sm.jpg',
    '/img/portfolio/robo-trading-hub-sm.webp',
    '/img/pwa/icon-192.png',
    '/img/pwa/icon-512.png',
    '/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7W0Q5n-wU.woff2',
    '/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2',
    '/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1pL7W0Q5n-wU.woff2',
    '/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7W0Q5n-wU.woff2',
    '/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7W0Q5n-wU.woff2',
    '/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2ZL7W0Q5n-wU.woff2',
    '/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2pL7W0Q5n-wU.woff2',
    '/fonts/xMQ9uFFYT72X5wkB_18qmnndmSdSnh2BAfO5mnuyOo1lfiQwV6-xo6eeIw.woff2',
    '/fonts/xMQ9uFFYT72X5wkB_18qmnndmSdSnh2BAfO5mnuyOo1lfiQwWa-xo6eeI7fM.woff2'
];

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
    // never intercept the worker itself or anything looking like an API call
    if (url.pathname === '/sw.js' || url.pathname.indexOf('/api/') === 0) return;

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
