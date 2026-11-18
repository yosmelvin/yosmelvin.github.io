/* Load Google Maps lazily — only when the map section approaches the viewport (ES module).
   NOTE: restrict this API key by HTTP referrer in Google Cloud Console. */
import { CONFIG } from './config.js';

(function() {
    var mapsUrl = 'https://maps.googleapis.com/maps/api/js?key=' + CONFIG.MAPS_API_KEY + '&callback=initYmtMap';
    var mapEl = document.getElementById('map');

    function loadMaps() {
        var s = document.createElement('script');
        s.src = mapsUrl;
        s.async = true;
        s.onerror = function() {
            // Maps blocked/failed — offer a plain link instead of a blank box
            var lat = document.getElementById('latitude');
            var lng = document.getElementById('longitude');
            var q = (lat && lng) ? lat.value + ',' + lng.value : '';
            var a = document.createElement('a');
            a.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q || 'YMT Solution Jakarta');
            a.target = '_blank';
            a.rel = 'noopener';
            a.textContent = (document.documentElement.lang === 'id')
                ? 'Lihat lokasi kantor di Google Maps'
                : 'View office location on Google Maps';
            mapEl.textContent = '';
            mapEl.appendChild(a);
        };
        document.head.appendChild(s);
    }

    if ('IntersectionObserver' in window && mapEl) {
        var io = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                io.disconnect();
                loadMaps();
            }
        }, { rootMargin: '300px' });
        io.observe(mapEl);
    } else {
        loadMaps();
    }
})();

function initYmtMap() {
    //* Fungsi untuk mendapatkan nilai latitude longitude
    function updateMarkerPosition(latLng) {
      document.getElementById('latitude').value = [latLng.lat()]
      document.getElementById('longitude').value = [latLng.lng()]
    }

    var initialLatLng = new google.maps.LatLng(
        document.getElementById('latitude').value,
        document.getElementById('longitude').value
    );
    var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: initialLatLng,
     mapTypeId: google.maps.MapTypeId.ROADMAP
      });
    //posisi awal marker
    var latLng = initialLatLng;

    /* buat marker yang bisa di drag lalu
      panggil fungsi updateMarkerPosition(latLng)
     dan letakan posisi terakhir di id=latitude dan id=longitude
     */
    var marker = new google.maps.Marker({
        position : latLng,
        title : 'YMT Solution',
        map : map,
        draggable : false
      });

    updateMarkerPosition(latLng);
    google.maps.event.addListener(marker, 'drag', function() {
     // ketika marker di drag, otomatis nilai latitude dan longitude
     //menyesuaikan dengan posisi marker
        updateMarkerPosition(marker.getPosition());
      });
    }

// Google Maps invokes this by name via ?callback= — must stay a window global.
window.initYmtMap = initYmtMap;
