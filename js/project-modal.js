/* Single reusable project modal — populates #projectModal from
   window.YMTProjects + the active language dictionary (YMTI18n.t). */
(function($) {
    'use strict';

    var projects = window.YMTProjects || [];
    var current = 0;
    var $modal = $('#projectModal');
    var lastTrigger = null;

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

        var $hero = $('.pm-hero');
        $hero.toggleClass('pm-hero-logo', !!p.logo);
        var $img = $('#pmImg');
        $img.attr({ src: p.img, alt: p.alt || p.title });
        // srcset for compressed JPG projects (small + full)
        if (/\.jpe?g$/i.test(p.img)) {
            var base = p.img.replace(/\.jpe?g$/i, '');
            $img.attr('srcset', base + '-sm.jpg 480w, ' + p.img + ' 1000w');
            $img.attr('sizes', '(max-width: 860px) 100vw, 810px');
        } else {
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

        // share links — deep link to this project
        var shareUrl = location.origin + location.pathname + '#project-' + i;
        var shareText = encodeURIComponent(p.title + ' | YMT Solution');
        var shareUrlEnc = encodeURIComponent(shareUrl);
        $('#pmShareX').attr('href', 'https://twitter.com/intent/tweet?url=' + shareUrlEnc + '&text=' + shareText);
        $('#pmShareLi').attr('href', 'https://www.linkedin.com/sharing/share-offsite/?url=' + shareUrlEnc);
        $('#pmShareWa').attr('href', 'https://wa.me/?text=' + shareText + '%20' + shareUrlEnc);
        $('#pmShareCopy').data('url', shareUrl);
        $('#pmShare').prop('hidden', false);

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

    $modal.on('show.bs.modal', function(e) {
        lastTrigger = e.relatedTarget || null;
        var idx = $(e.relatedTarget).data('project');
        if (idx == null) {
            var m = window.location.hash.match(/^#project-(\d+)$/);
            idx = m ? parseInt(m[1], 10) : current;
        }
        render(idx, false);
    });

    // copy project link
    $('#pmShareCopy').on('click', function() {
        var url = $(this).data('url');
        function done() {
            var $b = $(this);
            $b.find('i').attr('class', 'fa fa-check');
            setTimeout(function() { $b.find('i').attr('class', 'fa fa-link'); }, 1500);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(done.bind(this)).catch(done.bind(this));
        } else {
            var ta = document.createElement('textarea');
            ta.value = url; document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy'); } catch (e) {}
            document.body.removeChild(ta); done.call(this);
        }
    });

    $('#pmPrev').on('click', function(e) { e.preventDefault(); go(-1); });
    $('#pmNext').on('click', function(e) { e.preventDefault(); go(1); });

    // keyboard navigation while modal is open
    $(document).on('keydown', function(e) {
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
    window.YMTModal = { open: function(i) { render(i, false); $modal.modal('show'); } };
})(jQuery);
