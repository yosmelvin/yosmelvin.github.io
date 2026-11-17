// Contact Form Scripts
// Submits via Formspree (static-site friendly).
var FORMSPREE_ENDPOINT = 'https://formspree.io/f/mppdpodr';

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

$(function() {

    // Apply share_target prefill once the form exists.
    try {
        var prefill = sessionStorage.getItem('ymt_share_prefill');
        if (prefill) {
            sessionStorage.removeItem('ymt_share_prefill');
            var msg = document.getElementById('message');
            if (msg && !msg.value) {
                msg.value = 'Shared content:\n' + prefill;
                var subj = document.getElementById('subject');
                if (subj && subj.options.length) subj.selectedIndex = Math.min(1, subj.options.length - 1);
            }
        }
    } catch (e) {}

    function esc(s) {
        return String(s).replace(/[&<>"']/g, function(c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function showMessage(type, html) {
        $('#success').html("<div class='alert alert-" + type + " alert-dismissible fade show'><button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>" + html + "</div>");
    }

    var $contactForm = $("#contactForm");

    $contactForm.on('submit', function(e) {
        var formEl = this;
        if (!formEl.checkValidity()) { formEl.reportValidity(); return; }
        e.preventDefault();
        var $form = $(formEl);
        var $btn = $form.find('button[type="submit"]');
        var name = $("input#name").val();
        var email = $("input#email").val();
        var phone = $("input#phone").val();
        var subject = $("select#subject").val();
        var message = $("textarea#message").val();
        var firstName = esc(name.split(' ')[0] || '');

        var lang = (function() {
            try { return localStorage.getItem('ymt-lang') === 'id' ? 'id' : 'en'; } catch (e) { return 'en'; }
        })();
        var i18nT = function(k, fb) {
            return (window.YMTI18n && YMTI18n.t) ? YMTI18n.t(k) : fb;
        };

        // Honeypot: bots fill hidden fields — pretend success, send nothing.
        if ($('input#hp_website').val()) {
            var hpFirst = firstName || '';
            showMessage('success', "<strong>" + i18nT('cf_thanks', 'Thank you') + " " + hpFirst + "!</strong> " + i18nT('cf_sent', 'Your message has been sent — we\'ll get back to you soon.'));
            $form.trigger("reset");
            return;
        }

        if (FORMSPREE_ENDPOINT.indexOf('REPLACE_WITH_FORM_ID') !== -1) {
            showMessage('danger', "<strong>" + i18nT('cf_not_configured', 'Form is not configured yet.') + "</strong>");
            return;
        }

        $btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Sending…');

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
            $form.trigger("reset");
        }).catch(function() {
            showMessage('danger', "<strong>" + i18nT('cf_sorry', 'Sorry') + " " + firstName + ",</strong> " + i18nT('cf_err_send', 'your message could not be sent. Please try again later or email us directly.'));
        }).finally(function() {
            $btn.prop('disabled', false).text($btn.data('label') || 'Send Message');
        });
    });

    $("#contactForm button[type='submit']").each(function() { $(this).data('label', $(this).text()); });

});


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});
