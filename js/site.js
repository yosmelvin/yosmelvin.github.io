    (function() {
        var U = window.YMTUtils || {};
        window.YMTSay = U.announce || function() {};
        var scrollTopBtn = document.querySelector('.scroll-top');
        var scrollTicking = false;
        window.addEventListener('scroll', function() {
            if (scrollTicking) return;
            scrollTicking = true;
            requestAnimationFrame(function() {
                if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 400);
                scrollTicking = false;
            });
        }, { passive: true });
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Deep-link support: open a project modal via URL hash (#project-3)
        // or query param (?project=3)
        var pmHash = window.location.hash.match(/^#project-(\d+)$/);
        var pmQuery = new URLSearchParams(location.search).get('project');
        var pmIdx = pmHash ? parseInt(pmHash[1], 10)
            : (pmQuery !== null && !isNaN(parseInt(pmQuery, 10)) ? parseInt(pmQuery, 10) : -1);
        if (pmIdx >= 0 && pmIdx < (window.YMTProjects || []).length) {
            if (window.YMTModal && YMTModal.open) { YMTModal.open(pmIdx); }
            else if (window.bootstrap && bootstrap.Modal) {
                bootstrap.Modal.getOrCreateInstance(document.getElementById('projectModal')).show();
            }
        }

        // Recently viewed projects — last 3, shown as quick-jump chips
        var RECENT_MAX = 3;
        var RECENT_KEY = 'ymt_recent';
        var recentWrap = document.getElementById('recentProjects');
        var recentChips = document.getElementById('recentChips');
        var projects = window.YMTProjects || [];

        // Render portfolio cards from projects.js — single source of truth
        // (card metadata lives in each project's `card` field)
        (function renderPortfolioCards() {
            var grid = document.getElementById('portfolioGrid');
            if (!grid || !projects.length) return;
            var i18n = window.YMTI18n;
            function tt(k) { return (i18n && i18n.t) ? i18n.t(k) : k; }
            projects.forEach(function(p, i) {
                var c = p.card || {};
                var item = document.createElement('div');
                item.className = 'col-md-4 col-sm-6 portfolio-item';
                item.setAttribute('data-cat', p.cat || 'web');

                var a = document.createElement('a');
                a.href = '#projectModal';
                a.className = 'portfolio-link';
                a.setAttribute('data-bs-toggle', 'modal');
                a.setAttribute('data-bs-target', '#projectModal');
                a.setAttribute('data-project', i);

                var hov = document.createElement('div');
                hov.className = 'portfolio-hover';
                var hcont = document.createElement('div');
                hcont.className = 'portfolio-hover-content';
                var ic = document.createElement('i');
                ic.className = 'fa fa-plus fa-3x';
                ic.setAttribute('aria-hidden', 'true');
                hcont.appendChild(ic);
                hov.appendChild(hcont);
                a.appendChild(hov);

                var pic = document.createElement('picture');
                var imgPath = c.img || p.img;
                var m = imgPath.match(/^(.*)\.(jpe?g|webp|png)$/i);
                var img = document.createElement('img');
                img.loading = 'lazy';
                img.decoding = 'async';
                img.className = 'img-fluid img-portofolio';
                img.alt = c.alt != null ? c.alt : (p.alt || p.title);
                if (m && !/\.webp$/i.test(imgPath)) {
                    var base = m[1];
                    var src = document.createElement('source');
                    src.setAttribute('srcset', base + '-sm.webp 480w, ' + base + '.webp 1000w');
                    src.setAttribute('sizes', '(max-width: 767px) 100vw, 400px');
                    src.setAttribute('type', 'image/webp');
                    pic.appendChild(src);
                    img.src = base + '-sm.jpg';
                    img.setAttribute('srcset', base + '-sm.jpg 480w, ' + base + '.jpg 1000w');
                    img.setAttribute('sizes', '(max-width: 767px) 100vw, 400px');
                    img.width = 400; img.height = 210;
                } else if (m) {
                    var baseW = m[1];
                    var src2 = document.createElement('source');
                    src2.setAttribute('srcset', baseW + '-sm.webp 480w, ' + imgPath + ' 1000w');
                    src2.setAttribute('sizes', '(max-width: 767px) 100vw, 400px');
                    src2.setAttribute('type', 'image/webp');
                    pic.appendChild(src2);
                    img.src = baseW + '.jpg';
                    img.setAttribute('srcset', baseW + '.jpg 1000w');
                    img.setAttribute('sizes', '(max-width: 767px) 100vw, 400px');
                    img.width = c.w || 1400; img.height = c.h || 560;
                } else {
                    img.src = imgPath;
                }
                pic.appendChild(img);
                a.appendChild(pic);

                if (c.isNew) {
                    var n = document.createElement('span');
                    n.className = 'card-new';
                    n.textContent = 'NEW';
                    a.appendChild(n);
                }
                // category chip for scanability (localized via data-i18n)
                var catChip = document.createElement('span');
                catChip.className = 'card-cat';
                catChip.setAttribute('data-i18n', 'f_' + (p.cat || 'web'));
                catChip.textContent = tt('f_' + (p.cat || 'web'));
                a.appendChild(catChip);

                item.appendChild(a);

                var cap = document.createElement('div');
                cap.className = 'portfolio-caption';
                var h4 = document.createElement('h4');
                h4.textContent = c.title || p.title;
                cap.appendChild(h4);
                var capP = document.createElement('p');
                capP.className = 'text-muted';
                if (c.cap) {
                    capP.setAttribute('data-i18n', c.cap);
                    capP.textContent = tt(c.cap);
                }
                cap.appendChild(capP);
                item.appendChild(cap);
                grid.appendChild(item);
            });
        })();

        function getRecent() {
            try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (e) { return []; }
        }
        function renderRecent() {
            if (!recentWrap || !recentChips) return;
            var list = getRecent().filter(function(i) { return projects[i]; }).slice(0, RECENT_MAX);
            recentChips.innerHTML = '';
            list.forEach(function(i) {
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'recent-chip';
                b.innerHTML = '<i class="fa fa-folder-open" aria-hidden="true"></i><span></span>';
                b.querySelector('span').textContent = projects[i].title;
                b.addEventListener('click', function() {
                    if (window.YMTModal && YMTModal.open) YMTModal.open(i);
                });
                recentChips.appendChild(b);
            });
            recentWrap.hidden = list.length === 0;
        }
        document.addEventListener('ymt:projectview', function(e) {
            var i = e.detail;
            var list = getRecent().filter(function(x) { return x !== i; });
            list.unshift(i);
            try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_MAX))); } catch (err) {}
            renderRecent();
        });
        document.addEventListener('ymt:langchange', renderRecent);
        renderRecent();

        // Project shortlist — star toggles on cards, quote prefill to contact
        var SL_MAX = 6;
        var SL_KEY = 'ymt_shortlist';
        var shortlistBar = document.getElementById('shortlistBar');
        var shortlistChips = document.getElementById('shortlistChips');
        function getShortlist() {
            try { return JSON.parse(localStorage.getItem(SL_KEY) || '[]'); } catch (e) { return []; }
        }
        function setShortlist(list) {
            try { localStorage.setItem(SL_KEY, JSON.stringify(list.slice(0, SL_MAX))); } catch (e) {}
        }
        function slLabel() {
            var i18n = window.YMTI18n;
            return {
                add: i18n && i18n.t ? i18n.t('pf_shortlist_add') : 'Add to shortlist',
                rm: i18n && i18n.t ? i18n.t('pf_shortlist_remove') : 'Remove from shortlist'
            };
        }
        function renderShortlist() {
            if (!shortlistBar || !shortlistChips) return;
            var list = getShortlist().filter(function(i) { return projects[i]; });
            shortlistChips.innerHTML = '';
            list.forEach(function(i) {
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'recent-chip';
                b.innerHTML = '<i class="fa fa-star" aria-hidden="true"></i><span></span>';
                b.querySelector('span').textContent = projects[i].title;
                b.addEventListener('click', function() {
                    setShortlist(getShortlist().filter(function(x) { return x !== i; }));
                    renderShortlist(); syncStars();
                });
                shortlistChips.appendChild(b);
            });
            shortlistBar.hidden = list.length === 0;
        }
        function syncStars() {
            var list = getShortlist();
            document.querySelectorAll('.portfolio-item').forEach(function(item) {
                var link = item.querySelector('[data-project]');
                if (!link) return;
                var idx = parseInt(link.getAttribute('data-project'), 10);
                var star = item.querySelector('.pf-star');
                if (!star) return;
                var on = list.indexOf(idx) !== -1;
                star.classList.toggle('on', on);
                var lb = slLabel();
                star.setAttribute('aria-label', on ? lb.rm : lb.add);
                star.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
        }
        document.querySelectorAll('.portfolio-item').forEach(function(item) {
            var link = item.querySelector('[data-project]');
            if (!link) return;
            var idx = parseInt(link.getAttribute('data-project'), 10);
            var star = document.createElement('button');
            star.type = 'button';
            star.className = 'pf-star';
            star.innerHTML = '<i class="fa fa-star" aria-hidden="true"></i>';
            star.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var list = getShortlist();
                var pos = list.indexOf(idx);
                if (pos === -1) { if (list.length < SL_MAX) list.push(idx); }
                else list.splice(pos, 1);
                setShortlist(list);
                syncStars(); renderShortlist();
            });
            item.appendChild(star);
        });
        var slQuote = document.getElementById('shortlistQuote');
        var slClear = document.getElementById('shortlistClear');
        if (slQuote) slQuote.addEventListener('click', function() {
            var list = getShortlist().filter(function(i) { return projects[i]; });
            if (!list.length) return;
            var i18n = window.YMTI18n;
            var tpl = i18n && i18n.t ? i18n.t('pf_shortlist_msg') : 'Hi, I would like a quote for: {list}';
            var msgEl = document.getElementById('message');
            if (msgEl) msgEl.value = tpl.replace('{list}', list.map(function(i) { return projects[i].title; }).join(', '));
            var c = document.getElementById('contact');
            if (c) c.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(function() { if (msgEl) msgEl.focus(); }, 700);
        });
        if (slClear) slClear.addEventListener('click', function() {
            setShortlist([]); renderShortlist(); syncStars();
        });
        document.addEventListener('ymt:langchange', function() { renderShortlist(); syncStars(); });
        renderShortlist();
        syncStars();

        // Scroll progress bar
        var progress = document.createElement('div');
        progress.className = 'scroll-progress';
        progress.setAttribute('aria-hidden', 'true');
        document.body.appendChild(progress);
        window.addEventListener('scroll', function() {
            var h = document.documentElement;
            var max = h.scrollHeight - h.clientHeight;
            progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
        }, { passive: true });

        // Copy email button — icon injected next to the footer email address
        var emailBtn = document.createElement('button');
        emailBtn.type = 'button';
        emailBtn.className = 'copy-email';
        emailBtn.title = 'ymtsolution@gmail.com';
        emailBtn.innerHTML = '<i class="fa fa-copy" aria-hidden="true"></i>';
        function copyEmailLabel() {
            var i18n = window.YMTI18n;
            emailBtn.setAttribute('aria-label', i18n && i18n.t ? i18n.t('copy_email_aria') : 'Copy email address');
        }
        copyEmailLabel();
        document.addEventListener('ymt:langchange', copyEmailLabel);
        emailBtn.addEventListener('click', function() {
            var email = 'ymtsolution@gmail.com';
            function done(ok) {
                if (U.announceCopy) U.announceCopy(ok);
                if (!ok) return; // don't claim success when the copy failed
                emailBtn.classList.add('copied');
                emailBtn.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
                setTimeout(function() {
                    emailBtn.classList.remove('copied');
                    emailBtn.innerHTML = '<i class="fa fa-copy" aria-hidden="true"></i>';
                }, 1600);
            }
            U.copyText(email).then(done);
        });
        function mountCopyEmail() {
            var emailP = document.querySelector('[data-i18n-html="bottom_email"]');
            if (!emailP || emailP.querySelector('.copy-email')) return;
            emailP.appendChild(document.createTextNode(' '));
            emailP.appendChild(emailBtn);
        }
        mountCopyEmail();
        document.addEventListener('DOMContentLoaded', mountCopyEmail);
        document.addEventListener('ymt:langchange', mountCopyEmail);

        // Fade in images once decoded (pairs with CSS shimmer placeholder)
        document.querySelectorAll('img').forEach(function(img) {
            function markLoaded() { img.classList.add('loaded', 'complete'); }
            if (img.complete && img.naturalWidth > 0) markLoaded();
            else img.addEventListener('load', markLoaded, { once: true });
        });

        // Broken-image fallback: hide gracefully instead of showing alt text/border
        document.querySelectorAll('img').forEach(function(img) {
            if (img.complete && img.naturalWidth === 0) img.classList.add('img-broken');
            img.addEventListener('error', function() { img.classList.add('img-broken'); });
        });

        // Close mobile navbar after clicking a nav link
        document.querySelectorAll('.navbar-nav a.page-scroll').forEach(function(a) {
            a.addEventListener('click', function() {
                var nav = document.getElementById('bs-example-navbar-collapse-1');
                if (nav && nav.classList.contains('show') && window.bootstrap && bootstrap.Collapse) {
                    bootstrap.Collapse.getOrCreateInstance(nav).hide();
                }
            });
        });

        // Smooth-scroll for in-page anchors (was agency.min.js)
        document.querySelectorAll('a.page-scroll').forEach(function(a) {
            a.addEventListener('click', function(e) {
                var href = a.getAttribute('href') || '';
                if (href.charAt(0) !== '#') return;
                var target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
                target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
                if (history.replaceState) { try { history.replaceState(null, '', href); } catch (err) {} }
            });
        });

        // Navbar affix + scrollspy (replaces agency.min.js BS3 helpers)
        var mainNav = document.getElementById('mainNav');
        if (mainNav) {
            var navTicking = false;
            window.addEventListener('scroll', function() {
                if (navTicking) return;
                navTicking = true;
                requestAnimationFrame(function() {
                    mainNav.classList.toggle('affix', window.scrollY > 100);
                    navTicking = false;
                });
            }, { passive: true });
            mainNav.classList.toggle('affix', window.scrollY > 100);
        }
        // scrollspy: highlight the nav link for the section in view
        var spySections = ['services', 'portfolio', 'skills', 'about', 'faq', 'team', 'contact']
            .map(function(id) { return document.getElementById(id); })
            .filter(Boolean);
        var spyLinks = {};
        document.querySelectorAll('.navbar-nav a.page-scroll').forEach(function(a) {
            var href = a.getAttribute('href') || '';
            if (href.charAt(0) === '#') spyLinks[href.slice(1)] = a;
        });
        if (spySections.length && 'IntersectionObserver' in window) {
            var spyObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(en) {
                    if (!en.isIntersecting) return;
                    var link = spyLinks[en.target.id];
                    if (!link) return;
                    document.querySelectorAll('.navbar-nav li').forEach(function(li) {
                        var l = li.querySelector('a.page-scroll');
                        if (l === link) {
                            li.classList.add('active');
                            l.setAttribute('aria-current', 'true');
                        } else {
                            li.classList.remove('active');
                            if (l) l.removeAttribute('aria-current');
                        }
                    });
                });
            }, { rootMargin: '-40% 0px -55% 0px' });
            spySections.forEach(function(sec) { spyObserver.observe(sec); });
        }

        // Mirror scrollspy .active onto aria-current for assistive tech
        var navList = document.querySelector('.navbar-nav');
        if (navList && 'MutationObserver' in window) {
            var navObserver = new MutationObserver(function() {
                navList.querySelectorAll('li').forEach(function(li) {
                    var a = li.querySelector('a.page-scroll');
                    if (a) {
                        if (li.classList.contains('active')) a.setAttribute('aria-current', 'true');
                        else a.removeAttribute('aria-current');
                    }
                });
            });
            navObserver.observe(navList, { attributes: true, attributeFilter: ['class'], subtree: true });
        }

        // Announce language changes to screen readers
        var liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
        document.addEventListener('ymt:langchange', function(e) {
            liveRegion.textContent = e.detail === 'id' ? 'Bahasa Indonesia' : 'English';
        });

        // FAQ accordion
        document.querySelectorAll('.faq-item').forEach(function(item) {
            var q = item.querySelector('.faq-q');
            var a = item.querySelector('.faq-a');
            if (a) a.setAttribute('aria-hidden', 'true');
            q.addEventListener('click', function() {
                var open = item.classList.toggle('open');
                q.setAttribute('aria-expanded', open ? 'true' : 'false');
                if (a) a.setAttribute('aria-hidden', open ? 'false' : 'true');
                document.querySelectorAll('.faq-item.open').forEach(function(o) {
                    if (o !== item) {
                        o.classList.remove('open');
                        o.querySelector('.faq-q').setAttribute('aria-expanded','false');
                        var oa = o.querySelector('.faq-a');
                        if (oa) oa.setAttribute('aria-hidden', 'true');
                    }
                });
            });
        });

        // Project filter chips — with per-category counts
        var $items = document.querySelectorAll('.portfolio-item');
        var filterStatus = document.createElement('div');
        filterStatus.className = 'pf-count';
        filterStatus.setAttribute('role', 'status');
        filterStatus.setAttribute('aria-live', 'polite');
        var filterBar = document.querySelector('.filter-bar');
        var emptyState = document.createElement('div');
        emptyState.className = 'pf-empty';
        emptyState.hidden = true;
        var i18n0 = window.YMTI18n;
        emptyState.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i><p></p><button type="button" class="pf-reset"></button>';
        function syncEmptyLang() {
            var t = function(k){ return (i18n0 && i18n0.t) ? i18n0.t(k) : k; };
            emptyState.querySelector('p').textContent = t('pf_empty');
            emptyState.querySelector('.pf-reset').textContent = t('pf_reset');
        }
        syncEmptyLang();
        document.addEventListener('ymt:langchange', syncEmptyLang);
        if (filterBar) {
            filterBar.parentNode.insertBefore(filterStatus, filterBar.nextSibling);
            filterBar.parentNode.insertBefore(emptyState, filterStatus.nextSibling);
        }
        function filterLabel(f, n) {
            var i18n = window.YMTI18n;
            var cat = i18n && i18n.t ? i18n.t('f_' + f) : f;
            var tpl = i18n && i18n.t ? i18n.t('pf_count') : null;
            if (tpl) return tpl.replace('{n}', n).replace('{cat}', cat || f);
            return n + ' ' + (cat || f);
        }
        var counts = {};
        $items.forEach(function(item) {
            var c = item.getAttribute('data-cat');
            counts[c] = (counts[c] || 0) + 1;
        });
        counts.all = $items.length;
        var activeFilter = 'all';
        var projects = window.YMTProjects || [];

        function itemMatchesSearch(item, q) {
            if (!q) return true;
            var link = item.querySelector('[data-project]');
            var idx = link ? parseInt(link.getAttribute('data-project'), 10) : -1;
            var p = idx >= 0 ? projects[idx] : null;
            var hay = (item.textContent || '') + ' ' + (p ? (p.title + ' ' + (p.tech || []).join(' ') + ' ' + (p.cat || '')) : '');
            return hay.toLowerCase().indexOf(q) !== -1;
        }

        function applyFilters() {
            var q = (document.getElementById('portfolioSearch') || {}).value || '';
            q = q.trim().toLowerCase();
            var shown = 0;
            $items.forEach(function(item) {
                var show = (activeFilter === 'all' || item.getAttribute('data-cat') === activeFilter) && itemMatchesSearch(item, q);
                if (show) shown++;
                if (show) {
                    item.classList.remove('filter-out');
                    item.style.display = '';
                    item.classList.remove('reveal');
                    void item.offsetWidth;
                    item.classList.add('reveal', 'in');
                } else {
                    item.classList.add('filter-out');
                    clearTimeout(item._ft);
                    item._ft = setTimeout(function() {
                        if (item.classList.contains('filter-out')) item.style.display = 'none';
                    }, 280);
                }
            });
            if (filterStatus) filterStatus.textContent = filterLabel(activeFilter, shown);
            if (emptyState) emptyState.hidden = shown !== 0;
            try {
                sessionStorage.setItem('ymt_pf_state', JSON.stringify({
                    f: activeFilter,
                    q: (document.getElementById('portfolioSearch') || {}).value || '',
                    s: sortSel ? sortSel.value : 'default'
                }));
            } catch (e) {}
        }

        // empty-state reset button
        if (emptyState) {
            emptyState.querySelector('.pf-reset').addEventListener('click', function() {
                var si = document.getElementById('portfolioSearch');
                if (si) { si.value = ''; si.dispatchEvent(new Event('input', { bubbles: true })); }
                try { sessionStorage.removeItem('ymt_pf_state'); } catch (e) {}
                if (sortSel) sortSel.value = 'default';
                var allChip = document.querySelector('.filter-chip[data-filter="all"]');
                if (allChip && !allChip.classList.contains('active')) allChip.click();
                else applyFilters();
            });
        }

        document.querySelectorAll('.filter-chip').forEach(function(chip, i) {
            var badge = chip.querySelector('.filter-count');
            if (badge) badge.textContent = counts[chip.getAttribute('data-filter')] || 0;
            chip.style.animationDelay = (i * 60) + 'ms';
            chip.addEventListener('click', function() {
                var f = chip.getAttribute('data-filter');
                activeFilter = f;
                document.querySelectorAll('.filter-chip').forEach(function(c) {
                    var on = c === chip;
                    c.classList.toggle('active', on);
                    c.setAttribute('aria-pressed', on ? 'true' : 'false');
                });
                applyFilters();
            });
        });

        var searchInput = document.getElementById('portfolioSearch');
        var searchClear = document.getElementById('searchClear');
        if (searchInput) {
            var searchTimer = null;
            function syncClear() {
                if (searchClear) searchClear.hidden = !searchInput.value;
            }
            searchInput.addEventListener('input', function() {
                syncClear();
                clearTimeout(searchTimer);
                searchTimer = setTimeout(applyFilters, 160);
            });
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') { searchInput.value = ''; syncClear(); applyFilters(); }
            });
            if (searchClear) {
                searchClear.addEventListener('click', function() {
                    searchInput.value = '';
                    syncClear();
                    applyFilters();
                    searchInput.focus();
                });
            }
            // "/" focuses search from anywhere (unless typing in a field)
            document.addEventListener('keydown', function(e) {
                if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
                var tag = (e.target.tagName || '').toLowerCase();
                if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
                e.preventDefault();
                var pf = document.getElementById('portfolio');
                var inView = pf && pf.getBoundingClientRect().top < window.innerHeight && pf.getBoundingClientRect().bottom > 0;
                if (!inView && pf) pf.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(function() { searchInput.focus(); }, inView ? 50 : 500);
            });
            syncClear();
        }
        // portfolio sort — reorders the grid, then re-applies filters
        var sortSel = document.getElementById('pfSort');
        var originalOrder = Array.prototype.slice.call($items);
        function itemTitle(item) {
            var link = item.querySelector('[data-project]');
            var idx = link ? parseInt(link.getAttribute('data-project'), 10) : -1;
            return idx >= 0 && projects[idx] ? projects[idx].title : (item.textContent || '');
        }
        if (sortSel) {
            sortSel.addEventListener('change', function() {
                var mode = sortSel.value;
                var grid = $items[0] ? $items[0].parentNode : null;
                if (!grid) return;
                var sorted = originalOrder.slice();
                if (mode === 'az' || mode === 'za') {
                    sorted.sort(function(a, b) {
                        var c = itemTitle(a).localeCompare(itemTitle(b));
                        return mode === 'az' ? c : -c;
                    });
                }
                sorted.forEach(function(item) { grid.appendChild(item); });
                applyFilters();
            });
        }
        // restore persisted filter/search/sort + ?cat= deep link
        (function() {
            var st = null;
            try { st = JSON.parse(sessionStorage.getItem('ymt_pf_state') || 'null'); } catch (e) {}
            var VALID_FILTERS = { all: 1, ai: 1, web: 1, mobile: 1, fintech: 1, trading: 1 };
            var catParam = new URLSearchParams(location.search).get('cat');
            if (catParam && VALID_FILTERS[catParam] && document.querySelector('.filter-chip[data-filter="' + catParam + '"]')) {
                st = { f: catParam, q: '', s: 'default' };
            }
            if (st) {
                if (st.f && st.f !== 'all' && VALID_FILTERS[st.f]) {
                    var chip = document.querySelector('.filter-chip[data-filter="' + st.f + '"]');
                    if (chip) chip.click();
                }
                if (st.q && searchInput) {
                    searchInput.value = st.q;
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                if (st.s && sortSel && st.s !== 'default') {
                    sortSel.value = st.s;
                    sortSel.dispatchEvent(new Event('change'));
                }
            }
        })();
        applyFilters();
        document.addEventListener('ymt:langchange', applyFilters);

        // Skills → portfolio cross-link: click a tech card to filter projects by it
        document.querySelectorAll('.skill-card').forEach(function(card) {
            var labelEl = card.querySelector('span');
            var label = labelEl ? labelEl.textContent.trim() : '';
            if (!label) return;
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            var i18n = window.YMTI18n;
            var tip = i18n && i18n.t ? i18n.t('skills_view_projects').replace('{tech}', label) : 'View projects using ' + label;
            card.title = tip;
            card.setAttribute('aria-label', tip);
            function go() {
                if (!searchInput) return;
                var allChip = document.querySelector('.filter-chip[data-filter="all"]');
                if (allChip && !allChip.classList.contains('active')) allChip.click();
                searchInput.value = label;
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                var pf = document.getElementById('portfolio');
                if (pf) pf.scrollIntoView({ behavior: 'smooth' });
            }
            card.addEventListener('click', go);
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); return; }
                // arrow keys move between skill cards inside the same grid
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    var grid = card.closest('.skills-grid');
                    if (!grid) return;
                    var cards = Array.prototype.slice.call(grid.querySelectorAll('.skill-card'));
                    var i = cards.indexOf(card);
                    var step = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1;
                    var next = cards[(i + step + cards.length) % cards.length];
                    if (next) { e.preventDefault(); next.focus(); }
                }
            });
        });

        // Animated stat counters
        document.querySelectorAll('.stats .number').forEach(function(el) {
            var raw = el.textContent.trim();
            var suffix = raw.replace(/[\d.,]/g, '');
            var target = parseInt(raw.replace(/[^\d]/g, ''), 10) || 0;
            var done = false;
            function animate() {
                if (done) return;
                done = true;
                if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    el.textContent = target + suffix;
                    return;
                }
                el.setAttribute('aria-busy', 'true');
                var start = null, dur = 1400;
                function step(ts) {
                    if (!start) start = ts;
                    var p = Math.min((ts - start) / dur, 1);
                    var eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.round(target * eased) + suffix;
                    if (p < 1) requestAnimationFrame(step);
                    else el.removeAttribute('aria-busy');
                }
                requestAnimationFrame(step);
            }
            if ('IntersectionObserver' in window) {
                var cio = new IntersectionObserver(function(entries) {
                    if (entries[0].isIntersecting) { cio.disconnect(); animate(); }
                }, { threshold: 0.4 });
                cio.observe(el);
            } else { animate(); }
        });

        // Scroll-reveal animations
        if ('IntersectionObserver' in window) {
            var revealEls = document.querySelectorAll(
                '#services .row.text-center > div, ' +
                '#services .engage-card, ' +
                '#process .process-step, ' +
                '#skills .skill-card, ' +
                '#portfolio .portfolio-item, ' +
                '#stats .col-md-3, ' +
                '#about .timeline > li, ' +
                '#team .team-member, ' +
                '#faq .faq-item, ' +
                '.clients .row > div, ' +
                '.bottom .row > div, ' +
                '#contact .estimator, ' +
                '#contact form'
            );
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });
            revealEls.forEach(function(el, i) {
                el.classList.add('reveal');
                el.style.transitionDelay = (i % 4) * 90 + 'ms';
                observer.observe(el);
            });
        }

        // Engagement model CTAs — prefill the contact message for context
        document.querySelectorAll('.engage-cta').forEach(function(link) {
            link.addEventListener('click', function() {
                var model = link.getAttribute('data-engage');
                var msg = document.getElementById('message');
                var i18n = window.YMTI18n;
                if (msg && i18n && !msg.value.trim()) {
                    msg.value = i18n.t('engage_msg_' + model) || '';
                }
                setTimeout(function() {
                    if (msg) { msg.focus({ preventScroll: true }); }
                }, 1100);
            });
        });

        // Sticky mobile CTA — hide while the contact section is on screen
        var stickyCta = document.getElementById('stickyCta');
        var contactSec = document.getElementById('contact');
        if (contactSec && 'IntersectionObserver' in window) {
            // lazy-load the contact section's map photo only near the viewport
            var bgObserver = new IntersectionObserver(function(entries) {
                if (entries[0].isIntersecting) {
                    contactSec.classList.add('bg-loaded');
                    bgObserver.disconnect();
                }
            }, { rootMargin: '200px' });
            bgObserver.observe(contactSec);
        }
        if (stickyCta && contactSec && 'IntersectionObserver' in window) {
            new IntersectionObserver(function(entries) {
                stickyCta.classList.toggle('gone', entries[0].isIntersecting);
            }, { threshold: 0.15 }).observe(contactSec);
        }

        // Project estimator quiz — 3 steps, then prefills the contact form
        var est = document.getElementById('estimator');
        if (est) {
            var answers = {};
            var step = 0;
            var steps = est.querySelectorAll('.est-step');
            var nextBtn = document.getElementById('estNext');
            var backBtn = document.getElementById('estBack');
            var resetBtn = document.getElementById('estReset');
            var i18n = window.YMTI18n;

            var dots = document.getElementById('estDots');
            var stepLabel = document.getElementById('estStepLabel');

            function showStep(n) {
                step = n;
                steps.forEach(function(s, i) { s.hidden = i !== n; });
                if (stepLabel && i18n) {
                    stepLabel.textContent = i18n.t('est_step').replace('{n}', n + 1).replace('{total}', steps.length);
                }
                if (dots) {
                    dots.querySelectorAll('span').forEach(function(d, i) {
                        d.classList.toggle('on', i === n);
                    });
                }
                if (backBtn) backBtn.hidden = n === 0;
                // move focus to the new question so keyboard/SR users aren't stranded
                if (est.contains(document.activeElement)) {
                    var q = steps[n].querySelector('.est-q');
                    if (q) {
                        q.setAttribute('tabindex', '-1');
                        q.focus();
                    }
                }
                nextBtn.textContent = n === steps.length - 1
                    ? (i18n ? i18n.t('est_apply') : 'Use this estimate')
                    : (i18n ? i18n.t('est_next') : 'Next →');
                nextBtn.disabled = !answers[steps[n].querySelector('.est-opts').getAttribute('data-group')];
            }

            function optLabel(group, value) {
                var opt = est.querySelector('.est-opts[data-group="' + group + '"] .est-opt[data-value="' + value + '"]');
                return opt ? opt.textContent.trim() : value;
            }

            function pickOpt(opt) {
                var group = opt.closest('.est-opts').getAttribute('data-group');
                answers[group] = opt.getAttribute('data-value');
                opt.closest('.est-opts').querySelectorAll('.est-opt').forEach(function(o) {
                    var on = o === opt;
                    o.classList.toggle('sel', on);
                    o.setAttribute('aria-checked', on ? 'true' : 'false');
                });
                nextBtn.disabled = false;
            }

            // ARIA radio-group pattern: arrows/Home/End move and select within a group
            est.querySelectorAll('.est-opts').forEach(function(group) {
                group.addEventListener('keydown', function(e) {
                    var opts = Array.prototype.slice.call(group.querySelectorAll('.est-opt:not(:disabled)'));
                    var i = opts.indexOf(document.activeElement);
                    if (i < 0 || !opts.length) return;
                    var n = -1;
                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % opts.length;
                    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + opts.length) % opts.length;
                    else if (e.key === 'Home') n = 0;
                    else if (e.key === 'End') n = opts.length - 1;
                    if (n < 0 || n === i) return;
                    e.preventDefault();
                    opts[n].focus();
                    pickOpt(opts[n]);
                });
            });

            est.addEventListener('click', function(e) {
                var opt = e.target.closest('.est-opt');
                if (opt) {
                    pickOpt(opt);
                    return;
                }
                if (e.target.closest('#estReset')) {
                    answers = {}; step = 0;
                    est.querySelectorAll('.est-opt').forEach(function(o) { o.classList.remove('sel'); o.setAttribute('aria-checked', 'false'); });
                    var oldDone = est.querySelector('.est-done');
                    if (oldDone) oldDone.remove();
                    var oldBudget = est.querySelector('.est-budget');
                    if (oldBudget) oldBudget.remove();
                    budgetEl = null;
                    est.querySelectorAll('.est-opt').forEach(function(o) { o.disabled = false; });
                    showStep(0);
                    return;
                }
                if (e.target.closest('#estBack')) {
                    if (step > 0) showStep(step - 1);
                    return;
                }
                if (e.target.closest('#estNext')) {
                    if (step < steps.length - 1) { showStep(step + 1); return; }
                    // final step — build the estimate message
                    var msg = document.getElementById('message');
                    var subj = document.getElementById('subject');
                    var tpl = i18n ? i18n.t('est_msg') : '';
                    var body = tpl
                        .replace('{type}', optLabel('type', answers.type))
                        .replace('{timeline}', optLabel('timeline', answers.timeline))
                        .replace('{team}', optLabel('team', answers.team));
                    if (msg && !msg.value.trim()) msg.value = body;
                    if (subj && answers.type) {
                        var opt = subj.querySelector('option[value="' + answers.type + '"]');
                        if (opt) subj.value = answers.type;
                    }
                    var done = est.querySelector('.est-done');
                    if (!done) {
                        done = document.createElement('p');
                        done.className = 'est-done';
                        est.querySelector('.est-actions').after(done);
                    }
                    done.setAttribute('data-i18n', 'est_done');
                    done.textContent = i18n ? i18n.t('est_done') : 'Estimate ready';
                    renderBudget();
                    // lock the quiz once complete — answers are baked into the estimate
                    est.querySelectorAll('.est-opt').forEach(function(o) { o.disabled = true; });
                    setTimeout(function() {
                        document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
            });

            // Indicative budget tier — static ranges (IDR millions), scaled by timeline
            var BUDGET_BASE = { web: [20, 80], mobile: [30, 120], ai: [60, 300], cloud: [40, 150], security: [50, 250] };
            var BUDGET_MULT = { rush: 1.35, month: 1, quarter: 0.9, flex: 0.8 };
            var budgetEl = null, estCopyBtn = null;
            function renderBudget() {
                if (!budgetEl) {
                    budgetEl = document.createElement('div');
                    budgetEl.className = 'est-budget';
                    var d = est.querySelector('.est-done');
                    if (d) d.after(budgetEl); else est.querySelector('.est-actions').after(budgetEl);
                    estCopyBtn = document.createElement('button');
                    estCopyBtn.type = 'button';
                    estCopyBtn.className = 'est-copy';
                    estCopyBtn.innerHTML = '<i class="fa fa-copy" aria-hidden="true"></i> <span></span>';
                    budgetEl.appendChild(estCopyBtn);
                    estCopyBtn.addEventListener('click', function() {
                        var text = [
                            (i18n ? i18n.t('est_title') : 'Estimate'),
                            i18n ? i18n.t('est_q1') : '' + ': ' + optLabel('type', answers.type),
                            (i18n ? i18n.t('est_q2') : '') + ': ' + optLabel('timeline', answers.timeline),
                            (i18n ? i18n.t('est_q3') : '') + ': ' + optLabel('team', answers.team),
                            budgetEl.querySelector('.est-budget-text') ? budgetEl.querySelector('.est-budget-text').textContent : ''
                        ].filter(Boolean).join('\n');
                        var done = function(ok) {
                            if (!ok) return;
                            var span = estCopyBtn.querySelector('span');
                            var i18n2 = window.YMTI18n;
                            var prev = span.textContent;
                            span.textContent = i18n2 && i18n2.t ? i18n2.t('est_copied') : 'Copied!';
                            setTimeout(function() { span.textContent = prev; }, 1600);
                        };
                        U.copyText(text).then(done);
                    });
                }
                var base = BUDGET_BASE[answers.type], mult = BUDGET_MULT[answers.timeline] || 1;
                if (!base || !i18n) { budgetEl.hidden = true; return; }
                var lo = Math.max(10, Math.round(base[0] * mult / 5) * 5);
                var hi = Math.round(base[1] * mult / 5) * 5;
                var isId = (document.documentElement.lang === 'id');
                var range = 'IDR ' + lo + '–' + hi + (isId ? ' jt' : 'M');
                if (!budgetEl.querySelector('.est-budget-text')) {
                    var tx = document.createElement('span');
                    tx.className = 'est-budget-text';
                    budgetEl.insertBefore(tx, estCopyBtn);
                }
                budgetEl.querySelector('.est-budget-text').textContent = i18n.t('est_budget').replace('{range}', range);
                if (estCopyBtn) {
                    estCopyBtn.querySelector('span').textContent = i18n.t('est_copy');
                    estCopyBtn.setAttribute('aria-label', i18n.t('est_copy'));
                }
                budgetEl.hidden = false;
            }

            // keep labels in sync when the visitor switches language mid-quiz
            document.addEventListener('ymt:langchange', function() {
                showStep(step);
                var done = est.querySelector('.est-done');
                if (done && i18n) done.textContent = i18n.t('est_done');
                if (budgetEl && !budgetEl.hidden) renderBudget();
            });

            showStep(0);
        }
    })();
    