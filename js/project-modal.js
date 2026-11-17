/* Single reusable project modal — populates #projectModal from
   window.YMTProjects + the active language dictionary (YMTI18n.t). */
(function($) {
    'use strict';

    var projects = window.YMTProjects || [];
    var current = 0;
    var $modal = $('#projectModal');
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

    function render(i, animate) {
        var p = projects[i];
        if (!p) return;
        current = i;

        // keep the URL hash in sync while the modal is open (refresh/back share
        // the same project); the opening entry is pushed in show.bs.modal
        if ($modal.hasClass('in')) {
            try { history.replaceState(null, '', '#project-' + i); } catch (e) {}
        }
        document.title = p.title + ' — YMT Solution';
        document.dispatchEvent(new CustomEvent('ymt:projectview', { detail: i }));

        var $hero = $('.pm-hero');
        $hero.toggleClass('pm-hero-logo', !!p.logo);
        var $img = $('#pmImg');
        $img.removeClass('img-broken');
        $img.attr({ src: p.img, alt: p.alt || p.title, decoding: 'async' });
        // every project ships WebP + JPG variants — serve WebP via <picture>
        var m = p.img.match(/^(.*)\.(jpe?g|webp|png)$/i);
        var $webpSrc = $('#pmWebpSrc');
        if (m) {
            var base = m[1];
            var isWebpProject = /\.webp$/i.test(p.img);
            $webpSrc.attr('srcset', base + '-sm.webp 480w, ' + base + '.webp 1000w');
            if (/\.(jpe?g|webp)$/i.test(p.img)) {
                $img.attr('srcset', isWebpProject
                    ? base + '.jpg 1000w'
                    : base + '-sm.jpg 480w, ' + p.img + ' 1000w');
                $img.attr('sizes', '(max-width: 860px) 100vw, 810px');
                if (isWebpProject) $img.attr('src', base + '.jpg');
            } else {
                $img.removeAttr('srcset').removeAttr('sizes');
            }
        } else {
            $webpSrc.removeAttr('srcset');
            $img.removeAttr('srcset').removeAttr('sizes');
        }
        $('#pmTitle').text(p.title);
        $('#pmIntro').text(t(p.keys.intro));
        $('#pmText').html(t(p.keys.body));
        $('#pmCounter').text(pad(i + 1) + ' / ' + pad(projects.length));

        // category chip in hero (only projects that define one)
        if (p.meta && p.meta.cat) {
            $('#pmCat').text(t(p.meta.cat)).show();
        } else {
            $('#pmCat').hide();
        }

        // meta chips
        var $meta = $('#pmMeta').empty();
        if (p.meta) {
            ['date', 'client'].forEach(function(field) {
                if (p.meta[field]) {
                    $('<span class="pm-chip"></span>').text(t(p.meta[field])).appendTo($meta);
                }
            });
        }
        $meta.toggle($meta.children().length > 0);

        // unified badges (vvip / live / nda)
        var badgeTypes = p.badges || (p.exclusive ? ['vvip'] : []);
        var $badges = $('#pmBadges').empty();
        badgeTypes.forEach(function(b) {
            $('<span class="pm-badge-static pm-badge-' + b + '"></span>').text(t('badge_' + b)).appendTo($badges);
        });
        $badges.prop('hidden', badgeTypes.length === 0);

        // visit button
        if (p.link) {
            $('#pmVisit').attr('href', p.link).prop('hidden', false);
        } else {
            $('#pmVisit').prop('hidden', true);
        }

        // tech stack chips
        var $tech = $('#pmTech').empty();
        if (p.tech && p.tech.length) {
            $('<span class="pm-tech-label"></span>').text(t('pm_tech')).appendTo($tech);
            p.tech.forEach(function(tk) {
                $('<span class="pm-chip pm-chip-tech"></span>').text(tk).appendTo($tech);
            });
            $tech.prop('hidden', false);
        } else {
            $tech.prop('hidden', true);
        }

        // gallery thumbnails + lightbox (only when extra images provided)
        var gallery = p.gallery || [];
        var $gal = $('#pmGallery').empty();
        if (gallery.length) {
            gallery.forEach(function(src, gi) {
                $('<button type="button" class="pm-thumb" role="listitem"></button>')
                    .append($('<img loading="lazy" decoding="async">').attr({ src: src, alt: p.alt || p.title }))
                    .on('click', function() { openLightbox(gi); })
                    .appendTo($gal);
            });
            $gal.prop('hidden', false);
        } else {
            $gal.prop('hidden', true);
        }

        // share links — deep link to this project
        var shareUrl = location.origin + location.pathname + '#project-' + i;
        var shareText = encodeURIComponent(p.title + ' | YMT Solution');
        var shareUrlEnc = encodeURIComponent(shareUrl);
        $('#pmShareX').attr('href', 'https://twitter.com/intent/tweet?url=' + shareUrlEnc + '&text=' + shareText);
        $('#pmShareLi').attr('href', 'https://www.linkedin.com/sharing/share-offsite/?url=' + shareUrlEnc);
        $('#pmShareWa').attr('href', 'https://wa.me/?text=' + shareText + '%20' + shareUrlEnc);
        $('#pmShareCopy').data('url', shareUrl);
        // native share sheet when available (mobile)
        var $native = $('#pmShareNative');
        if (navigator.share) {
            $native.prop('hidden', false).off('click').on('click', function() {
                navigator.share({ title: p.title + ' | YMT Solution', text: p.title, url: shareUrl }).catch(function() {});
            });
        } else {
            $native.prop('hidden', true);
        }
        $('#pmShare').prop('hidden', false);

        // project jump dots
        var $dots = $('#pmDots').empty();
        projects.forEach(function(_, di) {
            $('<button type="button" class="pm-dot' + (di === i ? ' active' : '') + '"></button>')
                .attr('role', 'tab')
                .attr('aria-label', t('pm_dot_aria').replace('{n}', di + 1))
                .attr('aria-selected', di === i ? 'true' : 'false')
                .on('click', function() { render(di, true); })
                .appendTo($dots);
        });

        // nav button labels
        $('#pmPrev').attr('aria-label', t('pm_prev_aria'));
        $('#pmNext').attr('aria-label', t('pm_next_aria'));

        // reset scroll & subtle fade on content swap
        var $body = $('#pmBodyWrap');
        $body.scrollTop(0);
        if (animate) {
            $body.css('opacity', 0);
            setTimeout(function() { $body.css('opacity', 1); }, 60);
        }
    }

    function go(delta) {
        render((current + delta + projects.length) % projects.length, true);
    }

    /* ---------- lightbox ---------- */
    var lbIndex = 0, lbGallery = [];
    var $lb = $('#pmLightbox');

    function openLightbox(i) {
        lbGallery = projects[current].gallery || [];
        lbIndex = i;
        showLb();
        $lb.prop('hidden', false);
        document.body.style.overflow = 'hidden';
    }

    function showLb() {
        var $lbImg = $('#pmLbImg').removeClass('img-broken');
        $lbImg.attr({ src: lbGallery[lbIndex], alt: (projects[current] && projects[current].alt) || '', decoding: 'async' });
        $('#pmLbCounter').text((lbIndex + 1) + ' / ' + lbGallery.length);
        $('#pmLbPrev').prop('disabled', lbGallery.length < 2);
        $('#pmLbNext').prop('disabled', lbGallery.length < 2);
    }

    function lbGo(d) {
        lbIndex = (lbIndex + d + lbGallery.length) % lbGallery.length;
        showLb();
    }

    function closeLightbox() {
        $lb.prop('hidden', true);
        document.body.style.overflow = '';
    }

    $('#pmLbClose').on('click', closeLightbox);
    $('#pmLbPrev').on('click', function() { lbGo(-1); });
    $('#pmLbNext').on('click', function() { lbGo(1); });
    $lb.on('click', function(e) { if (e.target === this) closeLightbox(); });

    /* ---------- "start a similar project" ---------- */
    $('#pmSimilar').on('click', function() {
        var p = projects[current];
        $modal.modal('hide');
        setTimeout(function() {
            var $form = $('#contactForm');
            var $subject = $('#subject');
            var $msg = $('#message');
            if ($subject.length) {
                var match = p.cat && $subject.find('option[value="' + p.cat + '"]').length ? p.cat : 'other';
                $subject.val(match);
            }
            if ($msg.length && !$msg.val()) {
                var tpl = t('pm_similar_msg');
                $msg.val((tpl !== 'pm_similar_msg' ? tpl : "I'm interested in a project similar to \"{title}\". ").replace('{title}', p.title));
            }
            $('html, body').stop().animate({ scrollTop: $('#contact').offset().top - 60 }, 800, 'easeInOutExpo');
            setTimeout(function() { $msg.trigger('focus'); }, 850);
        }, 350);
    });

    $modal.on('show.bs.modal', function(e) {
        lastTrigger = e.relatedTarget || null;
        var idx = $(e.relatedTarget).data('project');
        if (idx == null && openIndex != null) idx = openIndex;
        openIndex = null;
        // remember the section anchor so closing the modal restores it
        if (!window.location.hash.match(/^#project-\d+$/)) preModalHash = window.location.hash;
        if (idx == null) {
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
    $(window).on('hashchange', function() {
        var m = window.location.hash.match(/^#project-(\d+)$/);
        if (m) {
            var idx = parseInt(m[1], 10);
            if (idx < 0 || idx >= projects.length) return;
            if (!$modal.hasClass('in')) {
                openIndex = null;
                render(idx, false);
                $modal.modal('show');
            } else if (idx !== current) {
                render(idx, true);
            }
        } else if ($modal.hasClass('in')) {
            $modal.modal('hide');
        }
    });

    // copy project link — only show success when the copy actually worked
    $('#pmShareCopy').on('click', function() {
        var url = $(this).data('url');
        var $b = $(this);
        function fallbackCopy() {
            var ta = document.createElement('textarea');
            ta.value = url; document.body.appendChild(ta); ta.select();
            var ok = false;
            try { ok = document.execCommand('copy'); } catch (e) {}
            document.body.removeChild(ta);
            return ok;
        }
        function done(ok) {
            if (!ok) return;
            $b.find('i').attr('class', 'fa fa-check');
            setTimeout(function() { $b.find('i').attr('class', 'fa fa-link'); }, 1500);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function() { done(true); }, function() { done(fallbackCopy()); });
        } else {
            done(fallbackCopy());
        }
    });

    // copy a plain-text project brief (title + intro + tech + link)
    function buildBrief(p) {
        return p.title + '\n' + t(p.keys.intro) + '\n\n' + t('pm_tech') + ': ' + (p.tech || []).join(', ') +
            (p.link ? '\n' + p.link : '') + '\n\n— YMT Solution · ' + location.origin + location.pathname;
    }

    $('#pmBriefCopy').on('click', function() {
        var p = projects[current];
        if (!p) return;
        var brief = buildBrief(p);
        var $b = $(this);
        function fallbackCopy() {
            var ta = document.createElement('textarea');
            ta.value = brief; document.body.appendChild(ta); ta.select();
            var ok = false;
            try { ok = document.execCommand('copy'); } catch (e) {}
            document.body.removeChild(ta);
            return ok;
        }
        function done(ok) {
            if (!ok) return;
            var i18n = window.YMTI18n;
            var prev = $b.find('i').attr('class');
            $b.find('i').attr('class', 'fa fa-check');
            $b.attr('aria-label', i18n && i18n.t ? i18n.t('pm_brief_done') : 'Brief copied!');
            setTimeout(function() { $b.find('i').attr('class', prev); }, 1600);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(brief).then(function() { done(true); }, function() { done(fallbackCopy()); });
        } else {
            done(fallbackCopy());
        }
    });

    // download the same brief as a .txt file
    $('#pmBriefDl').on('click', function() {
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

    $('#pmPrev').on('click', function(e) { e.preventDefault(); go(-1); });
    $('#pmNext').on('click', function(e) { e.preventDefault(); go(1); });

    // keyboard navigation while modal/lightbox is open
    $(document).on('keydown', function(e) {
        if (!$lb.prop('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft') lbGo(-1);
            else if (e.key === 'ArrowRight') lbGo(1);
            return;
        }
        if (!$modal.hasClass('in')) return;
        if (e.keyCode === 37) go(-1);        // left arrow
        else if (e.keyCode === 39) go(1);    // right arrow
    });

    // re-render with new language if modal is open
    $(document).on('ymt:langchange', function() {
        if ($modal.hasClass('in')) render(current, false);
    });

    // return focus to the card that opened the modal
    $modal.on('hidden.bs.modal', function() {
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
    $modal.on('keydown', function(e) {
        if (e.key !== 'Tab') return;
        var focusables = $modal.find('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])').filter(':visible');
        if (!focusables.length) return;
        var first = focusables.first()[0], last = focusables.last()[0];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // expose for deep-linking / debugging
    window.YMTModal = { open: function(i) { openIndex = i; render(i, false); $modal.modal('show'); } };
})(jQuery);
