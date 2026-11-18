/* Cookie consent + consent-gated third-party loaders (ES module).
   - Tawk.to chat and analytics only load after the visitor accepts.
   - Choice persists in localStorage; footer "Cookie Settings" reopens the banner.
   - Analytics is OFF until CONFIG.ANALYTICS_PROVIDER + ANALYTICS_ID are set.
   - Vendor loading is delegated to js/third-party.js (single registry). */
import { CONFIG } from './config.js';
import { registerThirdParty, flushConsentGated } from './third-party.js';

(function() {
    'use strict';

    var CONSENT_KEY = CONFIG.KEYS.consent;

    // Register consent-gated vendors once — third-party.js owns the <script> injection.
    registerThirdParty('tawk', { src: CONFIG.TAWK_SRC, consent: true });
    if (CONFIG.ANALYTICS_PROVIDER === 'goatcounter' && CONFIG.ANALYTICS_ID) {
        registerThirdParty('analytics', {
            consent: true,
            src: 'https://gc.zgo.at/count.js',
            attrs: { 'data-goatcounter': CONFIG.ANALYTICS_ID }
        });
    } else if (CONFIG.ANALYTICS_PROVIDER === 'plausible' && CONFIG.ANALYTICS_ID) {
        registerThirdParty('analytics', {
            consent: true,
            src: 'https://plausible.io/js/script.js',
            attrs: { 'data-domain': CONFIG.ANALYTICS_ID }
        });
    }

    var banner = document.getElementById('cookieConsent');
    var acceptBtn = document.getElementById('cookieAccept');
    var declineBtn = document.getElementById('cookieDecline');
    var settingsLink = document.getElementById('cookieSettingsLink');
    var loaded = false;

    function hasConsent() {
        try { return localStorage.getItem(CONSENT_KEY) === 'accepted'; } catch (e) { return false; }
    }

    // Exposed for third-party.js's consent check and any future gated vendor.
    window.YMTConsent = { granted: hasConsent };

    function syncCta() {
        // hide the mobile sticky CTA while the cookie banner is up (they overlap)
        document.body.classList.toggle('cookie-visible', !!(banner && !banner.hidden));
    }

    function onAccept() {
        try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch (e) {}
        banner.hidden = true;
        syncCta();
        if (loaded) { flushConsentGated(); return; }
        loaded = true;
        var idle = window.requestIdleCallback || function(fn) { setTimeout(fn, 1500); };
        idle(flushConsentGated);
    }

    function onDecline() {
        try { localStorage.setItem(CONSENT_KEY, 'declined'); } catch (e) {}
        banner.hidden = true;
        syncCta();
    }

    function showBanner(focus) {
        if (banner) banner.hidden = false;
        syncCta();
        if (focus && acceptBtn) {
            banner.scrollIntoView({ block: 'nearest' });
            acceptBtn.focus();
        }
    }

    if (acceptBtn) acceptBtn.addEventListener('click', onAccept);
    if (declineBtn) declineBtn.addEventListener('click', onDecline);
    if (settingsLink) {
        settingsLink.addEventListener('click', function(e) {
            e.preventDefault();
            try { localStorage.removeItem(CONSENT_KEY); } catch (err) {}
            showBanner(true);
        });
    }

    // Returning visitors with a stored choice: load on accept, stay silent otherwise.
    if (hasConsent()) {
        onAccept();
    } else if (banner) {
        banner.hidden = false;
        syncCta();
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
                var i18n = window.YMTI18n;
                var en = !(i18n && i18n.lang && i18n.lang() === 'id') &&
                    (document.documentElement.lang || 'en') !== 'id';
                hint.textContent = en
                    ? 'Tap the Share button in Safari, then "Add to Home Screen".'
                    : 'Ketuk tombol Share di Safari, lalu "Add to Home Screen".';
                installBtn.parentNode.appendChild(hint);
                setTimeout(function() { if (hint.parentNode) hint.parentNode.removeChild(hint); }, 8000);
            }
        });
    }
})();
