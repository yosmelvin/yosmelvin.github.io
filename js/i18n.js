/* YMT Solution — EN/ID language switcher (ES module).
   Dictionaries live in js/i18n-dict.js (DICT.site). Elements opt in via
   data-i18n (text), data-i18n-html (innerHTML), data-i18n-ph (placeholder),
   data-i18n-aria / data-i18n-title (attributes).
   Choice persists in localStorage, is mirrored to ?lang= in the URL, and
   syncs across tabs via the storage event. */
import { DICT } from './i18n-dict.js';
import { CONFIG } from './config.js';

const I18N = DICT.site;
const STORAGE_KEY = CONFIG.KEYS.lang;
let currentLang = 'en';

function syncUrl(lang) {
    try {
        var u = new URL(window.location.href);
        u.searchParams.set('lang', lang);
        history.replaceState(null, '', u);
    } catch (e) {}
}

function applyLang(lang) {
    var dict = I18N[lang] || I18N.en;
    lang = I18N[lang] ? lang : 'en';
    currentLang = lang;

    document.documentElement.lang = (lang === 'id') ? 'id' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        if (dict[key] != null) el.textContent = dict[key];
    });

    // allowlist sanitizer: only safe presentational tags (<a>, <span>, <i>, <br>, <strong>, <em>)
    // and safe link protocols (http/https/mailto/tel) survive — the sink can never inject
    // markup or javascript: URLs even if a translation is ever compromised
    var SAFE_TAGS = { A: 1, SPAN: 1, I: 1, BR: 1, STRONG: 1, EM: 1 };
    var SAFE_ATTRS = { A: { href: 1 }, SPAN: { class: 1, 'aria-hidden': 1 }, I: { class: 1, 'aria-hidden': 1 } };
    var SAFE_PROTOCOLS = /^(https?:|mailto:|tel:)/i;
    function safeHtml(v) {
        var doc;
        try {
            doc = new DOMParser().parseFromString(String(v), 'text/html');
        } catch (e) {
            return String(v).replace(/<[^>]*>/g, '');
        }
        function cleanChildren(node) {
            Array.prototype.slice.call(node.childNodes).forEach(function(child) {
                if (child.nodeType === 1) {
                    var tag = child.tagName;
                    if (SAFE_TAGS[tag]) {
                        Array.prototype.slice.call(child.attributes).forEach(function(attr) {
                            var name = attr.name.toLowerCase();
                            var allowed = SAFE_ATTRS[tag] && SAFE_ATTRS[tag][name];
                            if (!allowed) { child.removeAttribute(attr.name); return; }
                            if (name === 'href' && !SAFE_PROTOCOLS.test(attr.value.trim())) {
                                child.removeAttribute(attr.name);
                            }
                        });
                        if (tag === 'A' && !child.getAttribute('href')) {
                            while (child.firstChild) node.insertBefore(child.firstChild, child);
                            node.removeChild(child);
                            return;
                        }
                        cleanChildren(child);
                    } else {
                        // unwrap disallowed tags, keep their text content
                        while (child.firstChild) node.insertBefore(child.firstChild, child);
                        node.removeChild(child);
                    }
                }
            });
        }
        // repeat until no disallowed tags remain — unwrapped children's
        // descendants may themselves need cleaning on the next pass
        var guard = 0;
        do {
            cleanChildren(doc.body);
            var dirty = false;
            Array.prototype.forEach.call(doc.body.querySelectorAll('*'), function(n) {
                if (!SAFE_TAGS[n.tagName]) dirty = true;
            });
        } while (dirty && ++guard < 20);
        return doc.body.innerHTML;
    }
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-html');
        if (dict[key] != null) el.innerHTML = safeHtml(dict[key]);
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-ph');
        if (dict[key] != null) el.setAttribute('placeholder', dict[key]);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-aria');
        if (dict[key] != null) el.setAttribute('aria-label', dict[key]);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-title');
        if (dict[key] != null) el.setAttribute('title', dict[key]);
    });

    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        var on = btn.getAttribute('data-lang') === lang;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    syncUrl(lang);

    document.dispatchEvent(new CustomEvent('ymt:langchange', { detail: lang }));
}

function t(key) {
    var dict = I18N[currentLang] || I18N.en;
    if (dict[key] != null) return dict[key];
    return I18N.en[key] != null ? I18N.en[key] : key;
}

function lang() { return currentLang; }

function init() {
    var saved = 'en';
    try {
        var qp = new URLSearchParams(window.location.search).get('lang');
        if (qp === 'en' || qp === 'id') {
            saved = qp;
            localStorage.setItem(STORAGE_KEY, saved);
        } else {
            saved = localStorage.getItem(STORAGE_KEY) || 'en';
        }
    } catch (e) {}
    applyLang(saved);

    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            applyLang(btn.getAttribute('data-lang'));
        });
    });

    // keep other tabs in sync when the visitor switches language
    window.addEventListener('storage', function(e) {
        if (e.key === STORAGE_KEY && (e.newValue === 'en' || e.newValue === 'id') && e.newValue !== currentLang) {
            applyLang(e.newValue);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Back-compat shim for classic scripts (e.g. sw-register.js toast).
window.YMTI18n = { apply: applyLang, t: t, lang: lang };

export { applyLang, t, lang };
