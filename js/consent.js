/* Cookie consent + consent-gated third-party loaders.
   - Tawk.to chat and analytics only load after the visitor accepts.
   - Choice persists in localStorage; footer "Cookie Settings" reopens the banner.
   - Analytics is OFF until ANALYTICS_ID is configured below. */
(function() {
    'use strict';

    var CONSENT_KEY = 'ymt_consent';

    // ── Analytics config ──────────────────────────────────────────────
    // Set ANALYTICS_ID to enable. Supported providers:
    //   'goatcounter' → https://<ID>.goatcounter.com/count
    //   'plausible'   → https://plausible.io/js/script.js (needs data-domain)
    var ANALYTICS_PROVIDER = null; // 'goatcounter' | 'plausible' | null
    var ANALYTICS_ID = '';

    var banner = document.getElementById('cookieConsent');
    var acceptBtn = document.getElementById('cookieAccept');
    var declineBtn = document.getElementById('cookieDecline');
    var settingsLink = document.getElementById('cookieSettingsLink');
    var loaded = false;

    function hasConsent() {
        try { return localStorage.getItem(CONSENT_KEY) === 'accepted'; } catch (e) { return false; }
    }

    function loadTawk() {
        if (window.__tawkLoaded) return;
        window.__tawkLoaded = true;
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();
        var s1 = document.createElement('script');
        var s0 = document.getElementsByTagName('script')[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/58a99879f42d220ab3f5ea31/default';
        s1.charset = 'UTF-8';
        s0.parentNode.insertBefore(s1, s0);
    }

    function loadAnalytics() {
        if (!ANALYTICS_ID || !ANALYTICS_PROVIDER || window.__analyticsLoaded) return;
        window.__analyticsLoaded = true;
        if (ANALYTICS_PROVIDER === 'goatcounter') {
            var s = document.createElement('script');
            s.async = true;
            s.src = 'https://gc.zgo.at/count.js';
            s.setAttribute('data-goatcounter', ANALYTICS_ID);
            document.head.appendChild(s);
        } else if (ANALYTICS_PROVIDER === 'plausible') {
            var p = document.createElement('script');
            p.async = true;
            p.defer = true;
            p.src = 'https://plausible.io/js/script.js';
            p.setAttribute('data-domain', ANALYTICS_ID);
            document.head.appendChild(p);
        }
    }

    function onAccept() {
        try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch (e) {}
        banner.hidden = true;
        if (loaded) return;
        loaded = true;
        var idle = window.requestIdleCallback || function(fn) { setTimeout(fn, 1500); };
        idle(function() { loadTawk(); loadAnalytics(); });
    }

    function onDecline() {
        try { localStorage.setItem(CONSENT_KEY, 'declined'); } catch (e) {}
        banner.hidden = true;
    }

    function showBanner() {
        if (banner) banner.hidden = false;
    }

    if (acceptBtn) acceptBtn.addEventListener('click', onAccept);
    if (declineBtn) declineBtn.addEventListener('click', onDecline);
    if (settingsLink) {
        settingsLink.addEventListener('click', function(e) {
            e.preventDefault();
            try { localStorage.removeItem(CONSENT_KEY); } catch (err) {}
            showBanner();
        });
    }

    // Returning visitors with a stored choice: load on accept, stay silent otherwise.
    if (hasConsent()) {
        onAccept();
    } else if (banner) {
        banner.hidden = false;
    }

    // ── PWA install prompt ────────────────────────────────────────────
    var installBtn = document.getElementById('installAppBtn');
    var deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;
        if (installBtn) installBtn.hidden = false;
    });
    if (installBtn) {
        installBtn.addEventListener('click', function() {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            deferredPrompt.userChoice.finally(function() {
                deferredPrompt = null;
                installBtn.hidden = true;
            });
        });
    }
    window.addEventListener('appinstalled', function() {
        if (installBtn) installBtn.hidden = true;
    });

    // iOS Safari never fires beforeinstallprompt — show manual instructions instead.
    var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    if (isIOS && !isStandalone && installBtn && !deferredPrompt) {
        installBtn.hidden = false;
        installBtn.addEventListener('click', function() {
            var hint = document.getElementById('iosInstallHint');
            if (!hint) {
                hint = document.createElement('div');
                hint.id = 'iosInstallHint';
                hint.className = 'ios-install-hint';
                hint.setAttribute('role', 'note');
                var en = (document.documentElement.lang || 'en') !== 'id';
                hint.textContent = en
                    ? 'Tap the Share button in Safari, then "Add to Home Screen".'
                    : 'Ketuk tombol Share di Safari, lalu "Add to Home Screen".';
                installBtn.parentNode.appendChild(hint);
                setTimeout(function() { if (hint.parentNode) hint.parentNode.removeChild(hint); }, 8000);
            }
        });
    }
})();
