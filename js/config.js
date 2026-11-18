/* YMT Solution — single source of truth for release + third-party config.
   Update VERSION to match package.json (tools/check.mjs verifies parity). */
export const CONFIG = {
    VERSION: '3.3.7',

    // Contact form (Formspree)
    FORMSPREE_ENDPOINT: 'https://formspree.io/f/mppdpodr',

    // Tawk.to live chat — loaded only after cookie consent
    TAWK_SRC: 'https://embed.tawk.to/58a99879f42d220ab3f5ea31/default',

    // Google Maps — restrict this key by HTTP referrer in Google Cloud Console
    MAPS_API_KEY: 'AIzaSyAAR9KT_jWFWX-IoVuHsyyrG6-vbqNPLkA',

    // Analytics — OFF until a provider + ID are set (see third-party.js / consent.js)
    ANALYTICS_PROVIDER: null, // 'goatcounter' | 'plausible' | null
    ANALYTICS_ID: '',

    // Storage keys shared across scripts
    KEYS: {
        lang: 'ymt-lang',
        theme: 'ymt_theme',
        consent: 'ymt_consent',
        recent: 'ymt_recent',
        shortlist: 'ymt_shortlist',
        pfState: 'ymt_pf_state',
        formDraft: 'ymt_form_draft',
        attribution: 'ymt_attr',
        sharePrefill: 'ymt_share_prefill'
    }
};
