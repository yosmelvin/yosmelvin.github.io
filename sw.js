/* Minimal service worker — network-first for pages, cache-first for static assets. */
var CACHE = 'ymt-v26'; // bump on each release to refresh caches
var PRECACHE = [
    '/',
    '/index.html',
    '/privacy.html',
    '/posts/',
    '/posts/posts.js',
    '/posts/self-hosting-everything.html',
    '/posts/sahamai-stock-screener.html',
    '/posts/project-estimator.html',
    '/offline.html',
    '/rss.xml',
    '/css/style.css',
    '/fonts/fonts.css',
    '/js/utils.js',
    '/js/i18n.js',
    '/js/projects.js',
    '/js/project-modal.js',
    '/js/site.js',
    '/js/palette.js',
    '/js/theme.js',
    '/js/consent.js',
    '/js/contact_me.js',
    '/js/sw-register.js',
    '/js/maps-loader.js',
    '/js/privacy-lang.js',
    '/js/404-lang.js',
    '/js/offline-lang.js',
    '/manifest.json',
    '/img/header-bg.webp',
    '/img/map-image.webp',
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
    '/fonts/xMQ9uFFYT72X5wkB_18qmnndmSdSnh2BAfO5mnuyOo1lfiQwWa-xo6eeI7fM.woff2',
    '/vendor/bootstrap.bundle.min.js',
    '/vendor/bootstrap.min.css',
    '/vendor/font-awesome.min.css',
    '/vendor/v4-shims.min.css',
    '/vendor/webfonts/fa-solid-900.woff2',
    '/vendor/webfonts/fa-regular-400.woff2',
    '/vendor/webfonts/fa-brands-400.woff2',
    '/vendor/webfonts/fa-v4compatibility.woff2',
    '/img/portfolio/inklo-1-sm.webp',
    '/img/portfolio/inklo-1.webp',
    '/img/portfolio/inklo-1-sm.jpg',
    '/img/portfolio/inklo-1.jpg'
];

self.addEventListener('install', function(e) {
    e.waitUntil(caches.open(CACHE).then(function(c) {
        // per-asset caching: one missing file must not fail the whole install
        return Promise.allSettled(PRECACHE.map(function(u) {
            return c.add(new Request(u, { cache: 'reload' })).catch(function(err) {
                console.warn('[sw] precache failed:', u, err);
            });
        }));
    }).then(function() { return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
        }).then(function() { return self.clients.claim(); })
        .then(function() {
            if (self.registration.navigationPreload) return self.registration.navigationPreload.enable();
        })
    );
});

self.addEventListener('fetch', function(e) {
    var url = new URL(e.request.url);
    if (e.request.method !== 'GET' || url.origin !== location.origin) return;
    // never intercept the worker itself or anything looking like an API call
    if (url.pathname === '/sw.js' || url.pathname.indexOf('/api/') === 0) return;

    // HTML: network-first so content stays fresh
    if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
        e.respondWith(fetch(e.request).then(function(res) {
            if (res.ok) {
                var copy = res.clone();
                caches.open(CACHE).then(function(c) { c.put(e.request, copy); });
            }
            return res;
        }).catch(function() {
            return caches.match(e.request).then(function(r) {
                if (r) return r;
                return caches.match('/offline.html');
            });
        }));
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
