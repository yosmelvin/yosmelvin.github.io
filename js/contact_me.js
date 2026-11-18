// Contact Form Scripts
// Submits via Formspree (static-site friendly).
var FORMSPREE_ENDPOINT = 'https://formspree.io/f/mppdpodr';
var U = window.YMTUtils || {};

// Capture UTM params + referrer once per session for attribution.
function ymtAttribution() {
    try {
        var cached = sessionStorage.getItem('ymt_attr');
        if (cached) return JSON.parse(cached);
        var q = new URLSearchParams(location.search);
        var attr = {
            utm_source: q.get('utm_source') || '',
            utm_medium: q.get('utm_medium') || '',
            utm_campaign: q.get('utm_campaign') || '',
            referrer: document.referrer ? new URL(document.referrer).hostname : ''
        };
        sessionStorage.setItem('ymt_attr', JSON.stringify(attr));
        return attr;
    } catch (e) { return {}; }
}

var YMT_ATTR = ymtAttribution(); // capture on load, before params are lost

// PWA share_target: prefill the form when the app is opened via system share.
(function () {
    try {
        var q = new URLSearchParams(location.search);
        var shared = q.get('share_text') || q.get('share_title') || '';
        var sharedUrl = q.get('share_url') || '';
        if (!shared && !sharedUrl) return;
        var parts = [];
        if (shared) parts.push(shared);
        if (sharedUrl) parts.push(sharedUrl);
        sessionStorage.setItem('ymt_share_prefill', parts.join('\n'));
        if (location.hash !== '#contact') history.replaceState(null, '', '/#contact');
    } catch (e) {}
})();

(function() {

    var esc = U.esc || function(s) {
        return String(s).replace(/[&<>"']/g, function(c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    };

    function showMessage(type, html) {
        var role = type === 'success' ? 'status' : 'alert';
        var box = document.getElementById('success');
        if (!box) return;
        box.innerHTML = "<div class='alert alert-" + type + " alert-dismissible fade show' role='" + role + "'><button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>" + html + "</div>";
        if (box.scrollIntoView) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    var contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    var DRAFT_KEY = 'ymt_form_draft';
    var DRAFT_FIELDS = ['name', 'email', 'phone', 'subject', 'message'];

    // Draft persistence — restore on load, save on input, clear on success
    function saveDraft() {
        try {
            var d = {};
            DRAFT_FIELDS.forEach(function(id) {
                var f = document.getElementById(id);
                if (f) d[id] = f.value;
            });
            if (Object.keys(d).some(function(k) { return d[k]; })) {
                sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
            } else {
                sessionStorage.removeItem(DRAFT_KEY);
            }
        } catch (e) {}
    }
    function restoreDraft() {
        try {
            var d = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null');
            if (!d) return;
            DRAFT_FIELDS.forEach(function(id) {
                var f = document.getElementById(id);
                if (f && d[id] && !f.value) f.value = d[id];
            });
        } catch (e) {}
    }
    function clearDraft() {
        try { sessionStorage.removeItem(DRAFT_KEY); } catch (e) {}
    }
    contactForm.addEventListener('input', saveDraft);
    restoreDraft();

    // Apply share_target prefill once the form exists.
    try {
        var prefill = sessionStorage.getItem('ymt_share_prefill');
        if (prefill) {
            sessionStorage.removeItem('ymt_share_prefill');
            var msg = document.getElementById('message');
            if (msg && !msg.value) {
                msg.value = 'Shared content:\n' + prefill;
                var subj = document.getElementById('subject');
                if (subj) { var otherOpt = subj.querySelector('option[value="other"]'); if (otherOpt) subj.value = 'other'; }
            }
        }
    } catch (e) {}

    contactForm.addEventListener('submit', function(e) {
        var formEl = this;
        if (!formEl.checkValidity()) { formEl.reportValidity(); return; }
        e.preventDefault();
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var phoneEl = document.getElementById('phone');
        var phone = phoneEl ? phoneEl.value : '';
        var subjectEl = document.getElementById('subject');
        var subject = subjectEl ? subjectEl.value : '';
        var messageEl = document.getElementById('message');
        var message = messageEl ? messageEl.value : '';
        var firstName = esc(name.split(' ')[0] || '');

        var lang = (function() {
            try { return localStorage.getItem('ymt-lang') === 'id' ? 'id' : 'en'; } catch (e) { return 'en'; }
        })();
        var i18nT = function(k, fb) {
            return (window.YMTI18n && YMTI18n.t) ? YMTI18n.t(k) : fb;
        };

        // Honeypot: bots fill hidden fields — pretend success, send nothing.
        var hp = document.getElementById('hp_website');
        if (hp && hp.value) {
            var hpFirst = firstName || '';
            showMessage('success', "<strong>" + i18nT('cf_thanks', 'Thank you') + " " + hpFirst + "!</strong> " + i18nT('cf_sent', 'Your message has been sent — we\'ll get back to you soon.'));
            formEl.reset();
            clearDraft();
            return;
        }

        if (FORMSPREE_ENDPOINT.indexOf('REPLACE_WITH_FORM_ID') !== -1) {
            showMessage('danger', "<strong>" + i18nT('cf_not_configured', 'Form is not configured yet.') + "</strong>");
            return;
        }

        if (navigator.onLine === false) {
            showMessage('danger', "<strong>" + i18nT('cf_offline', 'You appear to be offline — check your connection and try again.') + "</strong>");
            return;
        }

        var btn = contactForm.querySelector('button[type="submit"]');
        var btnLabel = btn ? btn.textContent : 'Send Message';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> ' + i18nT('contact_sending', 'Sending…');
        }

        var single = function(v) { return String(v || '').replace(/[\r\n]+/g, ' ').trim(); };
        var safeName = single(name), safeEmail = single(email), safeSubject = single(subject);

        fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify((function() {
                var payload = {
                    name: safeName, email: safeEmail, phone: single(phone), subject: safeSubject, message: message,
                    _subject: 'New project inquiry [' + lang + '] — ' + safeName,
                    _replyto: safeEmail
                };
                ['utm_source', 'utm_medium', 'utm_campaign', 'referrer'].forEach(function(k) {
                    if (YMT_ATTR[k]) payload[k] = YMT_ATTR[k];
                });
                return payload;
            })())
        }).then(function(res) {
            if (!res.ok) throw new Error('bad response');
            showMessage('success', "<strong>" + i18nT('cf_thanks', 'Thank you') + " " + firstName + "!</strong> " + i18nT('cf_sent', 'Your message has been sent — we\'ll get back to you soon.'));
            formEl.reset();
            clearDraft();
        }).catch(function() {
            showMessage('danger', "<strong>" + i18nT('cf_sorry', 'Sorry') + " " + firstName + ",</strong> " + i18nT('cf_err_send', 'your message could not be sent. Please try again later or email us directly.'));
        }).finally(function() {
            if (btn) {
                btn.disabled = false;
                btn.textContent = btnLabel;
            }
        });
    });

    // hide stale alerts when the visitor starts editing again
    var nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener('focus', function() {
            var box = document.getElementById('success');
            if (box) box.innerHTML = '';
        });
    }

})();
