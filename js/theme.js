/* YMT Solution — Theme controller
   Modes: auto | light | dark  (persisted in localStorage 'ymt_theme')
   Auto = OS prefers-color-scheme OR night window (18:00–06:00 local) → dark.
   Manual choice always wins. Applies data-theme on <html> before paint. */
(function() {
    'use strict';

    var STORAGE_KEY = 'ymt_theme';
    var NIGHT_START = 18, NIGHT_END = 6;
    var modes = ['auto', 'light', 'dark'];
    var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    function saved() {
        try {
            var v = localStorage.getItem(STORAGE_KEY);
            return (v === 'light' || v === 'dark' || v === 'auto') ? v : 'auto';
        } catch (e) { return 'auto'; }
    }

    function isNight() {
        var h = new Date().getHours();
        return h >= NIGHT_START || h < NIGHT_END;
    }

    function osDark() {
        return !!(mq && mq.matches);
    }

    function effective() {
        var mode = saved();
        if (mode === 'dark') return 'dark';
        if (mode === 'light') return 'light';
        return (osDark() || isNight()) ? 'dark' : 'light';
    }

    function apply() {
        var eff = effective();
        document.documentElement.setAttribute('data-theme', eff);
        // set content on ALL theme-color metas — the media-query pair can't
        // express a manual override of the OS preference
        var color = eff === 'dark' ? '#0a0f1e' : '#f6f7fb';
        document.querySelectorAll('meta[name="theme-color"]').forEach(function(m) {
            m.setAttribute('content', color);
        });
        return eff;
    }

    function setMode(mode) {
        try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) {}
        apply();
        updateToggle();
        document.dispatchEvent(new CustomEvent('ymt:themechange', { detail: { mode: mode, effective: effective() } }));
    }

    function cycle() {
        var m = saved();
        setMode(modes[(modes.indexOf(m) + 1) % modes.length]);
    }

    var ICONS = { auto: 'fa-laptop', light: 'fa-sun-o', dark: 'fa-moon-o' };
    var LABELS = {
        en: { auto: 'Auto', light: 'Light', dark: 'Dark', aria: 'Theme: %s', hint_auto: 'Auto (OS + night 18:00–06:00)', hint_light: 'Light theme', hint_dark: 'Dark theme' },
        id: { auto: 'Otomatis', light: 'Terang', dark: 'Gelap', aria: 'Tema: %s', hint_auto: 'Otomatis (OS + malam 18:00–06:00)', hint_light: 'Tema terang', hint_dark: 'Tema gelap' }
    };

    function lang() {
        try { return localStorage.getItem('ymt-lang') === 'id' ? 'id' : 'en'; } catch (e) { return 'en'; }
    }

    function updateToggle() {
        var btn = document.getElementById('themeToggle');
        if (!btn) return;
        var mode = saved();
        var eff = effective();
        var L = LABELS[lang()] || LABELS.en;
        var label = document.getElementById('themeModeLabel');
        if (label) label.textContent = L[mode];
        btn.querySelector('i').className = 'fa ' + (ICONS[mode] || ICONS.auto);
        btn.setAttribute('aria-label', L.aria.replace('%s', L[mode]) + ' — ' + L['hint_' + mode]);
        btn.title = L['hint_' + mode] + (mode === 'auto' ? ' (' + (eff === 'dark' ? 'dark' : 'light') + ')' : '');
        btn.setAttribute('aria-pressed', eff === 'dark' ? 'true' : 'false');
    }

    function init() {
        apply();
        var btn = document.getElementById('themeToggle');
        if (btn) btn.addEventListener('click', function(e) { e.preventDefault(); cycle(); });
        updateToggle();

        // live OS change while in auto mode
        if (mq && mq.addEventListener) {
            mq.addEventListener('change', function() { if (saved() === 'auto') { apply(); updateToggle(); } });
        } else if (mq && mq.addListener) {
            mq.addListener(function() { if (saved() === 'auto') { apply(); updateToggle(); } });
        }
        // re-check clock boundary
        setInterval(function() {
            if (saved() === 'auto') { apply(); updateToggle(); }
        }, 60000);
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && saved() === 'auto') { apply(); updateToggle(); }
        });
        // re-render toggle label on language change
        document.addEventListener('ymt:langchange', updateToggle);
    }

    // apply immediately (before paint)
    apply();

    // Save-Data: strip heavy animations for users on constrained connections
    try {
        var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn && conn.saveData) document.documentElement.classList.add('save-data');
    } catch (e) {}
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.YMTTheme = { mode: saved, effective: effective, set: setMode, cycle: cycle };
})();
