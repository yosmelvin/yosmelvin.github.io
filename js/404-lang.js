/* 404 page — EN/ID toggle. Dictionaries live in js/i18n-dict.js (DICT.p404). */
import { DICT } from './i18n-dict.js';
import { CONFIG } from './config.js';

(function () {
    'use strict';
    var KEY = CONFIG.KEYS.lang;
    var dict = DICT.p404;
    var lang = 'en';
    try {
        var q = new URLSearchParams(location.search).get('lang');
        if (q === 'en' || q === 'id') { localStorage.setItem(KEY, q); lang = q; }
        else if (localStorage.getItem(KEY) === 'id') lang = 'id';
    } catch (e) {}
    function apply() {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var v = dict[lang] && dict[lang][el.getAttribute('data-i18n')];
            if (v != null) el.textContent = v;
        });
        document.querySelectorAll('.lang-btn').forEach(function (b) {
            var on = b.getAttribute('data-lang') === lang;
            b.classList.toggle('active', on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        try {
            var u = new URL(location.href);
            u.searchParams.set('lang', lang);
            history.replaceState(null, '', u);
        } catch (e) {}
    }
    document.addEventListener('click', function (e) {
        var b = e.target.closest('.lang-btn');
        if (!b) return;
        lang = b.getAttribute('data-lang') === 'id' ? 'id' : 'en';
        try { localStorage.setItem(KEY, lang); } catch (err) {}
        apply();
    });
    window.addEventListener('storage', function (e) {
        if (e.key === KEY && (e.newValue === 'en' || e.newValue === 'id') && e.newValue !== lang) {
            lang = e.newValue;
            apply();
        }
    });
    apply();
})();
