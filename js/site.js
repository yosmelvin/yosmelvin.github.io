    (function($) {
        var $scrollTop = $('.scroll-top');
        $(window).on('scroll', function() {
            $scrollTop.toggleClass('show', $(this).scrollTop() > 400);
        });
        $scrollTop.on('click', function(e) {
            e.preventDefault();
            $('html, body').stop().animate({scrollTop: 0}, 600, 'easeInOutExpo');
        });

        // Deep-link support: open a project modal via URL hash (#project-3)
        // or query param (?project=3)
        var pmHash = window.location.hash.match(/^#project-(\d+)$/);
        var pmQuery = new URLSearchParams(location.search).get('project');
        var pmIdx = pmHash ? parseInt(pmHash[1], 10)
            : (pmQuery !== null && !isNaN(parseInt(pmQuery, 10)) ? parseInt(pmQuery, 10) : -1);
        if (pmIdx >= 0 && pmIdx < (window.YMTProjects || []).length) {
            if (window.YMTModal && YMTModal.open) { YMTModal.open(pmIdx); }
            else { $('#projectModal').modal('show'); }
        }

        // Recently viewed projects — last 3, shown as quick-jump chips
        var RECENT_KEY = 'ymt_recent';
        var recentWrap = document.getElementById('recentProjects');
        var recentChips = document.getElementById('recentChips');
        var projects = window.YMTProjects || [];
        function getRecent() {
            try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (e) { return []; }
        }
        function renderRecent() {
            if (!recentWrap || !recentChips) return;
            var list = getRecent().filter(function(i) { return projects[i]; }).slice(0, 3);
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
            try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 3))); } catch (err) {}
            renderRecent();
        });
        document.addEventListener('ymt:langchange', renderRecent);
        renderRecent();

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
            function fallbackCopy() {
                var ta = document.createElement('textarea');
                ta.value = email; document.body.appendChild(ta); ta.select();
                var ok = false;
                try { ok = document.execCommand('copy'); } catch (e) {}
                document.body.removeChild(ta);
                return ok;
            }
            function done(ok) {
                if (!ok) return; // don't claim success when the copy failed
                emailBtn.classList.add('copied');
                emailBtn.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
                setTimeout(function() {
                    emailBtn.classList.remove('copied');
                    emailBtn.innerHTML = '<i class="fa fa-copy" aria-hidden="true"></i>';
                }, 1600);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(function() { done(true); }, function() { done(fallbackCopy()); });
            } else {
                done(fallbackCopy());
            }
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

        // Broken-image fallback: hide gracefully instead of showing alt text/border
        document.querySelectorAll('img').forEach(function(img) {
            if (img.complete && img.naturalWidth === 0) img.classList.add('img-broken');
            img.addEventListener('error', function() { img.classList.add('img-broken'); });
        });

        // Close mobile navbar after clicking a nav link
        document.querySelectorAll('.navbar-nav a.page-scroll').forEach(function(a) {
            a.addEventListener('click', function() {
                var nav = document.getElementById('bs-example-navbar-collapse-1');
                if (nav && nav.classList.contains('in') && window.jQuery) {
                    jQuery(nav).collapse('hide');
                }
            });
        });

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
            q.addEventListener('click', function() {
                var open = item.classList.toggle('open');
                q.setAttribute('aria-expanded', open ? 'true' : 'false');
                document.querySelectorAll('.faq-item.open').forEach(function(o) {
                    if (o !== item) { o.classList.remove('open'); o.querySelector('.faq-q').setAttribute('aria-expanded','false'); }
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
        }

        // empty-state reset button
        if (emptyState) {
            emptyState.querySelector('.pf-reset').addEventListener('click', function() {
                var si = document.getElementById('portfolioSearch');
                if (si) { si.value = ''; si.dispatchEvent(new Event('input', { bubbles: true })); }
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
        applyFilters();

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
                var start = null, dur = 1400;
                function step(ts) {
                    if (!start) start = ts;
                    var p = Math.min((ts - start) / dur, 1);
                    var eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.round(target * eased) + suffix;
                    if (p < 1) requestAnimationFrame(step);
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
                nextBtn.textContent = n === steps.length - 1
                    ? (i18n ? i18n.t('est_apply') : 'Use this estimate')
                    : (i18n ? i18n.t('est_next') : 'Next →');
                nextBtn.disabled = !answers[steps[n].querySelector('.est-opts').getAttribute('data-group')];
            }

            function optLabel(group, value) {
                var opt = est.querySelector('.est-opts[data-group="' + group + '"] .est-opt[data-value="' + value + '"]');
                return opt ? opt.textContent.trim() : value;
            }

            est.addEventListener('click', function(e) {
                var opt = e.target.closest('.est-opt');
                if (opt) {
                    var group = opt.closest('.est-opts').getAttribute('data-group');
                    answers[group] = opt.getAttribute('data-value');
                    opt.closest('.est-opts').querySelectorAll('.est-opt').forEach(function(o) { o.classList.remove('sel'); });
                    opt.classList.add('sel');
                    nextBtn.disabled = false;
                    return;
                }
                if (e.target.closest('#estReset')) {
                    answers = {}; step = 0;
                    est.querySelectorAll('.est-opt').forEach(function(o) { o.classList.remove('sel'); });
                    var oldDone = est.querySelector('.est-done');
                    if (oldDone) oldDone.remove();
                    var oldBudget = est.querySelector('.est-budget');
                    if (oldBudget) oldBudget.remove();
                    budgetEl = null;
                    showStep(0);
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
                    setTimeout(function() {
                        document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
            });

            // Indicative budget tier — static ranges (IDR millions), scaled by timeline
            var BUDGET_BASE = { web: [20, 80], mobile: [30, 120], ai: [60, 300], cloud: [40, 150], security: [50, 250] };
            var BUDGET_MULT = { rush: 1.35, month: 1, quarter: 0.9, flex: 0.8 };
            var budgetEl = null;
            function renderBudget() {
                if (!budgetEl) {
                    budgetEl = document.createElement('p');
                    budgetEl.className = 'est-budget';
                    var d = est.querySelector('.est-done');
                    if (d) d.after(budgetEl); else est.querySelector('.est-actions').after(budgetEl);
                }
                var base = BUDGET_BASE[answers.type], mult = BUDGET_MULT[answers.timeline] || 1;
                if (!base || !i18n) { budgetEl.hidden = true; return; }
                var lo = Math.max(10, Math.round(base[0] * mult / 5) * 5);
                var hi = Math.round(base[1] * mult / 5) * 5;
                var isId = (document.documentElement.lang === 'id');
                var range = 'IDR ' + lo + '–' + hi + (isId ? ' jt' : 'M');
                budgetEl.textContent = i18n.t('est_budget').replace('{range}', range);
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
    })(jQuery);
    