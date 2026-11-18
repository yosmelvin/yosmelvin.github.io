// Contact Form Scripts (ES module) — submits via Formspree (static-site friendly).
import { CONFIG } from './config.js';
import { esc } from './utils.js';
import { t as i18nT } from './i18n.js';

var FORMSPREE_ENDPOINT = CONFIG.FORMSPREE_ENDPOINT;

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

    function tt(k, fb) {
        var v = i18nT(k);
        return (v === k && fb != null) ? fb : v;
    }

    var errorBox = null;

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
        if (!formEl.checkValidity()) {
            formEl.reportValidity();
            showErrorSummary(formEl);
            return;
        }
        if (errorBox) errorBox.hidden = true;
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
        // Honeypot: bots fill hidden fields — pretend success, send nothing.
        var hp = document.getElementById('hp_website');
        if (hp && hp.value) {
            var hpFirst = firstName || '';
            showMessage('success', "<strong>" + tt('cf_thanks', 'Thank you') + " " + hpFirst + "!</strong> " + tt('cf_sent', 'Your message has been sent — we\'ll get back to you soon.'));
            formEl.reset();
            clearDraft();
            return;
        }

        if (FORMSPREE_ENDPOINT.indexOf('REPLACE_WITH_FORM_ID') !== -1) {
            showMessage('danger', "<strong>" + tt('cf_not_configured', 'Form is not configured yet.') + "</strong>");
            return;
        }

        if (navigator.onLine === false) {
            showMessage('danger', "<strong>" + tt('cf_offline', 'You appear to be offline — check your connection and try again.') + "</strong>");
            return;
        }

        var btn = contactForm.querySelector('button[type="submit"]');
        var btnLabel = btn ? btn.textContent : 'Send Message';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> ' + tt('contact_sending', 'Sending…');
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
            showMessage('success', "<strong>" + tt('cf_thanks', 'Thank you') + " " + firstName + "!</strong> " + tt('cf_sent', 'Your message has been sent — we\'ll get back to you soon.'));
            formEl.reset();
            clearDraft();
        }).catch(function() {
            showMessage('danger', "<strong>" + tt('cf_sorry', 'Sorry') + " " + firstName + ",</strong> " + tt('cf_err_send', 'your message could not be sent. Please try again later or email us directly.'));
        }).finally(function() {
            if (btn) {
                btn.disabled = false;
                btn.textContent = btnLabel;
            }
        });
    });

    // Inline error summary: lists invalid fields, focuses the first one,
    // and marks fields aria-invalid until the visitor edits them.
    var LABEL_KEYS = { name: 'lbl_name', email: 'lbl_email', phone: 'lbl_phone', subject: 'lbl_subject', message: 'lbl_message' };
    function showErrorSummary(formEl) {
        var invalid = ['name', 'email', 'phone', 'subject', 'message'].filter(function(id) {
            var el = document.getElementById(id);
            return el && el.willValidate && !el.checkValidity();
        });
        if (!invalid.length) return;
        if (!errorBox) {
            errorBox = document.createElement('div');
            errorBox.id = 'formErrorSummary';
            errorBox.className = 'form-error-summary';
            errorBox.setAttribute('role', 'alert');
            errorBox.tabIndex = -1;
            var succ = document.getElementById('success');
            if (succ && succ.parentNode) succ.parentNode.insertBefore(errorBox, succ.nextSibling);
            else formEl.parentNode.insertBefore(errorBox, formEl);
        }
        errorBox.innerHTML = '';
        var strong = document.createElement('strong');
        strong.textContent = tt('cf_fix', 'Please fix the following fields:');
        errorBox.appendChild(strong);
        var ul = document.createElement('ul');
        invalid.forEach(function(id) {
            var f = document.getElementById(id);
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + id;
            a.textContent = tt(LABEL_KEYS[id], id);
            a.addEventListener('click', function(ev) {
                ev.preventDefault();
                if (f) f.focus();
            });
            li.appendChild(a);
            ul.appendChild(li);
            if (f) {
                f.setAttribute('aria-invalid', 'true');
                f.addEventListener('input', function() { f.removeAttribute('aria-invalid'); }, { once: true });
            }
        });
        errorBox.appendChild(ul);
        errorBox.hidden = false;
        var first = document.getElementById(invalid[0]);
        if (first) first.focus();
    }
    contactForm.addEventListener('input', function() {
        if (errorBox) errorBox.hidden = true;
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
