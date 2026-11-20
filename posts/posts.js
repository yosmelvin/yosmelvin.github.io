/* YMT Solution Blog — shared chrome: EN/ID toggle + reading time (ES module).
   Dictionaries live in ../js/i18n-dict.js (DICT.blog). Usage: add
   data-i18n="key" to elements; reading time auto-computed from <article>. */
import { DICT } from '../js/i18n-dict.js';
import { CONFIG } from '../js/config.js';

const dict = DICT.blog;
const KEY = CONFIG.KEYS.lang;

// ?lang=en|id deep link overrides the stored preference
try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'id') { localStorage.setItem(KEY, q); }
} catch (e) {}
let lang = (localStorage.getItem(KEY) === 'id') ? 'id' : 'en';
const docEl = document.documentElement;

function t(k) { return (dict[lang] && dict[lang][k]) || dict.en[k] || k; }

function syncUrl() {
    try {
        const u = new URL(location.href);
        u.searchParams.set('lang', lang);
        history.replaceState(null, '', u);
    } catch (e) {}
}

// articles may carry parallel EN/ID blocks — only the active one counts
function scope() {
    if (document.querySelector('article [data-lang-block]')) {
        return document.querySelector('article [data-lang-block="' + lang + '"]')
            || document.querySelector('article [data-lang-block="en"]');
    }
    return document.querySelector('article');
}

function apply() {
    docEl.lang = lang;
    document.querySelectorAll('[data-lang-block]').forEach(function (el) {
        el.hidden = el.getAttribute('data-lang-block') !== lang;
    });
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
        el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    // only retitle the listing page — article pages keep their own <title>
    if (!document.querySelector('article')) {
        document.title = t('blog_title') + ' — YMT Solution';
    }
    document.querySelectorAll('.lang-btn').forEach(function (b) {
        var on = b.getAttribute('data-lang') === lang;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    syncUrl();
}

function readingTime() {
    var art = scope();
    if (!art) return;
    var words = art.textContent.trim().split(/\s+/).length;
    var mins = Math.max(1, Math.round(words / 200));
    var el = document.getElementById('readingTime');
    if (el) el.textContent = mins + ' ' + t('min_read');
}

// auto TOC from article h2/h3
function buildToc() {
    var art = scope();
    var hero = document.querySelector('.hero');
    if (!art || !hero || document.getElementById('toc')) return;
    var heads = art.querySelectorAll('h2, h3');
    if (heads.length < 2) return;
    var nav = document.createElement('nav');
    nav.id = 'toc';
    nav.setAttribute('aria-label', t('toc'));
    var list = document.createElement('ul');
    heads.forEach(function(h, i) {
        if (!h.id) h.id = 'toc-' + lang + '-' + (i + 1);
        var li = document.createElement('li');
        li.className = h.tagName.toLowerCase() === 'h3' ? 'toc-h3' : '';
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        list.appendChild(li);
    });
    var title = document.createElement('p');
    title.className = 'toc-title';
    title.textContent = t('toc');
    nav.appendChild(title);
    nav.appendChild(list);
    hero.parentNode.insertBefore(nav, hero.nextSibling);
}

// copy-link button in share row
function copyLink() {
    var btn = document.querySelector('.share .share-copy');
    if (!btn) return;
    btn.addEventListener('click', function() {
        var url = location.href.split('#')[0];
        function ok() { btn.textContent = t('copied'); setTimeout(function() { btn.textContent = t('copy_link'); }, 1600); }
        function fail() { btn.textContent = t('copy_failed'); setTimeout(function() { btn.textContent = t('copy_link'); }, 1600); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(ok, fail);
        } else {
            var ta = document.createElement('textarea');
            ta.value = url; document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy') ? ok() : fail(); } catch (e) { fail(); }
            ta.remove();
        }
    });
}

// reading-progress bar on article pages
function progressBar() {
    if (!document.querySelector('article') || document.getElementById('readProgress')) return;
    var bar = document.createElement('div');
    bar.id = 'readProgress';
    bar.setAttribute('aria-hidden', 'true');
    bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0;z-index:9999;background:linear-gradient(90deg,#a5b4fc,#6366f1)';
    document.body.appendChild(bar);
    function upd() {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', upd, { passive: true });
    upd();
}

document.addEventListener('click', function (e) {
    var b = e.target.closest('.lang-btn');
    if (!b) return;
    lang = b.getAttribute('data-lang') === 'id' ? 'id' : 'en';
    localStorage.setItem(KEY, lang);
    apply();
    readingTime();
    var oldToc = document.getElementById('toc');
    if (oldToc) oldToc.remove();
    buildToc();
});

// keep other tabs in sync when the visitor switches language
window.addEventListener('storage', function(e) {
    if (e.key === KEY && (e.newValue === 'en' || e.newValue === 'id') && e.newValue !== lang) {
        lang = e.newValue;
        apply();
        readingTime();
        var oldToc = document.getElementById('toc');
        if (oldToc) oldToc.remove();
        buildToc();
    }
});

apply();
readingTime();
buildToc();
copyLink();
progressBar();
