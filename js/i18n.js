/* YMT Solution — EN/ID language switcher
   Elements opt in via data-i18n (text), data-i18n-html (innerHTML),
   data-i18n-ph (placeholder) and data-i18n-aria (aria-label).
   Choice is persisted in localStorage. */
(function() {
    'use strict';

    var I18N = {
        en: {
            nav_services: 'Services',
            nav_skills: 'Skills',
            nav_faq: 'FAQ',
            nav_portfolio: 'Portfolio',
            nav_about: 'About',
            nav_team: 'Team',
            nav_contact: 'Contact',

            hero_lead: 'Welcome to Our Software House!',
            hero_heading: "Let's build solutions with IT",
            hero_btn: 'Tell Me More',
            booking_badge: 'Now booking new projects',
            scroll_aria: 'Scroll to services',

            services_title: 'Services',
            services_sub: 'Since 2013, YMT Solution has been building premium company profile websites, distinctive logo designs, and digital marketing campaigns that drive real results. Our skilled, creative, and highly competent team is ready to help with all your needs.',
            svc_ecom: 'E-Commerce',
            svc_ecom_d: 'A credible online store, powered by a proper system.',
            svc_resp: 'Responsive Design',
            svc_resp_d: 'Flawless on every screen and platform.',
            svc_sec: 'Web Security',
            svc_sec_d: 'We take cyber security seriously.',
            svc_api: 'Web Service / API',
            svc_api_d: 'We handle data through robust APIs.',
            svc_android: 'Mobile Development',
            svc_android_d: 'We develop Android applications.',
            svc_ios: 'Mobile Development',
            svc_ios_d: 'We develop iOS applications.',
            svc_ai: 'AI Services',
            svc_ai_d: 'AI-powered solutions: smart assistants, automation, data analytics & intelligent integrations.',

            portfolio_title: 'Portfolio',
            portfolio_sub: "A selection of projects we've designed and built.",
            pf_bm_d: 'Binusmaya website',
            pf_inklo_d: 'Crowdfunding website',
            pf_asak_d: 'ASAK website',
            pf_tome_d: 'TOME website',
            pf_ilogo_d: 'iLogo website',
            pf_lib_d: 'Library System website',
            pf_saham_d: 'AI stock screener',
            pf_robo_d: 'Automated trading platform',

            stats_title: 'Our Track Record',
            stats_sub: 'Thank you for trusting us.',
            stat_projects: 'Projects',
            stat_partner: 'Partners',
            stat_members: 'Members',
            stat_awards: 'Awards',

            about_title: 'About',
            about_sub: 'This is our story.',
            tl1_sub: 'Our Humble Beginnings',
            tl1_body: 'We built our skills, relationships, and infrastructure to deliver the best service possible!',
            tl2_sub: 'A Software House Is Born',
            tl2_body: 'We focused on web development — and yes, we earned the trust of many clients that helped us become a better software house. Thank you for your support!',
            tl3_sub: 'Transition to Full Service',
            tl3_body: 'We expanded into mobile platforms — Android and iOS!',
            tl4_sub: 'Phase Two: Expansion',
            tl4_body: 'We earned the trust of major companies!',
            tl5_sub: 'Embracing the AI Era',
            tl5_body: 'We have fully adapted to the AI era, enabling us to handle high-scale projects with massive traffic and generate millions of dollars in GMV each day.',
            tl6_cta: 'Be Part<br>Of Our<br>Story!',

            team_title: 'Meet Our Team',
            team_sub: 'Our team brings more than ten years of experience across every field.',
            team_role: 'Lead Developer',
            team_cta: "What are you waiting for? Let's start now!",

            contact_title: 'Contact Us',
            contact_sub: "We're always here for you.",
            ph_name: 'Your Name *',
            ph_email: 'Your Email *',
            ph_phone: 'Your Phone *',
            ph_message: 'Your Message *',
            lbl_name: 'Name',
            lbl_email: 'Email Address',
            lbl_phone: 'Phone Number',
            lbl_message: 'Message',
            lbl_subject: 'What do you need?',
            subj_placeholder: 'Select a project type…',
            subj_web: 'Website / Web App',
            subj_mobile: 'Mobile App',
            subj_ai: 'AI / ML Solution',
            subj_cloud: 'Cloud / DevOps',
            subj_other: 'Other / Not sure',
            contact_send: 'Send Message',
            contact_whatsapp: 'Chat on WhatsApp',
            contact_or: 'or',
            contact_response: 'We typically reply within 24 hours.',

            skip_link: 'Skip to content',
            cookie_text: 'We use cookies and a live-chat service to improve your experience.',
            cookie_accept: 'Accept',
            cookie_decline: 'Decline',

            skills_title: 'Our Tech Stack',
            skills_sub: 'Technologies we use to build reliable, scalable products.',
            skg_lang: 'Languages',
            skg_fw: 'Frameworks',
            skg_cloud: 'Cloud & DevOps',
            skg_data: 'Data & Messaging',
            skg_api: 'APIs & Communication',
            skg_obs: 'Observability & AI',

            copy_email: 'Copy email',
            copied: 'Copied!',
            share_label: 'Share this project',
            pm_tech: 'Tech Stack',
            pm_visit: 'Visit Website',
            f_all: 'All',
            f_web: 'Web',
            f_mobile: 'Mobile',
            f_fintech: 'Fintech',
            f_trading: 'Trading',

            faq_title: 'Frequently Asked Questions',
            faq_sub: 'Quick answers about working with us.',
            faq1_q: 'What services does YMT Solution offer?',
            faq1_a: 'We offer web development, mobile applications, AI services, digital marketing, and UI/UX design — from MVPs to enterprise-scale systems.',
            faq2_q: 'How long does a typical project take?',
            faq2_a: 'Timelines depend on scope. A landing page may take 1–2 weeks, while a full platform typically takes 2–4 months. We provide a detailed timeline after discovery.',
            faq3_q: 'Do you work with clients outside Indonesia?',
            faq3_a: 'Yes — we collaborate remotely with clients worldwide using agile workflows, video calls, and shared project management tools.',
            faq4_q: 'What is your tech stack?',
            faq4_a: 'Python, Java, Node.js and Go on the backend; Django, Laravel and React up front; deployed on AWS with Docker, Terraform and CI/CD; Kafka/SQS messaging; PostgreSQL/MySQL/Redis data; monitored with Grafana, New Relic and Datadog.',
            faq5_q: 'Do you provide maintenance after launch?',
            faq5_a: 'Yes. We offer support and maintenance packages covering updates, monitoring, bug fixes, and feature enhancements.',

            clients_label: 'Trusted by industry leaders',
            bottom_contact: 'Contact',
            bottom_addr: '<span class="glyphicon glyphicon-business" aria-hidden="true"></span>Jl. Kebon Jeruk Raya Villa Kebon Jeruk Office F1, RT.3/RW.3<br>Jakarta Barat<br>Daerah Khusus Ibukota Jakarta<br>11530',
            bottom_phone: '<span class="glyphicon glyphicon-phone" aria-hidden="true"></span> <a href="tel:+628974142883">+628974142883</a>',
            bottom_whatsapp: 'WhatsApp',
            bottom_email: '<span class="glyphicon glyphicon-envelope" aria-hidden="true"></span>&nbsp;<a href="mailto:ymtsolution@gmail.com">ymtsolution@gmail.com</a>',

            footer_copy: 'Copyright © YMT Solution 2026',
            footer_privacy: 'Privacy Policy',
            footer_terms: 'Terms of Use',
            footer_cookies: 'Cookie Settings',
            palette_ph: 'Type to search…',
            palette_nav: 'navigate',
            palette_open: 'open',
            palette_close: 'close',
            palette_empty: 'No results',

            modal_close: '<i class="fa fa-times"></i> Close Project',

            m1_intro: 'Website for Binus University.',
            m1_body: 'This website is used by all Binus students for scheduling, grade distribution, forums, and other lecture-related activities.',
            m1_visit: '<strong>Want to see the website?</strong> Visit <a href="https://binusmaya.binus.ac.id">binusmaya.binus.ac.id</a>.',
            m1_date: 'Date: July 2014',
            m1_client: 'Client: IT Division Binus',
            m1_cat: 'Category: Web Development',

            m2_intro: 'Crowdfunding website.',
            m2_body: '<a href="http://inklo.id">inklo.id</a> is a website builder for designers. inklo.id contains components and complex blocks (HTML Bootstrap themes) which can easily be integrated into almost any design. All of these components are made in the same style, and can easily be integrated into projects, allowing you to create hundreds of solutions for your future projects.',
            m2_visit: 'You can preview inklo.id <a href="https://www.inklo.id">here</a>.',

            m3_intro: 'ASAK website.',
            m3_body: 'A platform connecting donors with students.',

            m4_intro: 'Tolong Menolong system.',
            m4_body: 'TOME connects people who want to help with people who need a hand.',

            m5_intro: 'iLogo website.',
            m5_body: 'The company profile site for iLogo, built with the Yii Framework.',

            m6_intro: 'Library System website.',
            m6_body: 'This large-scale project has three main systems: the public website, the admin backend, and the onsite website. It integrates book readers and card readers connected to the website.',

            m7_intro: 'AI-powered stock screener & analytics platform.',
            m7_body: 'Saham AI is a web application for the Indonesian stock market (BEI). It helps investors screen stocks, build watchlists, and receive timely market alerts via WhatsApp. The platform offers a Pro subscription tier with premium features.',
            m7_visit: '<strong>Want to see it?</strong>You can visit at <a href="https://sahamai.web.id/" target="_blank" rel="noopener">sahamai.web.id</a>.',
            m7_date: 'Date: 2026',
            m7_client: 'Client: Sahamai',
            m7_cat: 'Category: Web App / Fintech',

            m8_intro: 'Automated trading dashboard & order management.',
            m8_body: 'Robo Trading Hub is an automated trading platform featuring a live market snapshot, real-time order-book stream, trading signal board, pre-market analysis, and order queue management.',
            m8_exclusive: '<span class="label label-primary">Exclusive Project</span> This is a private project available only to our VVIP clients.',
            m8_date: 'Date: 2026',
            m8_client: 'Client: VVIP Client',
            m8_cat: 'Category: Trading Platform',

            pm_visit: 'Visit Website',
            pm_vvip: 'VVIP Exclusive',
            badge_vvip: 'VVIP Exclusive',
            badge_live: 'Live',
            badge_nda: 'NDA',
            pm_prev_aria: 'Previous project',
            pm_next_aria: 'Next project',
            pm_close_aria: 'Close project'
        },

        id: {
            nav_services: 'Layanan',
            nav_skills: 'Keahlian',
            nav_faq: 'FAQ',
            nav_portfolio: 'Portofolio',
            nav_about: 'Tentang',
            nav_team: 'Tim',
            nav_contact: 'Kontak',

            hero_lead: 'Selamat Datang di Software House Kami!',
            hero_heading: 'Mari wujudkan solusi bersama IT',
            hero_btn: 'Selengkapnya',
            booking_badge: 'Sedang menerima proyek baru',
            scroll_aria: 'Gulir ke layanan',

            services_title: 'Layanan',
            services_sub: 'Sejak 2013, YMT Solution telah membangun website company profile premium, desain logo yang khas, dan kampanye digital marketing yang mendatangkan hasil nyata. Tim kami yang terampil, kreatif, dan kompeten siap membantu segala kebutuhan Anda.',
            svc_ecom: 'E-Commerce',
            svc_ecom_d: 'Toko online yang kredibel, didukung sistem yang handal.',
            svc_resp: 'Desain Responsif',
            svc_resp_d: 'Tampilan sempurna di setiap layar dan platform.',
            svc_sec: 'Keamanan Website',
            svc_sec_d: 'Kami menangani keamanan siber dengan serius.',
            svc_api: 'Web Service / API',
            svc_api_d: 'Kami menangani data melalui API yang tangguh.',
            svc_android: 'Pengembangan Mobile',
            svc_android_d: 'Kami mengembangkan aplikasi Android.',
            svc_ios: 'Pengembangan Mobile',
            svc_ios_d: 'Kami mengembangkan aplikasi iOS.',
            svc_ai: 'Layanan AI',
            svc_ai_d: 'Solusi berbasis AI: asisten cerdas, otomatisasi, analitik data & integrasi pintar.',
            svc_devops: 'Cloud & DevOps',
            svc_devops_d: 'Infrastruktur AWS, Docker, Terraform, pipeline CI/CD & observabilitas.',

            portfolio_title: 'Portofolio',
            portfolio_sub: 'Beberapa proyek yang telah kami rancang dan bangun.',
            pf_bm_d: 'Website Binusmaya',
            pf_inklo_d: 'Website crowdfunding',
            pf_asak_d: 'Website ASAK',
            pf_tome_d: 'Website TOME',
            pf_ilogo_d: 'Website iLogo',
            pf_lib_d: 'Website Sistem Perpustakaan',
            pf_saham_d: 'Screener saham berbasis AI',
            pf_robo_d: 'Platform trading otomatis',

            stats_title: 'Rekam Jejak Kami',
            stats_sub: 'Terima kasih atas kepercayaan Anda.',
            stat_projects: 'Proyek',
            stat_partner: 'Mitra',
            stat_members: 'Anggota',
            stat_awards: 'Penghargaan',

            about_title: 'Tentang Kami',
            about_sub: 'Inilah kisah kami.',
            tl1_sub: 'Awal yang Sederhana',
            tl1_body: 'Kami membangun keahlian, relasi, dan infrastruktur untuk memberikan layanan terbaik!',
            tl2_sub: 'Sebuah Software House Lahir',
            tl2_body: 'Kami fokus pada pengembangan web — dan ya, kami memenangkan kepercayaan banyak klien yang membantu kami menjadi software house yang lebih baik. Terima kasih atas dukungannya!',
            tl3_sub: 'Transisi ke Layanan Penuh',
            tl3_body: 'Kami berekspansi ke platform mobile — Android dan iOS!',
            tl4_sub: 'Fase Dua: Ekspansi',
            tl4_body: 'Kami memenangkan kepercayaan perusahaan-perusahaan besar!',
            tl5_sub: 'Meraih Era AI',
            tl5_body: 'Kami telah sepenuhnya beradaptasi dengan era AI, sehingga mampu menangani proyek berskala besar dengan traffic masif dan menghasilkan GMV jutaan dolar setiap hari.',
            tl6_cta: 'Jadilah Bagian<br>Dari Kisah<br>Kami!',

            team_title: 'Kenalan dengan Tim Kami',
            team_sub: 'Tim kami memiliki pengalaman lebih dari sepuluh tahun di setiap bidang.',
            team_role: 'Lead Developer',
            team_cta: 'Apa yang Anda tunggu? Mari mulai sekarang!',

            contact_title: 'Hubungi Kami',
            contact_sub: 'Kami selalu siap membantu Anda.',
            ph_name: 'Nama Anda *',
            ph_email: 'Email Anda *',
            ph_phone: 'Telepon Anda *',
            ph_message: 'Pesan Anda *',
            lbl_name: 'Nama',
            lbl_email: 'Alamat Email',
            lbl_phone: 'Nomor Telepon',
            lbl_message: 'Pesan',
            lbl_subject: 'Apa yang Anda butuhkan?',
            subj_placeholder: 'Pilih jenis proyek…',
            subj_web: 'Website / Web App',
            subj_mobile: 'Aplikasi Mobile',
            subj_ai: 'Solusi AI / ML',
            subj_cloud: 'Cloud / DevOps',
            subj_other: 'Lainnya / Belum tahu',
            contact_send: 'Kirim Pesan',
            contact_whatsapp: 'Chat via WhatsApp',
            contact_or: 'atau',
            contact_response: 'Kami biasanya membalas dalam 24 jam.',

            skip_link: 'Langsung ke konten',
            cookie_text: 'Kami menggunakan cookie dan layanan live-chat untuk meningkatkan pengalaman Anda.',
            cookie_accept: 'Terima',
            cookie_decline: 'Tolak',

            skills_title: 'Tech Stack Kami',
            skills_sub: 'Teknologi yang kami gunakan untuk membangun produk yang andal dan skalabel.',
            skg_lang: 'Bahasa Pemrograman',
            skg_fw: 'Framework',
            skg_cloud: 'Cloud & DevOps',
            skg_data: 'Data & Messaging',
            skg_api: 'API & Komunikasi',
            skg_obs: 'Observabilitas & AI',

            copy_email: 'Salin email',
            copied: 'Tersalin!',
            share_label: 'Bagikan proyek ini',
            pm_tech: 'Tech Stack',
            pm_visit: 'Kunjungi Website',
            f_all: 'Semua',
            f_web: 'Web',
            f_mobile: 'Mobile',
            f_fintech: 'Fintech',
            f_trading: 'Trading',

            faq_title: 'Pertanyaan yang Sering Diajukan',
            faq_sub: 'Jawaban cepat seputar bekerja sama dengan kami.',
            faq1_q: 'Layanan apa saja yang ditawarkan YMT Solution?',
            faq1_a: 'Kami menyediakan pengembangan web, aplikasi mobile, layanan AI, digital marketing, dan desain UI/UX — dari MVP hingga sistem skala enterprise.',
            faq2_q: 'Berapa lama waktu pengerjaan proyek?',
            faq2_a: 'Tergantung lingkupnya. Landing page bisa memakan waktu 1–2 minggu, sementara platform penuh biasanya 2–4 bulan. Kami memberikan timeline detail setelah tahap discovery.',
            faq3_q: 'Apakah bekerja dengan klien di luar Indonesia?',
            faq3_a: 'Ya — kami berkolaborasi secara remote dengan klien di seluruh dunia menggunakan alur kerja agile, video call, dan tools project management.',
            faq4_q: 'Apa tech stack yang digunakan?',
            faq4_a: 'Python, Java, Node.js, dan Go di backend; Django, Laravel, dan React di frontend; dideploy di AWS dengan Docker, Terraform, dan CI/CD; messaging Kafka/SQS; database PostgreSQL/MySQL/Redis; dimonitor dengan Grafana, New Relic, dan Datadog.',
            faq5_q: 'Apakah ada maintenance setelah peluncuran?',
            faq5_a: 'Ya. Kami menyediakan paket dukungan dan maintenance meliputi update, monitoring, perbaikan bug, dan penambahan fitur.',

            clients_label: 'Dipercaya oleh pemimpin industri',
            bottom_contact: 'Kontak',
            bottom_addr: '<span class="glyphicon glyphicon-business" aria-hidden="true"></span>Jl. Kebon Jeruk Raya Villa Kebon Jeruk Office F1, RT.3/RW.3<br>Jakarta Barat<br>Daerah Khusus Ibukota Jakarta<br>11530',
            bottom_phone: '<span class="glyphicon glyphicon-phone" aria-hidden="true"></span> <a href="tel:+628974142883">+628974142883</a>',
            bottom_whatsapp: 'WhatsApp',
            bottom_email: '<span class="glyphicon glyphicon-envelope" aria-hidden="true"></span>&nbsp;<a href="mailto:ymtsolution@gmail.com">ymtsolution@gmail.com</a>',

            footer_copy: 'Hak Cipta © YMT Solution 2026',
            footer_privacy: 'Kebijakan Privasi',
            footer_terms: 'Ketentuan Penggunaan',
            footer_cookies: 'Pengaturan Cookie',
            palette_ph: 'Ketik untuk mencari…',
            palette_nav: 'navigasi',
            palette_open: 'buka',
            palette_close: 'tutup',
            palette_empty: 'Tidak ada hasil',

            modal_close: '<i class="fa fa-times"></i> Tutup Proyek',

            m1_intro: 'Website untuk Binus University.',
            m1_body: 'Website ini digunakan seluruh mahasiswa Binus untuk penjadwalan, distribusi nilai, forum, dan kegiatan perkuliahan lainnya.',
            m1_visit: '<strong>Ingin melihat website?</strong> Kunjungi <a href="https://binusmaya.binus.ac.id">binusmaya.binus.ac.id</a>.',
            m1_date: 'Tanggal: Juli 2014',
            m1_client: 'Klien: Divisi IT Binus',
            m1_cat: 'Kategori: Pengembangan Web',

            m2_intro: 'Website crowdfunding.',
            m2_body: '<a href="http://inklo.id">inklo.id</a> adalah pembuat website untuk desainer. inklo.id berisi komponen dan blok kompleks (tema HTML Bootstrap) yang dapat dengan mudah diintegrasikan ke hampir semua desain. Semua komponen ini dibuat dengan gaya yang sama dan dapat diintegrasikan ke dalam proyek, memungkinkan Anda membuat ratusan solusi untuk proyek Anda di masa depan.',
            m2_visit: 'Anda dapat melihat pratinjau inklo.id <a href="https://www.inklo.id">di sini</a>.',

            m3_intro: 'Website ASAK.',
            m3_body: 'Platform yang menghubungkan donatur dengan mahasiswa.',

            m4_intro: 'Sistem Tolong Menolong.',
            m4_body: 'TOME menghubungkan orang yang ingin membantu dengan orang yang membutuhkan bantuan.',

            m5_intro: 'Website iLogo.',
            m5_body: 'Company profile untuk iLogo, dibangun dengan Yii Framework.',

            m6_intro: 'Website Sistem Perpustakaan.',
            m6_body: 'Proyek berskala besar ini terdiri dari tiga sistem utama: website publik, backend admin, dan website onsite. Proyek ini mengintegrasikan book reader dan card reader yang terhubung dengan website.',

            m7_intro: 'Platform screener & analitik saham berbasis AI.',
            m7_body: 'Saham AI adalah aplikasi web untuk pasar saham Indonesia (BEI). Membantu investor menyaring saham, menyusun watchlist, dan menerima notifikasi pasar tepat waktu melalui WhatsApp. Platform ini menawarkan paket Pro dengan fitur premium.',
            m7_visit: '<strong>Ingin melihatnya?</strong>Anda dapat mengunjunginya di <a href="https://sahamai.web.id/" target="_blank" rel="noopener">sahamai.web.id</a>.',
            m7_date: 'Tanggal: 2026',
            m7_client: 'Klien: Sahamai',
            m7_cat: 'Kategori: Aplikasi Web / Fintech',

            m8_intro: 'Dashboard trading otomatis & manajemen order.',
            m8_body: 'Robo Trading Hub adalah platform trading otomatis dengan market snapshot langsung, order-book stream real-time, papan sinyal trading, analisis pra-pasar, dan manajemen antrian order.',
            m8_exclusive: '<span class="label label-primary">Proyek Eksklusif</span> Ini adalah proyek privat yang hanya tersedia untuk klien VVIP kami.',
            m8_date: 'Tanggal: 2026',
            m8_client: 'Klien: Klien VVIP',
            m8_cat: 'Kategori: Platform Trading',

            pm_visit: 'Kunjungi Website',
            pm_vvip: 'Eksklusif VVIP',
            badge_vvip: 'Eksklusif VVIP',
            badge_live: 'Live',
            badge_nda: 'NDA',
            pm_prev_aria: 'Proyek sebelumnya',
            pm_next_aria: 'Proyek berikutnya',
            pm_close_aria: 'Tutup proyek'
        }
    };

    var STORAGE_KEY = 'ymt-lang';
    var currentLang = 'en';

    function applyLang(lang) {
        var dict = I18N[lang] || I18N.en;
        lang = I18N[lang] ? lang : 'en';
        currentLang = lang;

        document.documentElement.lang = (lang === 'id') ? 'id' : 'en';

        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            if (dict[key] != null) el.textContent = dict[key];
        });

        document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
            var key = el.getAttribute('data-i18n-html');
            if (dict[key] != null) el.innerHTML = dict[key];
        });

        document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
            var key = el.getAttribute('data-i18n-ph');
            if (dict[key] != null) el.setAttribute('placeholder', dict[key]);
        });

        document.querySelectorAll('[data-i18n-aria]').forEach(function(el) {
            var key = el.getAttribute('data-i18n-aria');
            if (dict[key] != null) el.setAttribute('aria-label', dict[key]);
        });

        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

        document.dispatchEvent(new CustomEvent('ymt:langchange', { detail: lang }));
    }

    function t(key) {
        var dict = I18N[currentLang] || I18N.en;
        if (dict[key] != null) return dict[key];
        return I18N.en[key] != null ? I18N.en[key] : key;
    }

    function init() {
        var saved = 'en';
        try { saved = localStorage.getItem(STORAGE_KEY) || 'en'; } catch (e) {}
        applyLang(saved);

        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                applyLang(btn.getAttribute('data-lang'));
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.YMTI18n = { apply: applyLang, t: t };
})();
