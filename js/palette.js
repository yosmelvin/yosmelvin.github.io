/* YMT Solution — Ctrl+K / Cmd+K command palette.
   Quick-jump to page sections and portfolio projects. */
(function() {
    'use strict';

    var overlay = document.getElementById('paletteOverlay');
    var input = document.getElementById('paletteInput');
    var list = document.getElementById('paletteList');
    if (!overlay || !input || !list) return;

    var SECTIONS = [
        { id: 'services', icon: 'fa-cogs', key: 'nav_services' },
        { id: 'skills', icon: 'fa-th-large', key: 'nav_skills' },
        { id: 'portfolio', icon: 'fa-briefcase', key: 'nav_portfolio' },
        { id: 'about', icon: 'fa-info-circle', key: 'nav_about' },
        { id: 'team', icon: 'fa-users', key: 'nav_team' },
        { id: 'faq', icon: 'fa-question-circle', key: 'nav_faq' },
        { id: 'contact', icon: 'fa-envelope', key: 'nav_contact' }
    ];

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
            items.push({ type: 'project', index: i, icon: 'fa-folder-open', label: p.title, keywords: p.title });
        });
    }

    function filtered() {
        var q = input.value.trim().toLowerCase();
        if (!q) return items;
        return items.filter(function(it) {
            return it.label.toLowerCase().indexOf(q) !== -1 || it.keywords.toLowerCase().indexOf(q) !== -1;
        });
    }

    function render() {
        var f = filtered();
        active = 0;
        list.innerHTML = '';
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
            b.setAttribute('role', 'option');
            b.innerHTML = '<i class="fa ' + it.icon + '" aria-hidden="true"></i><span></span>';
            b.querySelector('span').textContent = it.label;
            b.addEventListener('click', function() { choose(it); });
            b.addEventListener('mousemove', function() { setActive(i, f); });
            list.appendChild(b);
        });
    }

    function setActive(i, f) {
        active = i;
        var els = list.querySelectorAll('.palette-item');
        els.forEach(function(el, j) { el.classList.toggle('active', j === i); });
    }

    function choose(it) {
        close();
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

    function open() {
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
    }

    document.addEventListener('keydown', function(e) {
        var isK = (e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K');
        if (isK) { e.preventDefault(); overlay.classList.contains('open') ? close() : open(); return; }
        if (!overlay.classList.contains('open')) return;
        if (e.key === 'Escape') { close(); return; }
        var f = filtered();
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(active + 1, f.length - 1), f); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(active - 1, 0), f); }
        else if (e.key === 'Enter') { e.preventDefault(); if (f[active]) choose(f[active]); }
    });

    overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });
    input.addEventListener('input', render);
    document.addEventListener('ymt:langchange', function() { if (overlay.classList.contains('open')) { buildItems(); render(); } });
})();
