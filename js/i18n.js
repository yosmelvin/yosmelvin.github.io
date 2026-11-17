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

            hero_lead: 'AI-First Software House',
            hero_heading: "Let's build solutions with AI",
            hero_btn: 'Explore AI Services',
            hero_btn2: 'View Portfolio',
            booking_badge: 'Now booking AI projects',
            hero_trust_projects: 'Projects',
            hero_trust_partners: 'Partners',
            hero_trust_awards: 'Awards',
            scroll_aria: 'Scroll to services',

            services_title: 'Services',
            services_sub: 'YMT Solution is an AI-first software house. Since 2013 we\'ve shipped 30+ projects — AI trading platforms, smart assistants and automation that turn data into revenue, plus the web, mobile and cloud systems behind them.',
            svc_ecom: 'E-Commerce',
            svc_ecom_d: 'A credible online store, powered by a proper system.',
            svc_resp: 'Responsive Design',
            svc_resp_d: 'Flawless on every screen and platform.',
            svc_sec: 'Security Solutions',
            svc_sec_d: 'Pentest-ready code, hardened infrastructure, compliance-aware architecture — security engineered in from day one, not bolted on later.',
            svc_api: 'Web Service / API',
            svc_api_d: 'We handle data through robust APIs.',
            svc_android: 'Mobile Development',
            svc_android_d: 'We develop Android applications.',
            svc_ios: 'Mobile Development',
            svc_ios_d: 'We develop iOS applications.',
            svc_ai: 'AI Services',
            svc_ai_d: 'Custom AI that actually ships: LLM assistants, automation pipelines, forecasting, computer vision & intelligent integrations — engineered by practitioners, not slide decks.',
            svc_devops: 'Cloud & DevOps',
            svc_devops_d: 'AWS infrastructure, Docker, Terraform, CI/CD pipelines & observability.',

            portfolio_title: 'Portfolio',
            portfolio_sub: "A selection of projects we've designed and built.",
            pf_bm_d: 'Binusmaya website',
            pf_inklo_d: 'Crowdfunding website',
            pf_asak_d: 'ASAK website',
            pf_tome_d: 'TOME website',
            pf_ilogo_d: 'iLogo website',
            pf_lib_d: 'Library System website',
            pf_osppay_d: 'Super app — e-wallet, PPOB & payments',
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
            contact_sub: "Got an AI idea? Tell us — we'll tell you honestly if it's worth building.",
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
            subj_security: 'Security Solution',
            subj_other: 'Other / Not sure',
            contact_send: 'Send Message',
            contact_whatsapp: 'Chat on WhatsApp',
            contact_or: 'or',
            contact_response: 'We typically reply within 24 hours.',

            skip_link: 'Skip to content',
            cookie_text: 'We use cookies and a live-chat service to improve your experience.',
            cookie_accept: 'Accept',
            cookie_decline: 'Decline',
            cookie_settings: 'Cookie Settings',
            cookie_learn: 'Learn more',
            install_app: 'Install App',

            process_title: 'How We Work',
            process_sub: 'A proven process that keeps every project on track.',
            proc_1_t: 'Discover',
            proc_1_d: 'We dig into your goals, users and constraints to define exactly what success looks like.',
            proc_2_t: 'Design',
            proc_2_d: 'Wireframes, UI design and architecture — validated with you before a single line of code.',
            proc_3_t: 'Develop',
            proc_3_d: 'Clean, tested code built in short iterations with CI/CD from day one.',
            proc_4_t: 'Test',
            proc_4_d: 'Automated tests, security review and QA across devices before anything ships.',
            proc_5_t: 'Deploy & Support',
            proc_5_d: 'Zero-downtime releases, monitoring, and ongoing support long after launch.',

            engage_title: 'Ways to work with us',
            engage_1_t: 'Project-Based',
            engage_1_d: 'Fixed scope, fixed timeline, fixed price — ideal for well-defined products and features.',
            engage_2_t: 'Dedicated Team',
            engage_2_d: 'A hand-picked squad embedded in your workflow — developers, designers and QA that feel in-house.',
            engage_3_t: 'Monthly Retainer',
            engage_3_d: 'Ongoing support, improvements and new features on a predictable monthly budget.',
            engage_cta: 'Get started',
            engage_popular: 'Most popular',
            engage_msg_project: "Hi, I'm interested in your Project-Based engagement model.",
            engage_msg_team: "Hi, I'm interested in your Dedicated Team engagement model.",
            engage_msg_retainer: "Hi, I'm interested in your Monthly Retainer engagement model.",
            cv_download: 'Download CV',

            skills_title: 'Our Tech Stack',
            skills_sub: 'Technologies we use to build reliable, scalable products.',
            skg_lang: 'Languages',
            skg_fw: 'Frameworks',
            skg_cloud: 'Cloud & DevOps',
            skg_data: 'Data & Messaging',
            skg_api: 'APIs & Communication',
            skg_obs: 'Observability & AI',

            copy_email: 'Copy email',
            copy_email_aria: 'Copy email address',
            copied: 'Copied!',
            share_label: 'Share this project',
            pm_tech: 'Tech Stack',
            pm_visit: 'Visit Website',
            pm_similar: 'Start a similar project',
            pm_similar_msg: 'I\'m interested in a project similar to "{title}". ',
            pm_gallery: 'Project screenshots',
            pm_brief: 'Copy project brief',
            pm_brief_dl: 'Download project brief',
            pm_brief_done: 'Brief copied!',
            pm_dot_aria: 'Go to project {n}',
            pf_sort: 'Sort',
            pf_sort_aria: 'Sort projects',
            pf_shortlist: 'Shortlist',
            pf_shortlist_add: 'Add to shortlist',
            pf_shortlist_remove: 'Remove from shortlist',
            pf_shortlist_quote: 'Request quote',
            pf_shortlist_clear: 'Clear',
            copy_done: 'Copied to clipboard',
            copy_fail: 'Copy failed',
            pf_shortlist_msg: "Hi, I'd like a quote for these projects: {list}. Please share pricing and timeline.",
            pf_sort_default: 'Featured',
            pf_sort_az: 'A–Z',
            pf_sort_za: 'Z–A',
            pf_recent: 'Recently viewed',
            cf_thanks: 'Thank you',
            cf_sorry: 'Sorry',
            cf_sent: 'Your message has been sent — we\'ll get back to you soon.',
            cf_err_send: 'your message could not be sent. Please try again later or email us directly.',
            cf_offline: 'You appear to be offline — check your connection and try again.',
            cf_not_configured: 'Form is not configured yet. Please email us directly instead.',
            f_all: 'All',
            pf_count: '{n} projects — {cat}',
            pf_search: 'Search projects…',
            filter_aria: 'Filter projects',
            search_clear: 'Clear search',
            pf_empty: 'No projects match — try another search or filter.',
            pf_reset: 'Clear filters',
            skills_view_projects: 'View projects using {tech}',
            f_ai: 'AI',
            f_web: 'Web',
            f_mobile: 'Mobile',
            f_fintech: 'Fintech',
            f_trading: 'Trading',

            faq_title: 'Frequently Asked Questions',
            faq_sub: 'Quick answers about working with us.',
            faq1_q: 'What services does YMT Solution offer?',
            faq1_a: 'AI services lead our work — custom LLM assistants, automation, data analytics and intelligent integrations — backed by full-cycle web, mobile, cloud & DevOps delivery, from MVP to enterprise scale.',
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
            bottom_addr: '<span class="fa fa-building" aria-hidden="true"></span>Jl. Kebon Jeruk Raya Villa Kebon Jeruk Office F1, RT.3/RW.3<br>Jakarta Barat<br>Daerah Khusus Ibukota Jakarta<br>11530',
            bottom_phone: '<span class="fa fa-phone" aria-hidden="true"></span> <a href="tel:+628974142883">+628974142883</a>',
            bottom_whatsapp: 'WhatsApp',
            bottom_email: '<span class="fa fa-envelope" aria-hidden="true"></span>&nbsp;<a href="mailto:ymtsolution@gmail.com">ymtsolution@gmail.com</a>',

            footer_copy: 'Copyright © YMT Solution 2026',
            footer_privacy: 'Privacy Policy',
            footer_terms: 'Terms of Use',
            palette_ph: 'Type to search…',
            palette_title: 'Quick navigation',
            palette_results_aria: 'Quick navigation results',
            cookie_aria: 'Cookie consent',
            palette_nav: 'navigate',
            palette_open: 'open',
            palette_close: 'close',
            palette_empty: 'No results',
            palette_help: 'toggle',
            cheat_title: 'Keyboard shortcuts',
            cheat_palette: 'open palette',
            cheat_help: 'toggle palette',
            cheat_tab: 'cycle results',
            cheat_search: 'search projects',
            sw_update: 'A new version is available.',
            sw_refresh: 'Refresh',
            sticky_cta: 'Start a project',
            est_title: 'Quick project estimator',
            est_sub: "Answer 3 quick questions — we'll prefill your inquiry.",
            est_q1: 'What are you building?',
            est_q2: 'Roughly how long do you need it?',
            est_q3: "Team size you're considering?",
            est_t_rush: 'ASAP / under 4 weeks',
            est_t_month: '1–3 months',
            est_t_quarter: '3–6 months',
            est_t_flex: 'Flexible / ongoing',
            est_team_solo: 'Just me / small team',
            est_team_dept: 'A department',
            est_team_ded: 'Dedicated team',
            est_team_unsure: 'Not sure yet',
            est_next: 'Next →',
            est_back: '← Back',
            est_apply: 'Use this estimate',
            est_reset: 'Reset',
            est_done: 'Estimate ready — review & send below',
            est_budget: 'Indicative range: {range} — final quote after discovery call',
            est_copy: 'Copy estimate',
            est_copied: 'Copied!',
            est_step: 'Step {n} of {total}',
            est_msg: 'Hi! Project estimate:\n- Type: {type}\n- Timeline: {timeline}\n- Team: {team}',
            palette_results: 'results',
            palette_one: 'result',

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


            m9_intro: 'Indonesian super app for digital payments — e-wallet, bill payments (PPOB) and payment gateway.',
            m9_body: 'Ospay Indonesia is a financial technology super app that brings everyday payments into one platform: a Kotlin Android e-wallet (Jetpack Compose) for QR payments and top-ups, PPOB bill payments for electricity, pulsa, BPJS and more, and a payment gateway for merchants to accept online transactions — all routed through a Python Django backend integrated with multiple payment service providers. The roadmap extends to cross-currency transfers, turning Ospay into a regional remittance hub. Infrastructure runs on VPS with Docker containers, Terraform-managed provisioning, CI/CD pipelines, Nginx reverse proxy, and MySQL for transactional data — built for high availability and secure handling of financial flows.',
            m9_date: 'Date: 2026',
            m9_client: 'Client: Ospay Indonesia',
            m9_cat: 'Category: Super App / E-Wallet / Fintech',

            m8_intro: 'Automated trading dashboard & order management.',
            m8_body: 'Robo Trading Hub is an automated trading platform featuring a live market snapshot, real-time order-book stream, trading signal board, pre-market analysis, and order queue management.',
            m8_exclusive: '<span class="label label-primary">Exclusive Project</span> This is a private project available only to our VVIP clients.',
            m8_date: 'Date: 2026',
            m8_client: 'Client: VVIP Client',
            m8_cat: 'Category: Trading Platform',

            pm_vvip: 'VVIP Exclusive',
            badge_vvip: 'VVIP Exclusive',
            badge_live: 'Live',
            badge_nda: 'NDA',
            pm_prev_aria: 'Previous project',
            pm_next_aria: 'Next project',
            pm_close_aria: 'Close project',
            pm_copy_link: 'Copy project link',
            pm_dots_nav: 'Project navigation',
            pm_share_native: 'Share',
            pm_lb_close: 'Close',
            pm_lb_prev: 'Previous image',
            pm_lb_next: 'Next image',
            pm_gallery_aria: 'Project screenshots'
        },

        id: {
            nav_services: 'Layanan',
            nav_skills: 'Keahlian',
            nav_faq: 'FAQ',
            nav_portfolio: 'Portofolio',
            nav_about: 'Tentang',
            nav_team: 'Tim',
            nav_contact: 'Kontak',

            hero_lead: 'Software House Berbasis AI',
            hero_heading: 'Mari wujudkan solusi dengan AI',
            hero_btn: 'Jelajahi Layanan AI',
            hero_btn2: 'Lihat Portofolio',
            booking_badge: 'Sedang menerima proyek AI',
            hero_trust_projects: 'Proyek',
            hero_trust_partners: 'Mitra',
            hero_trust_awards: 'Penghargaan',
            scroll_aria: 'Gulir ke layanan',

            services_title: 'Layanan',
            services_sub: 'YMT Solution adalah software house berbasis AI. Sejak 2013 kami telah merilis 30+ proyek — platform trading berbasis AI, asisten cerdas, dan otomatisasi yang mengubah data menjadi pendapatan, plus sistem web, mobile, dan cloud di baliknya.',
            svc_ecom: 'E-Commerce',
            svc_ecom_d: 'Toko online yang kredibel, didukung sistem yang handal.',
            svc_resp: 'Desain Responsif',
            svc_resp_d: 'Tampilan sempurna di setiap layar dan platform.',
            svc_sec: 'Solusi Keamanan',
            svc_sec_d: 'Kode siap pentest, infrastruktur yang diperkeras, arsitektur patuh regulasi — keamanan direkayasa sejak hari pertama, bukan tempelan belakangan.',
            svc_api: 'Web Service / API',
            svc_api_d: 'Kami menangani data melalui API yang tangguh.',
            svc_android: 'Pengembangan Mobile',
            svc_android_d: 'Kami mengembangkan aplikasi Android.',
            svc_ios: 'Pengembangan Mobile',
            svc_ios_d: 'Kami mengembangkan aplikasi iOS.',
            svc_ai: 'Layanan AI',
            svc_ai_d: 'AI kustom yang benar-benar jadi produk: asisten LLM, pipeline otomatisasi, forecasting, computer vision & integrasi pintar — direkayasa oleh praktisi, bukan slide presentasi.',
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
            pf_osppay_d: 'Super app — e-wallet, PPOB & pembayaran',
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
            contact_sub: 'Punya ide AI? Ceritakan — kami akan jujur memberi tahu apakah ide itu layak dibangun.',
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
            subj_security: 'Solusi Keamanan',
            subj_other: 'Lainnya / Belum tahu',
            contact_send: 'Kirim Pesan',
            contact_whatsapp: 'Chat via WhatsApp',
            contact_or: 'atau',
            contact_response: 'Kami biasanya membalas dalam 24 jam.',

            skip_link: 'Langsung ke konten',
            cookie_text: 'Kami menggunakan cookie dan layanan live-chat untuk meningkatkan pengalaman Anda.',
            cookie_accept: 'Terima',
            cookie_decline: 'Tolak',
            cookie_settings: 'Pengaturan Cookie',
            cookie_learn: 'Selengkapnya',
            install_app: 'Pasang Aplikasi',

            process_title: 'Cara Kami Bekerja',
            process_sub: 'Proses teruji yang menjaga setiap proyek tetap sesuai rencana.',
            proc_1_t: 'Discovery',
            proc_1_d: 'Kami mempelajari tujuan, pengguna, dan kendala Anda untuk mendefinisikan kesuksesan yang tepat.',
            proc_2_t: 'Desain',
            proc_2_d: 'Wireframe, desain UI, dan arsitektur — divalidasi bersama Anda sebelum satu baris kode pun ditulis.',
            proc_3_t: 'Pengembangan',
            proc_3_d: 'Kode bersih dan teruji dalam iterasi singkat dengan CI/CD sejak hari pertama.',
            proc_4_t: 'Pengujian',
            proc_4_d: 'Tes otomatis, tinjauan keamanan, dan QA di berbagai perangkat sebelum apa pun dirilis.',
            proc_5_t: 'Deploy & Dukungan',
            proc_5_d: 'Rilis tanpa downtime, monitoring, dan dukungan berkelanjutan setelah peluncuran.',

            engage_title: 'Cara bekerja sama dengan kami',
            engage_1_t: 'Berbasis Proyek',
            engage_1_d: 'Ruang lingkup, timeline, dan harga tetap — ideal untuk produk dan fitur yang sudah jelas.',
            engage_2_t: 'Tim Dedikasi',
            engage_2_d: 'Satuan khusus yang terintegrasi dalam alur kerja Anda — developer, desainer, dan QA yang terasa seperti tim internal.',
            engage_3_t: 'Retainer Bulanan',
            engage_3_d: 'Dukungan berkelanjutan, perbaikan, dan fitur baru dengan anggaran bulanan yang dapat diprediksi.',
            engage_cta: 'Mulai',
            engage_popular: 'Paling populer',
            engage_msg_project: 'Halo, saya tertarik dengan model kerja Berbasis Proyek Anda.',
            engage_msg_team: 'Halo, saya tertarik dengan model kerja Tim Dedikasi Anda.',
            engage_msg_retainer: 'Halo, saya tertarik dengan model kerja Retainer Bulanan Anda.',
            cv_download: 'Unduh CV',

            skills_title: 'Tech Stack Kami',
            skills_sub: 'Teknologi yang kami gunakan untuk membangun produk yang andal dan skalabel.',
            skg_lang: 'Bahasa Pemrograman',
            skg_fw: 'Framework',
            skg_cloud: 'Cloud & DevOps',
            skg_data: 'Data & Messaging',
            skg_api: 'API & Komunikasi',
            skg_obs: 'Observabilitas & AI',

            copy_email: 'Salin email',
            copy_email_aria: 'Salin alamat email',
            copied: 'Tersalin!',
            share_label: 'Bagikan proyek ini',
            pm_tech: 'Tech Stack',
            pm_visit: 'Kunjungi Website',
            pm_similar: 'Mulai proyek serupa',
            pm_similar_msg: 'Saya tertarik dengan proyek serupa "{title}". ',
            pm_gallery: 'Tangkapan layar proyek',
            pm_brief: 'Salin ringkasan proyek',
            pm_brief_dl: 'Unduh ringkasan proyek',
            pm_brief_done: 'Ringkasan tersalin!',
            pm_dot_aria: 'Buka proyek {n}',
            pf_sort: 'Urutkan',
            pf_sort_aria: 'Urutkan proyek',
            pf_shortlist: 'Daftar Pilihan',
            pf_shortlist_add: 'Tambah ke daftar pilihan',
            pf_shortlist_remove: 'Hapus dari daftar pilihan',
            pf_shortlist_quote: 'Minta Penawaran',
            pf_shortlist_clear: 'Hapus',
            pf_shortlist_msg: 'Halo, saya ingin penawaran untuk proyek-proyek ini: {list}. Mohon info harga dan timeline.',
            copy_done: 'Disalin ke clipboard',
            copy_fail: 'Gagal menyalin',
            pf_sort_default: 'Unggulan',
            pf_sort_az: 'A–Z',
            pf_sort_za: 'Z–A',
            pf_recent: 'Baru saja dilihat',
            cf_thanks: 'Terima kasih',
            cf_sorry: 'Maaf',
            cf_sent: 'Pesan Anda telah terkirim — kami akan segera menghubungi Anda.',
            cf_err_send: 'pesan Anda tidak dapat terkirim. Silakan coba lagi nanti atau email kami langsung.',
            cf_offline: 'Anda tampak offline — periksa koneksi Anda dan coba lagi.',
            cf_not_configured: 'Formulir belum dikonfigurasi. Silakan email kami langsung.',
            f_all: 'Semua',
            pf_count: '{n} proyek — {cat}',
            pf_search: 'Cari proyek…',
            filter_aria: 'Filter proyek',
            search_clear: 'Hapus pencarian',
            pf_empty: 'Tidak ada proyek yang cocok — coba kata kunci atau filter lain.',
            pf_reset: 'Reset filter',
            skills_view_projects: 'Lihat proyek {tech}',
            f_ai: 'AI',
            f_web: 'Web',
            f_mobile: 'Mobile',
            f_fintech: 'Fintech',
            f_trading: 'Trading',

            faq_title: 'Pertanyaan yang Sering Diajukan',
            faq_sub: 'Jawaban cepat seputar bekerja sama dengan kami.',
            faq1_q: 'Layanan apa saja yang ditawarkan YMT Solution?',
            faq1_a: 'Layanan AI adalah fokus utama kami — asisten LLM kustom, otomatisasi, analitik data, dan integrasi cerdas — didukung pengiriman web, mobile, cloud & DevOps end-to-end, dari MVP hingga skala enterprise.',
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
            bottom_addr: '<span class="fa fa-building" aria-hidden="true"></span>Jl. Kebon Jeruk Raya Villa Kebon Jeruk Office F1, RT.3/RW.3<br>Jakarta Barat<br>Daerah Khusus Ibukota Jakarta<br>11530',
            bottom_phone: '<span class="fa fa-phone" aria-hidden="true"></span> <a href="tel:+628974142883">+628974142883</a>',
            bottom_whatsapp: 'WhatsApp',
            bottom_email: '<span class="fa fa-envelope" aria-hidden="true"></span>&nbsp;<a href="mailto:ymtsolution@gmail.com">ymtsolution@gmail.com</a>',

            footer_copy: 'Hak Cipta © YMT Solution 2026',
            footer_privacy: 'Kebijakan Privasi',
            footer_terms: 'Ketentuan Penggunaan',
            palette_ph: 'Ketik untuk mencari…',
            palette_title: 'Navigasi cepat',
            palette_results_aria: 'Hasil navigasi cepat',
            cookie_aria: 'Persetujuan cookie',
            palette_nav: 'navigasi',
            palette_open: 'buka',
            palette_close: 'tutup',
            palette_empty: 'Tidak ada hasil',
            palette_help: 'buka/tutup',
            cheat_title: 'Shortcut keyboard',
            cheat_palette: 'buka palet',
            cheat_help: 'buka/tutup palet',
            cheat_tab: 'putar hasil',
            cheat_search: 'cari proyek',
            sw_update: 'Versi baru tersedia.',
            sw_refresh: 'Muat ulang',
            sticky_cta: 'Mulai proyek',
            est_title: 'Estimator proyek singkat',
            est_sub: "Jawab 3 pertanyaan singkat — kami akan mengisi otomatis pesan Anda.",
            est_q1: 'Apa yang akan Anda bangun?',
            est_q2: 'Kira-kira berapa lama dibutuhkan?',
            est_q3: 'Ukuran tim yang Anda pertimbangkan?',
            est_t_rush: 'SEGERA / di bawah 4 minggu',
            est_t_month: '1–3 bulan',
            est_t_quarter: '3–6 bulan',
            est_t_flex: 'Fleksibel / berkelanjutan',
            est_team_solo: 'Hanya saya / tim kecil',
            est_team_dept: 'Satu departemen',
            est_team_ded: 'Tim khusus (dedicated)',
            est_team_unsure: 'Belum tahu',
            est_next: 'Lanjut →',
            est_back: '← Kembali',
            est_apply: 'Pakai estimasi ini',
            est_reset: 'Ulangi',
            est_done: 'Estimasi siap — tinjau & kirim di bawah',
            est_budget: 'Kisaran indikatif: {range} — harga final setelah discovery call',
            est_copy: 'Salin estimasi',
            est_copied: 'Tersalin!',
            est_step: 'Langkah {n} dari {total}',
            est_msg: 'Halo! Estimasi proyek:\n- Jenis: {type}\n- Timeline: {timeline}\n- Tim: {team}',
            palette_results: 'hasil',
            palette_one: 'hasil',

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


            m9_intro: 'Super app pembayaran digital Indonesia — e-wallet, pembayaran tagihan (PPOB), dan payment gateway.',
            m9_body: 'Ospay Indonesia adalah super app financial technology yang menghadirkan pembayaran sehari-hari dalam satu platform: e-wallet Android berbasis Kotlin (Jetpack Compose) untuk pembayaran QR dan top-up, pembayaran tagihan PPOB untuk listrik, pulsa, BPJS, dan lainnya, serta payment gateway bagi merchant untuk menerima transaksi online — semuanya dirutekan melalui backend Python Django yang terintegrasi dengan berbagai payment service provider. Roadmap-nya mencakup transfer antar-mata-uang, menjadikan Ospay sebagai hub remitansi regional. Infrastruktur berjalan di VPS dengan container Docker, provisioning berbasis Terraform, pipeline CI/CD, reverse proxy Nginx, dan MySQL untuk data transaksional — dibangun untuk high availability dan penanganan arus keuangan yang aman.',
            m9_date: 'Tanggal: 2026',
            m9_client: 'Klien: Ospay Indonesia',
            m9_cat: 'Kategori: Super App / E-Wallet / Fintech',

            m8_intro: 'Dashboard trading otomatis & manajemen order.',
            m8_body: 'Robo Trading Hub adalah platform trading otomatis dengan market snapshot langsung, order-book stream real-time, papan sinyal trading, analisis pra-pasar, dan manajemen antrian order.',
            m8_exclusive: '<span class="label label-primary">Proyek Eksklusif</span> Ini adalah proyek privat yang hanya tersedia untuk klien VVIP kami.',
            m8_date: 'Tanggal: 2026',
            m8_client: 'Klien: Klien VVIP',
            m8_cat: 'Kategori: Platform Trading',

            pm_vvip: 'Eksklusif VVIP',
            badge_vvip: 'Eksklusif VVIP',
            badge_live: 'Live',
            badge_nda: 'NDA',
            pm_prev_aria: 'Proyek sebelumnya',
            pm_next_aria: 'Proyek berikutnya',
            pm_close_aria: 'Tutup proyek',
            pm_copy_link: 'Salin tautan proyek',
            pm_dots_nav: 'Navigasi proyek',
            pm_share_native: 'Bagikan',
            pm_lb_close: 'Tutup',
            pm_lb_prev: 'Gambar sebelumnya',
            pm_lb_next: 'Gambar berikutnya',
            pm_gallery_aria: 'Tangkapan layar proyek'
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

        // allowlist sanitizer: only <br> survives — dicts stay trusted but the
        // sink can never inject markup even if a translation is ever compromised
        function safeHtml(v) {
            return String(v).replace(/<(?!\/?br\b)[^>]*>/gi, '');
        }
        document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
            var key = el.getAttribute('data-i18n-html');
            if (dict[key] != null) el.innerHTML = safeHtml(dict[key]);
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
        try {
            var qp = new URLSearchParams(window.location.search).get('lang');
            if (qp === 'en' || qp === 'id') {
                saved = qp;
                localStorage.setItem(STORAGE_KEY, saved);
            } else {
                saved = localStorage.getItem(STORAGE_KEY) || 'en';
            }
        } catch (e) {}
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
