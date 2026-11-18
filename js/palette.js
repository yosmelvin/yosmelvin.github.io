/* YMT Solution — Ctrl+K / Cmd+K command palette.
   Quick-jump to page sections and portfolio projects. */
(function() {
    'use strict';

    var overlay = document.getElementById('paletteOverlay');
    var input = document.getElementById('paletteInput');
    var list = document.getElementById('paletteList');
    var status = document.getElementById('paletteStatus');
    var cheatsheet = document.getElementById('paletteCheatsheet');
    if (!overlay || !input || !list) return;

    var SECTIONS = [
        { id: 'services', icon: 'fa-cogs', key: 'nav_services' },
        { id: 'process', icon: 'fa-tasks', key: 'process_title' },
        { id: 'skills', icon: 'fa-th-large', key: 'nav_skills' },
        { id: 'portfolio', icon: 'fa-briefcase', key: 'nav_portfolio' },
        { id: 'about', icon: 'fa-info-circle', key: 'nav_about' },
        { id: 'team', icon: 'fa-users', key: 'nav_team' },
        { id: 'faq', icon: 'fa-question-circle', key: 'nav_faq' },
        { id: 'contact', icon: 'fa-envelope', key: 'nav_contact' }
    ];

    var PAGES = [
        { url: 'posts/', icon: 'fa-rss', key: 'nav_blog', kw: 'blog articles posts' },
        { url: 'privacy.html', icon: 'fa-shield', key: 'footer_privacy', kw: 'privacy policy data' },
        { url: 'posts/self-hosting-everything.html', icon: 'fa-newspaper-o', kw: 'self-hosting fonts performance article' },
        { url: 'posts/sahamai-stock-screener.html', icon: 'fa-newspaper-o', kw: 'sahamai stock screener IDX article' },
        { url: 'posts/project-estimator.html', icon: 'fa-newspaper-o', kw: 'estimator leads qualification article' }
    ];
    var POST_TITLES = {
        'posts/self-hosting-everything.html': 'Why we self-host everything',
        'posts/sahamai-stock-screener.html': 'Sahamai: a stock screener built for the Indonesian market',
        'posts/project-estimator.html': 'Qualifying leads without a backend: our project estimator'
    };

    var items = [];
    var active = 0;

    function t(key) {
        return (window.YMTI18n && YMTI18n.t) ? YMTI18n.t(key) : key;
    }

    function buildItems() {
        items = SECTIONS.map(function(s) {
            return { type: 'section', id: s.id, icon: s.icon, label: t(s.key), keywords: s.id };
        });
        (window.YMTProjects || []).forEach(function(p, i) {
            var kw = p.title + ' ' + (p.tech || []).join(' ') + ' ' + (p.cat || '');
            items.push({ type: 'project', index: i, icon: 'fa-folder-open', label: p.title, keywords: kw });
        });
        PAGES.forEach(function(pg) {
            items.push({
                type: 'link', url: pg.url, icon: pg.icon,
                label: pg.key ? t(pg.key) : (POST_TITLES[pg.url] || pg.url),
                keywords: (pg.kw || '') + ' ' + pg.url
            });
        });
    }

    function filtered() {
        var q = input.value.trim().toLowerCase();
        if (!q) return items;
        return items.filter(function(it) {
            return it.label.toLowerCase().indexOf(q) !== -1 || it.keywords.toLowerCase().indexOf(q) !== -1;
        });
    }

    function announce(f) {
        if (!status) return;
        var n = f.length;
        var msg = n === 0 ? (t('palette_empty') || 'No results')
            : n === 1 ? (t('palette_one') || '1 result')
            : n + ' ' + (t('palette_results') || 'results');
        status.textContent = msg;
    }

    function render() {
        var f = filtered();
        if (cheatsheet) cheatsheet.hidden = input.value.trim() !== '';
        active = 0;
        list.innerHTML = '';
        announce(f);
        input.setAttribute('aria-activedescendant', '');
        if (!f.length) {
            var empty = document.createElement('div');
            empty.className = 'palette-empty';
            empty.textContent = t('palette_empty') || 'No results';
            list.appendChild(empty);
            return;
        }
        f.forEach(function(it, i) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'palette-item' + (i === 0 ? ' active' : '');
            b.id = 'palette-opt-' + i;
            b.setAttribute('role', 'option');
            b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            b.innerHTML = '<i class="fa ' + it.icon + '" aria-hidden="true"></i><span></span>';
            b.querySelector('span').textContent = it.label;
            b.addEventListener('click', function() { choose(it); });
            b.addEventListener('mousemove', function() { setActive(i, f); });
            list.appendChild(b);
        });
        if (f.length) input.setAttribute('aria-activedescendant', 'palette-opt-0');
    }

    function setActive(i, f) {
        active = i;
        var els = list.querySelectorAll('.palette-item');
        els.forEach(function(el, j) {
            el.classList.toggle('active', j === i);
            el.setAttribute('aria-selected', j === i ? 'true' : 'false');
        });
        if (els[i]) input.setAttribute('aria-activedescendant', els[i].id);
    }

    function choose(it) {
        close();
        if (it.type === 'link') {
            window.location.href = it.url;
            return;
        }
        if (it.type === 'project') {
            if (window.YMTModal && YMTModal.open) { YMTModal.open(it.index); return; }
            window.location.hash = '#project-' + it.index;
            var card = document.querySelector('[data-project="' + it.index + '"]');
            if (card) card.click();
        } else {
            var el = document.getElementById(it.id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', '#' + it.id);
            }
        }
    }

    var lastFocus = null;

    function open() {
        lastFocus = document.activeElement;
        buildItems();
        input.value = '';
        render();
        overlay.hidden = false;
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(function() { input.focus(); }, 30);
    }

    function close() {
        overlay.classList.remove('open');
        overlay.hidden = true;
        document.body.style.overflow = '';
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener('keydown', function(e) {
        var isK = (e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K');
        var tag = (e.target.tagName || '').toLowerCase();
        var typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
        var isHelp = e.key === '?' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey;
        if (isK || isHelp) { e.preventDefault(); overlay.classList.contains('open') ? close() : open(); return; }
        if (!overlay.classList.contains('open')) return;
        if (e.key === 'Escape') { close(); return; }
        if (e.key === 'Tab') {
            // focus trap: cycle between input and result buttons
            var focusables = [input].concat(Array.prototype.slice.call(list.querySelectorAll('.palette-item')));
            if (!focusables.length) return;
            var idx = focusables.indexOf(document.activeElement);
            e.preventDefault();
            var next = e.shiftKey ? (idx <= 0 ? focusables.length - 1 : idx - 1)
                                  : (idx === focusables.length - 1 ? 0 : idx + 1);
            focusables[next].focus();
            return;
        }
        var f = filtered();
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(active + 1, f.length - 1), f); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(active - 1, 0), f); }
        else if (e.key === 'Enter') { e.preventDefault(); if (f[active]) choose(f[active]); }
    });

    overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });
    input.addEventListener('input', render);
    document.addEventListener('ymt:langchange', function() { if (overlay.classList.contains('open')) { buildItems(); render(); } });
})();
