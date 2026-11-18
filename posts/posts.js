/* YMT Solution Blog — shared chrome: EN/ID toggle + reading time.
   Usage: add data-i18n="key" to elements; reading time auto-computed from <article>. */
(function () {
    'use strict';

    var dict = {
        en: {
            blog_title: 'Blog',
            blog_h1: 'Insights & Engineering Notes',
            blog_sub: "What we're building, learning and shipping at YMT Solution.",
            blog_empty_h: 'First article coming soon',
            blog_empty_p: "We're preparing our first engineering write-up. Check back shortly.",
            blog_back: 'Back to portfolio',
            blog_all: 'All posts',
            share: 'Share:',
            share_x: 'Share on X',
            share_li: 'Share on LinkedIn',
            share_wa: 'Share on WhatsApp',
            prev: '← Previous',
            next: 'Next →',
            min_read: 'min read',
            toc: 'On this page',
            copy_link: 'Copy link',
            copied: 'Copied',
            copy_failed: 'Copy failed',
            crumb_home: 'Home',
            crumb_blog: 'Blog',
            post1_cat: 'Product',
            post1_title: 'Sahamai: a stock screener built for the Indonesian market',
            post1_excerpt: 'Screening, watchlists and WhatsApp alerts for the IDX — designed around how Indonesian investors actually work.',
            post2_cat: 'Engineering',
            post2_title: 'Why we self-host everything',
            post2_excerpt: "Every font, script, and stylesheet on our portfolio is served from our own origin — here's what that buys us.",
            post3_cat: 'Engineering',
            post3_title: 'Qualifying leads without a backend: our project estimator',
            post3_excerpt: 'How a three-question quiz on a static site turns vague inquiries into structured project briefs.',
            post1_date: '25 Nov 2026',
            post2_date: '18 Nov 2026',
            post3_date: '2 Dec 2026',
            meta_estimator: '2 December 2026 · Engineering',
            meta_sahamai: '25 November 2026 · Product',
            meta_selfhost: '18 November 2026 · Engineering',
            meta_template: '12 February 2026 · Engineering'
        },
        id: {
            blog_title: 'Blog',
            blog_h1: 'Catatan Engineering & Insight',
            blog_sub: 'Apa yang kami bangun, pelajari, dan rilis di YMT Solution.',
            blog_empty_h: 'Artikel pertama segera hadir',
            blog_empty_p: 'Kami sedang menyiapkan tulisan engineering pertama. Pantau kembali segera.',
            blog_back: 'Kembali ke portofolio',
            blog_all: 'Semua artikel',
            share: 'Bagikan:',
            share_x: 'Bagikan di X',
            share_li: 'Bagikan di LinkedIn',
            share_wa: 'Bagikan di WhatsApp',
            prev: '← Sebelumnya',
            next: 'Berikutnya →',
            min_read: 'mnt baca',
            toc: 'Di halaman ini',
            copy_link: 'Salin tautan',
            copied: 'Tersalin',
            copy_failed: 'Gagal menyalin',
            crumb_home: 'Beranda',
            crumb_blog: 'Blog',
            post1_cat: 'Produk',
            post1_title: 'Sahamai: screener saham untuk pasar Indonesia',
            post1_excerpt: 'Screener, watchlist, dan notifikasi WhatsApp untuk BEI — dirancang mengikuti cara investor Indonesia bekerja.',
            post2_cat: 'Engineering',
            post2_title: 'Kenapa kami self-host semuanya',
            post2_excerpt: 'Setiap font, skrip, dan stylesheet portofolio kami dilayani dari origin sendiri — ini yang kami dapatkan.',
            post3_cat: 'Engineering',
            post3_title: 'Kualifikasi lead tanpa backend: estimator proyek kami',
            post3_excerpt: 'Bagaimana kuis tiga pertanyaan di situs statis mengubah pertanyaan samar menjadi brief terstruktur.',
            post1_date: '25 Nov 2026',
            post2_date: '18 Nov 2026',
            post3_date: '2 Des 2026',
            meta_estimator: '2 Desember 2026 · Engineering',
            meta_sahamai: '25 November 2026 · Produk',
            meta_selfhost: '18 November 2026 · Engineering',
            meta_template: '12 Februari 2026 · Engineering'
        }
    };

    var KEY = 'ymt-lang';
    // ?lang=en|id deep link overrides the stored preference
    try {
        var q = new URLSearchParams(location.search).get('lang');
        if (q === 'en' || q === 'id') { localStorage.setItem(KEY, q); }
    } catch (e) {}
    var lang = (localStorage.getItem(KEY) === 'id') ? 'id' : 'en';
    var docEl = document.documentElement;

    function t(k) { return (dict[lang] && dict[lang][k]) || dict.en[k] || k; }

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
        // only retitle the listing page — article pages keep their own <title>
        if (!document.querySelector('article')) {
            document.title = t('blog_title') + ' — YMT Solution';
        }
        document.querySelectorAll('.lang-btn').forEach(function (b) {
            var on = b.getAttribute('data-lang') === lang;
            b.classList.toggle('active', on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
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
        bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0;z-index:9999;background:linear-gradient(90deg,#22d3ee,#6366f1)';
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

    apply();
    readingTime();
    buildToc();
    copyLink();
    progressBar();
})();
