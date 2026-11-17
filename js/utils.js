/* YMT Solution — shared utilities: HTML escaping, clipboard copy, SR announcements.
   Loaded before site.js / project-modal.js / contact_me.js (all defer). */
window.YMTUtils = (function() {
    'use strict';

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // Clipboard with legacy fallback — resolves true only on real success
    function copyText(text) {
        return new Promise(function(resolve) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function() { resolve(true); }, function() {
                    resolve(legacyCopy(text));
                });
                return;
            }
            resolve(legacyCopy(text));
        });
    }

    function legacyCopy(text) {
        try {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'absolute';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            var ok = document.execCommand('copy');
            ta.remove();
            return !!ok;
        } catch (e) {
            return false;
        }
    }

    // Shared polite live region for screen-reader announcements
    var liveRegion = null;
    function liveEl() {
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.className = 'sr-only';
            liveRegion.setAttribute('aria-live', 'polite');
            document.body.appendChild(liveRegion);
        }
        return liveRegion;
    }

    function announce(msg) {
        var el = liveEl();
        el.textContent = '';
        setTimeout(function() { el.textContent = msg; }, 30);
    }

    // Convenience: announce localized copy result
    function announceCopy(ok) {
        var i18n = window.YMTI18n;
        announce(ok ? (i18n && i18n.t ? i18n.t('copy_done') : 'Copied')
                    : (i18n && i18n.t ? i18n.t('copy_fail') : 'Copy failed'));
    }

    return { esc: esc, copyText: copyText, announce: announce, announceCopy: announceCopy };
})();
