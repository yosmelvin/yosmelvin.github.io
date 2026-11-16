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

    function showMessage(type, html) {
        $('#success').html("<div class='alert alert-" + type + "'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>" + html + "</div>");
    }

    $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            var $btn = $form.find('button[type="submit"]');
            var name = $("input#name").val();
            var email = $("input#email").val();
            var phone = $("input#phone").val();
            var subject = $("select#subject").val();
            var message = $("textarea#message").val();
            var firstName = name.split(' ')[0];

            // Honeypot: bots fill hidden fields — pretend success, send nothing.
            if ($('input#hp_website').val()) {
                showMessage('success', "<strong>Thank you " + firstName + "!</strong> Your message has been sent — we'll get back to you soon.");
                $('#contactForm').trigger("reset");
                return;
            }

            if (FORMSPREE_ENDPOINT.indexOf('REPLACE_WITH_FORM_ID') !== -1) {
                showMessage('danger', "<strong>Form is not configured yet.</strong> Please email us directly instead.");
                return;
            }

            $btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Sending…');

            fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify((function() {
                    var payload = {
                        name: name, email: email, phone: phone, subject: subject, message: message,
                        _subject: 'New project inquiry — ' + name,
                        _replyto: email
                    };
                    ['utm_source', 'utm_medium', 'utm_campaign', 'referrer'].forEach(function(k) {
                        if (YMT_ATTR[k]) payload[k] = YMT_ATTR[k];
                    });
                    return payload;
                })())
            }).then(function(res) {
                if (!res.ok) throw new Error('bad response');
                showMessage('success', "<strong>Thank you " + firstName + "!</strong> Your message has been sent — we'll get back to you soon.");
                $('#contactForm').trigger("reset");
            }).catch(function() {
                showMessage('danger', "<strong>Sorry " + firstName + ",</strong> your message could not be sent. Please try again later or email us directly.");
            }).finally(function() {
                $btn.prop('disabled', false).text($btn.data('label') || 'Send Message');
            });
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("#contactForm button[type='submit']").each(function() { $(this).data('label', $(this).text()); });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});
