(function() {
        var buttons = document.querySelectorAll('.lang-pill button');
        var blocks = document.querySelectorAll('[data-lang-block]');
        var saved = 'en';
        try { saved = localStorage.getItem('ymt-lang') || 'en'; } catch (e) {}
        function setLang(l) {
            blocks.forEach(function(b) { b.hidden = b.getAttribute('data-lang-block') !== l; });
            buttons.forEach(function(b) { b.classList.toggle('active', b.getAttribute('data-lang') === l); });
            document.documentElement.lang = l === 'id' ? 'id' : 'en';
            try { localStorage.setItem('ymt-lang', l); } catch (e) {}
        }
        buttons.forEach(function(b) { b.addEventListener('click', function() { setLang(b.getAttribute('data-lang')); }); });
        setLang(saved === 'id' ? 'id' : 'en');
    })();
