/* 404 page — EN/ID toggle (self-contained, no i18n.js dependency) */
(function () {
    'use strict';
    var KEY = 'ymt-lang';
    var dict = {
        en: {
            not_found: 'Page not found',
            missing: "The page you're looking for doesn't exist or has been moved.",
            back: 'Back to Home',
            services: 'Services', portfolio: 'Portfolio', contact: 'Contact'
        },
        id: {
            not_found: 'Halaman tidak ditemukan',
            missing: 'Halaman yang Anda cari tidak ada atau telah dipindahkan.',
            back: 'Kembali ke Beranda',
            services: 'Layanan', portfolio: 'Portofolio', contact: 'Kontak'
        }
    };
    var lang = 'en';
    try {
        var q = new URLSearchParams(location.search).get('lang');
        if (q === 'en' || q === 'id') { localStorage.setItem(KEY, q); }
        else if (localStorage.getItem(KEY) === 'id') lang = 'id';
        if (q === 'id') lang = 'id';
    } catch (e) {}
    function apply() {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            el.textContent = dict[lang][el.getAttribute('data-i18n')];
        });
        document.querySelectorAll('.lang-btn').forEach(function (b) {
            var on = b.getAttribute('data-lang') === lang;
            b.classList.toggle('active', on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }
    document.addEventListener('click', function (e) {
        var b = e.target.closest('.lang-btn');
        if (!b) return;
        lang = b.getAttribute('data-lang') === 'id' ? 'id' : 'en';
        try { localStorage.setItem(KEY, lang); } catch (err) {}
        apply();
    });
    apply();
})();
