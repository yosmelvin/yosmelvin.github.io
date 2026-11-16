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
            prev: '← Previous',
            next: 'Next →',
            min_read: 'min read',
            crumb_home: 'Home',
            crumb_blog: 'Blog'
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
            prev: '← Sebelumnya',
            next: 'Berikutnya →',
            min_read: 'mnt baca',
            crumb_home: 'Beranda',
            crumb_blog: 'Blog'
        }
    };

    var KEY = 'ymt-lang';
    var lang = (localStorage.getItem(KEY) === 'id') ? 'id' : 'en';
    var docEl = document.documentElement;

    function t(k) { return (dict[lang] && dict[lang][k]) || dict.en[k] || k; }

    function apply() {
        docEl.lang = lang;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            el.textContent = t(el.getAttribute('data-i18n'));
        });
        document.title = t('blog_title') + ' — YMT Solution';
        document.querySelectorAll('.lang-btn').forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-lang') === lang);
        });
    }

    function readingTime() {
        var art = document.querySelector('article');
        if (!art) return;
        var words = art.textContent.trim().split(/\s+/).length;
        var mins = Math.max(1, Math.round(words / 200));
        var el = document.getElementById('readingTime');
        if (el) el.textContent = mins + ' ' + t('min_read');
    }

    document.addEventListener('click', function (e) {
        var b = e.target.closest('.lang-btn');
        if (!b) return;
        lang = b.getAttribute('data-lang') === 'id' ? 'id' : 'en';
        localStorage.setItem(KEY, lang);
        apply();
        readingTime();
    });

    apply();
    readingTime();
})();
