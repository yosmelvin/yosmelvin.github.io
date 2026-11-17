/* Register the service worker + offer a refresh when a new version activates. */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(reg) {
            reg.addEventListener('updatefound', function() {
                var worker = reg.installing;
                if (!worker) return;
                worker.addEventListener('statechange', function() {
                    if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateToast();
                    }
                });
            });
        }).catch(function() {});
    });

    var refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function() {
        if (refreshing) return;
        refreshing = true;
        location.reload();
    });

    function showUpdateToast() {
        if (document.getElementById('swToast')) return;
        var i18n = window.YMTI18n;
        var t = function(k, fb) { return (i18n && i18n.t) ? i18n.t(k) : fb; };
        var toast = document.createElement('div');
        toast.id = 'swToast';
        toast.className = 'sw-toast';
        toast.setAttribute('role', 'status');
        var msg = document.createElement('span');
        msg.textContent = t('sw_update', 'A new version is available.');
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = t('sw_refresh', 'Refresh');
        btn.addEventListener('click', function() { location.reload(); });
        toast.appendChild(msg);
        toast.appendChild(btn);
        document.body.appendChild(toast);
    }
}
