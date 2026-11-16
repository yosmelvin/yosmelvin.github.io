/* Single reusable project modal — populates #projectModal from
   window.YMTProjects + the active language dictionary (YMTI18n.t). */
(function($) {
    'use strict';

    var projects = window.YMTProjects || [];
    var current = 0;
    var $modal = $('#projectModal');

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
        $('#pmImg').attr({ src: p.img, alt: p.alt || p.title });
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

        // VVIP badge
        if (p.exclusive) {
            $('#pmBadge').text(t('pm_vvip')).prop('hidden', false);
        } else {
            $('#pmBadge').prop('hidden', true);
        }

        // visit button
        if (p.link) {
            $('#pmVisit').attr('href', p.link).prop('hidden', false);
        } else {
            $('#pmVisit').prop('hidden', true);
        }

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
        var idx = $(e.relatedTarget).data('project');
        if (idx == null) {
            var m = window.location.hash.match(/^#project-(\d+)$/);
            idx = m ? parseInt(m[1], 10) : current;
        }
        render(idx, false);
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

    // expose for deep-linking / debugging
    window.YMTModal = { open: function(i) { render(i, false); $modal.modal('show'); } };
})(jQuery);
