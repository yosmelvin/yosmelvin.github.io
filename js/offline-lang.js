/* offline.html — bilingual labels (?lang=id or localStorage ymt-lang) */
(function() {
	var lang = new URLSearchParams(location.search).get('lang');
	if (!lang) {
		try { lang = localStorage.getItem('ymt-lang'); } catch (e) {}
	}
	if (lang !== 'id') return;
	var dict = {
		title: "Anda sedang offline",
		body: 'Sepertinya koneksi internet Anda terputus. Halaman yang Anda tuju belum tersimpan di cache — sambungkan kembali dan coba lagi.',
		home: 'Kembali ke beranda',
		portfolio: 'Lihat portofolio',
		contact: 'Hubungi kami'
	};
	document.documentElement.lang = 'id';
	document.title = 'Offline — YMT Solution';
	document.querySelectorAll('[data-off]').forEach(function(el) {
		var key = el.getAttribute('data-off');
		if (dict[key]) el.textContent = dict[key];
	});
})();
