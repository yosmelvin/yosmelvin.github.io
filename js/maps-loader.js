// Load Google Maps lazily — only when the map section approaches the viewport.
    // NOTE: restrict this API key by HTTP referrer in Google Cloud Console.
    (function() {
        var mapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAAR9KT_jWFWX-IoVuHsyyrG6-vbqNPLkA&callback=initYmtMap';
        var mapEl = document.getElementById('map');

        function loadMaps() {
            var s = document.createElement('script');
            s.src = mapsUrl;
            s.async = true;
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

    var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: new google.maps.LatLng($("#latitude").val(),$("#longitude").val()),
     mapTypeId: google.maps.MapTypeId.ROADMAP
      });
    //posisi awal marker
    var latLng = new google.maps.LatLng($("#latitude").val(),$("#longitude").val());

    /* buat marker yang bisa di drag lalu
      panggil fungsi updateMarkerPosition(latLng)
     dan letakan posisi terakhir di id=latitude dan id=longitude
     */
    var marker = new google.maps.Marker({
        position : latLng,
        title : 'lokasi',
        map : map,
        draggable : true
      });

    updateMarkerPosition(latLng);
    google.maps.event.addListener(marker, 'drag', function() {
     // ketika marker di drag, otomatis nilai latitude dan longitude
     //menyesuaikan dengan posisi marker
        updateMarkerPosition(marker.getPosition());
      });
    }
