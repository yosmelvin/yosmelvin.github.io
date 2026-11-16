    (function($) {
        var $scrollTop = $('.scroll-top');
        $(window).on('scroll', function() {
            $scrollTop.toggleClass('show', $(this).scrollTop() > 400);
        });
        $scrollTop.on('click', function(e) {
            e.preventDefault();
            $('html, body').stop().animate({scrollTop: 0}, 600, 'easeInOutExpo');
        });

        // Deep-link support: open a project modal via URL hash, e.g. #project-3
        var pmHash = window.location.hash.match(/^#project-(\d+)$/);
        if (pmHash) {
            $('#projectModal').modal('show');
        }

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

        // Copy email button
        var emailBtn = document.createElement('button');
        emailBtn.type = 'button';
        emailBtn.className = 'copy-email';
        emailBtn.title = 'ymtsolution@gmail.com';
        emailBtn.setAttribute('aria-label', 'Copy email address');
        emailBtn.innerHTML = '<i class="fa fa-copy" aria-hidden="true"></i>';
        emailBtn.addEventListener('click', function() {
            var email = 'ymtsolution@gmail.com';
            function done() {
                emailBtn.classList.add('copied');
                emailBtn.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
                setTimeout(function() {
                    emailBtn.classList.remove('copied');
                    emailBtn.innerHTML = '<i class="fa fa-copy" aria-hidden="true"></i>';
                }, 1600);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(done).catch(done);
            } else {
                var ta = document.createElement('textarea');
                ta.value = email; document.body.appendChild(ta); ta.select();
                try { document.execCommand('copy'); } catch (e) {}
                document.body.removeChild(ta); done();
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

        // Close mobile navbar after clicking a nav link
        document.querySelectorAll('.navbar-nav a.page-scroll').forEach(function(a) {
            a.addEventListener('click', function() {
                var nav = document.getElementById('bs-example-navbar-collapse-1');
                if (nav && nav.classList.contains('in') && window.jQuery) {
                    jQuery(nav).collapse('hide');
                }
            });
        });

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
        var counts = {};
        $items.forEach(function(item) {
            var c = item.getAttribute('data-cat');
            counts[c] = (counts[c] || 0) + 1;
        });
        counts.all = $items.length;
        document.querySelectorAll('.filter-chip').forEach(function(chip, i) {
            var badge = chip.querySelector('.filter-count');
            if (badge) badge.textContent = counts[chip.getAttribute('data-filter')] || 0;
            chip.style.animationDelay = (i * 60) + 'ms';
            chip.addEventListener('click', function() {
                var f = chip.getAttribute('data-filter');
                document.querySelectorAll('.filter-chip').forEach(function(c) { c.classList.toggle('active', c === chip); });
                $items.forEach(function(item) {
                    var show = f === 'all' || item.getAttribute('data-cat') === f;
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
                '#skills .skill-card, ' +
                '#portfolio .portfolio-item, ' +
                '#stats .col-md-3, ' +
                '#about .timeline > li, ' +
                '#team .team-member, ' +
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
    })(jQuery);
    