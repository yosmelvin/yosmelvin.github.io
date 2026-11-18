(function() {
        var buttons = document.querySelectorAll('.lang-pill button');
        var blocks = document.querySelectorAll('[data-lang-block]');
        var saved = 'en';
        try {
            var q = new URLSearchParams(location.search).get('lang');
            if (q === 'en' || q === 'id') saved = q;
            else saved = localStorage.getItem('ymt-lang') || 'en';
        } catch (e) {}
        function setLang(l) {
            blocks.forEach(function(b) { b.hidden = b.getAttribute('data-lang-block') !== l; });
            buttons.forEach(function(b) {
                var on = b.getAttribute('data-lang') === l;
                b.classList.toggle('active', on);
                b.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
            document.documentElement.lang = l === 'id' ? 'id' : 'en';
            try { localStorage.setItem('ymt-lang', l); } catch (e) {}
        }
        buttons.forEach(function(b) { b.addEventListener('click', function() { setLang(b.getAttribute('data-lang')); }); });
        setLang(saved === 'id' ? 'id' : 'en');
    })();
