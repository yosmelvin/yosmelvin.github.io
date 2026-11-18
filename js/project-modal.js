/* Single reusable project modal — populates #projectModal from
   window.YMTProjects + the active language dictionary (YMTI18n.t). */
(function() {
    'use strict';

    var U = window.YMTUtils || {};
    var projects = window.YMTProjects || [];
    var current = 0;
    var modalEl = document.getElementById('projectModal');
    function modalApi() {
        return (window.bootstrap && bootstrap.Modal)
            ? bootstrap.Modal.getOrCreateInstance(modalEl) : null;
    }
    function modalShown() { return modalEl.classList.contains('show'); }
    function $(id) { return document.getElementById(id); }
    function el(sel) { return modalEl.querySelector(sel); }
    var lastTrigger = null;
    var openIndex = null; // explicit index for programmatic opens (palette) — beats stale hash
    var baseTitle = document.title;
    var preModalHash = ''; // section anchor to restore when the modal closes

    function t(key) {
        return (window.YMTI18n && YMTI18n.t) ? YMTI18n.t(key) : key;
    }

    function pad(n) {
        return (n < 10 ? '0' : '') + n;
    }

    function chip(cls, text) {
        var s = document.createElement('span');
        s.className = cls;
        s.textContent = text;
        return s;
    }

    function render(i, animate) {
        var p = projects[i];
        if (!p) return;
        current = i;

        // keep the URL hash in sync while the modal is open (refresh/back share
        // the same project); the opening entry is pushed in show.bs.modal
        if (modalShown()) {
            try { history.replaceState(null, '', '#project-' + i); } catch (e) {}
        }
        document.title = p.title + ' — YMT Solution';
        document.dispatchEvent(new CustomEvent('ymt:projectview', { detail: i }));

        var hero = el('.pm-hero');
        hero.classList.toggle('pm-hero-logo', !!p.logo);
        var img = $('pmImg');
        img.classList.remove('img-broken');
        img.src = p.img;
        img.alt = p.alt || p.title;
        img.decoding = 'async';
        // every project ships WebP + JPG variants — serve WebP via <picture>
        var m = p.img.match(/^(.*)\.(jpe?g|webp|png)$/i);
        var webpSrc = $('pmWebpSrc');
        if (m) {
            var base = m[1];
            var isWebpProject = /\.webp$/i.test(p.img);
            webpSrc.setAttribute('srcset', base + '-sm.webp 480w, ' + base + '.webp 1000w');
            if (/\.(jpe?g|webp)$/i.test(p.img)) {
                img.setAttribute('srcset', isWebpProject
                    ? base + '.jpg 1000w'
                    : base + '-sm.jpg 480w, ' + p.img + ' 1000w');
                img.setAttribute('sizes', '(max-width: 860px) 100vw, 810px');
                if (isWebpProject) img.src = base + '.jpg';
            } else {
                img.removeAttribute('srcset');
                img.removeAttribute('sizes');
            }
        } else {
            webpSrc.removeAttribute('srcset');
            img.removeAttribute('srcset');
            img.removeAttribute('sizes');
        }
        $('pmTitle').textContent = p.title;
        $('pmIntro').textContent = t(p.keys.intro);
        $('pmText').innerHTML = t(p.keys.body);
        $('pmCounter').textContent = pad(i + 1) + ' / ' + pad(projects.length);

        // category chip in hero (only projects that define one)
        var cat = $('pmCat');
        if (p.meta && p.meta.cat) {
            cat.textContent = t(p.meta.cat);
            cat.style.display = '';
        } else {
            cat.style.display = 'none';
        }

        // meta chips
        var meta = $('pmMeta');
        meta.textContent = '';
        if (p.meta) {
            ['date', 'client'].forEach(function(field) {
                if (p.meta[field]) meta.appendChild(chip('pm-chip', t(p.meta[field])));
            });
        }
        meta.style.display = meta.children.length ? '' : 'none';

        // unified badges (vvip / live / nda)
        var badgeTypes = p.badges || (p.exclusive ? ['vvip'] : []);
        var badges = $('pmBadges');
        badges.textContent = '';
        badgeTypes.forEach(function(b) {
            badges.appendChild(chip('pm-badge-static pm-badge-' + b, t('badge_' + b)));
        });
        badges.hidden = badgeTypes.length === 0;

        // visit button
        var visit = $('pmVisit');
        if (p.link) {
            visit.href = p.link;
            visit.hidden = false;
        } else {
            visit.hidden = true;
        }

        // tech stack chips
        var tech = $('pmTech');
        tech.textContent = '';
        if (p.tech && p.tech.length) {
            tech.appendChild(chip('pm-tech-label', t('pm_tech')));
            p.tech.forEach(function(tk) {
                tech.appendChild(chip('pm-chip pm-chip-tech', tk));
            });
            tech.hidden = false;
        } else {
            tech.hidden = true;
        }

        // gallery thumbnails + lightbox (only when extra images provided)
        var gallery = p.gallery || [];
        var gal = $('pmGallery');
        gal.textContent = '';
        if (gallery.length) {
            gallery.forEach(function(src, gi) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'pm-thumb';
                var gimg = document.createElement('img');
                gimg.loading = 'lazy';
                gimg.decoding = 'async';
                gimg.src = src;
                gimg.alt = p.alt || p.title;
                btn.appendChild(gimg);
                btn.addEventListener('click', function() { openLightbox(gi); });
                gal.appendChild(btn);
            });
            gal.hidden = false;
        } else {
            gal.hidden = true;
        }

        // share links — deep link to this project
        var shareUrl = location.origin + location.pathname + '#project-' + i;
        var shareText = encodeURIComponent(p.title + ' | YMT Solution');
        var shareUrlEnc = encodeURIComponent(shareUrl);
        $('pmShareX').href = 'https://twitter.com/intent/tweet?url=' + shareUrlEnc + '&text=' + shareText;
        $('pmShareLi').href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + shareUrlEnc;
        $('pmShareWa').href = 'https://wa.me/?text=' + shareText + '%20' + shareUrlEnc;
        $('pmShareCopy')._shareUrl = shareUrl;
        // native share sheet when available (mobile)
        var nativeBtn = $('pmShareNative');
        if (navigator.share) {
            nativeBtn.hidden = false;
            nativeBtn.onclick = function() {
                navigator.share({ title: p.title + ' | YMT Solution', text: p.title, url: shareUrl }).catch(function() {});
            };
        } else {
            nativeBtn.hidden = true;
            nativeBtn.onclick = null;
        }
        $('pmShare').hidden = false;

        // project jump dots
        var dots = $('pmDots');
        dots.textContent = '';
        projects.forEach(function(_, di) {
            var d = document.createElement('button');
            d.type = 'button';
            d.className = 'pm-dot' + (di === i ? ' active' : '');
            d.setAttribute('aria-label', t('pm_dot_aria').replace('{n}', di + 1));
            d.addEventListener('click', function() { render(di, true); });
            dots.appendChild(d);
        });

        // nav button labels
        $('pmPrev').setAttribute('aria-label', t('pm_prev_aria'));
        $('pmNext').setAttribute('aria-label', t('pm_next_aria'));

        // reset scroll & subtle fade on content swap
        var bodyWrap = $('pmBodyWrap');
        bodyWrap.scrollTop = 0;
        if (animate) {
            bodyWrap.style.opacity = '0';
            setTimeout(function() { bodyWrap.style.opacity = '1'; }, 60);
        }
    }

    function go(delta) {
        render((current + delta + projects.length) % projects.length, true);
    }

    /* ---------- lightbox ---------- */
    var lbIndex = 0, lbGallery = [], lbTrigger = null;
    var lb = $('pmLightbox');

    function openLightbox(i) {
        lbGallery = projects[current].gallery || [];
        lbIndex = i;
        showLb();
        lb.hidden = false;
        document.body.style.overflow = 'hidden';
        lbTrigger = document.activeElement;
        var lbBtn = $('pmLbClose');
        if (lbBtn) lbBtn.focus();
    }

    function showLb() {
        var lbImg = $('pmLbImg');
        lbImg.classList.remove('img-broken');
        lbImg.src = lbGallery[lbIndex];
        lbImg.alt = (projects[current] && projects[current].alt) || '';
        lbImg.decoding = 'async';
        $('pmLbCounter').textContent = (lbIndex + 1) + ' / ' + lbGallery.length;
        $('pmLbPrev').disabled = lbGallery.length < 2;
        $('pmLbNext').disabled = lbGallery.length < 2;
    }

    function lbGo(d) {
        lbIndex = (lbIndex + d + lbGallery.length) % lbGallery.length;
        showLb();
    }

    function closeLightbox() {
        lb.hidden = true;
        document.body.style.overflow = '';
        if (lbTrigger && lbTrigger.focus) lbTrigger.focus();
        lbTrigger = null;
    }

    $('pmLbClose').addEventListener('click', closeLightbox);
    $('pmLbPrev').addEventListener('click', function() { lbGo(-1); });
    $('pmLbNext').addEventListener('click', function() { lbGo(1); });
    lb.addEventListener('click', function(e) { if (e.target === lb) closeLightbox(); });

    /* ---------- "start a similar project" ---------- */
    $('pmSimilar').addEventListener('click', function() {
        var p = projects[current];
        var m = modalApi(); if (m) m.hide(); else modalEl.classList.remove('show');
        setTimeout(function() {
            var form = document.getElementById('contactForm');
            var subject = document.getElementById('subject');
            var msg = document.getElementById('message');
            if (subject) {
                var match = p.cat && subject.querySelector('option[value="' + p.cat + '"]') ? p.cat : 'other';
                subject.value = match;
            }
            if (msg && !msg.value) {
                var tpl = t('pm_similar_msg');
                msg.value = (tpl !== 'pm_similar_msg' ? tpl : "I'm interested in a project similar to \"{title}\". ").replace('{title}', p.title);
            }
            var c = document.getElementById('contact');
            if (c) c.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(function() { if (msg) msg.focus(); }, 850);
        }, 350);
    });

    modalEl.addEventListener('show.bs.modal', function(e) {
        lastTrigger = e.relatedTarget || null;
        var idx = e.relatedTarget && e.relatedTarget.dataset ? parseInt(e.relatedTarget.dataset.project, 10) : null;
        if (isNaN(idx) && openIndex != null) idx = openIndex;
        openIndex = null;
        // remember the section anchor so closing the modal restores it
        if (!window.location.hash.match(/^#project-\d+$/)) preModalHash = window.location.hash;
        if (idx == null || isNaN(idx)) {
            var m = window.location.hash.match(/^#project-(\d+)$/);
            idx = m ? parseInt(m[1], 10) : current;
        }
        // push a history entry so the browser Back button closes the modal
        var targetHash = '#project-' + idx;
        if (window.location.hash !== targetHash) {
            try { history.pushState(null, '', targetHash); } catch (e) {}
        }
        render(idx, false);
    });

    // deep-link / back-forward sync: hash changes open, navigate or close the modal
    window.addEventListener('hashchange', function() {
        var m = window.location.hash.match(/^#project-(\d+)$/);
        if (m) {
            var idx = parseInt(m[1], 10);
            if (idx < 0 || idx >= projects.length) return;
            if (!modalShown()) {
                openIndex = null;
                render(idx, false);
                var hm = modalApi(); if (hm) hm.show();
            } else if (idx !== current) {
                render(idx, true);
            }
        } else if (modalShown()) {
            var m2 = modalApi(); if (m2) m2.hide(); else modalEl.classList.remove('show');
        }
    });

    // copy project link — only show success when the copy actually worked
    $('pmShareCopy').addEventListener('click', function() {
        var url = this._shareUrl;
        var btn = this;
        function done(ok) {
            if (U.announceCopy) U.announceCopy(ok);
            if (!ok) return;
            var icon = btn.querySelector('i');
            if (icon) {
                icon.className = 'fa fa-check';
                setTimeout(function() { icon.className = 'fa fa-link'; }, 1500);
            }
        }
        U.copyText(url).then(done);
    });

    // copy a plain-text project brief (title + intro + tech + link)
    function buildBrief(p) {
        return p.title + '\n' + t(p.keys.intro) + '\n\n' + t('pm_tech') + ': ' + (p.tech || []).join(', ') +
            (p.link ? '\n' + p.link : '') + '\n\n— YMT Solution · ' + location.origin + location.pathname;
    }

    $('pmBriefCopy').addEventListener('click', function() {
        var p = projects[current];
        if (!p) return;
        var brief = buildBrief(p);
        var btn = this;
        function done(ok) {
            if (U.announceCopy) U.announceCopy(ok);
            if (!ok) return;
            var icon = btn.querySelector('i');
            if (icon) icon.className = 'fa fa-check';
            var i18n = window.YMTI18n;
            btn.setAttribute('aria-label', i18n && i18n.t ? i18n.t('pm_brief_done') : 'Brief copied!');
            setTimeout(function() { if (icon) icon.className = 'fa fa-copy'; }, 1600);
        }
        U.copyText(brief).then(done);
    });

    // download the same brief as a .txt file
    $('pmBriefDl').addEventListener('click', function() {
        var p = projects[current];
        if (!p) return;
        var blob = new Blob([buildBrief(p)], { type: 'text/plain;charset=utf-8' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (p.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-brief.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(a.href); }, 1000);
    });

    // touch swipe: horizontal flick navigates projects (mobile)
    (function() {
        var SWIPE_MIN = 50, SWIPE_RATIO = 1.5;
        var startX = 0, startY = 0, tracking = false;
        modalEl.addEventListener('touchstart', function(e) {
            if (!lb.hidden) return;
            if (e.touches.length !== 1) return;
            tracking = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        modalEl.addEventListener('touchend', function(e) {
            if (!tracking) return;
            tracking = false;
            var t = e.changedTouches[0];
            var dx = t.clientX - startX, dy = t.clientY - startY;
            if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * SWIPE_RATIO) return;
            go(dx < 0 ? 1 : -1);
        }, { passive: true });
    })();

    $('pmPrev').addEventListener('click', function(e) { e.preventDefault(); go(-1); });
    $('pmNext').addEventListener('click', function(e) { e.preventDefault(); go(1); });

    // keyboard navigation while modal/lightbox is open
    document.addEventListener('keydown', function(e) {
        if (!lb.hidden) {
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft') lbGo(-1);
            else if (e.key === 'ArrowRight') lbGo(1);
            else if (e.key === 'Tab') {
                var lbs = Array.prototype.filter.call(
                    lb.querySelectorAll('button:not([disabled])'),
                    function(n) { return n.offsetParent !== null; }
                );
                if (!lbs.length) return;
                var lfirst = lbs[0], llast = lbs[lbs.length - 1];
                if (e.shiftKey && document.activeElement === lfirst) { e.preventDefault(); llast.focus(); }
                else if (!e.shiftKey && document.activeElement === llast) { e.preventDefault(); lfirst.focus(); }
            }
            return;
        }
        if (!modalShown()) return;
        if (e.key === 'ArrowLeft') go(-1);
        else if (e.key === 'ArrowRight') go(1);
    });

    // re-render with new language if modal is open
    document.addEventListener('ymt:langchange', function() {
        if (modalShown()) render(current, false);
    });

    // return focus to the card that opened the modal
    modalEl.addEventListener('hidden.bs.modal', function() {
        document.title = baseTitle;
        // restore the pre-modal anchor (e.g. #services) instead of dropping it
        var restore = preModalHash && !preModalHash.match(/^#project-\d+$/) ? preModalHash : '';
        preModalHash = '';
        if (location.hash !== restore) {
            try { history.replaceState(null, '', location.pathname + location.search + restore); } catch (e) {}
        }
        if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
        lastTrigger = null;
    });

    // simple focus trap: keep Tab cycling inside the modal
    modalEl.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;
        var focusables = Array.prototype.filter.call(
            modalEl.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
            function(n) { return n.offsetParent !== null; }
        );
        if (!focusables.length) return;
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // expose for deep-linking / debugging
    window.YMTModal = { open: function(i) { openIndex = i; render(i, false); var m = modalApi(); if (m) m.show(); } };
})();
