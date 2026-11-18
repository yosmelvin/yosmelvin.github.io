/* YMT Solution — third-party loader registry (ES module).
   Every external script (chat, analytics) registers once with a consent
   gate; consent.js decides *when* gated vendors may load. Maps stays
   self-managed in maps-loader.js (functional, lazy-loaded, not a tracker). */
import { CONFIG } from './config.js';

const registry = {};
const loaded = {};

function hasConsent() {
    try { return localStorage.getItem(CONFIG.KEYS.consent) === 'accepted'; } catch (e) { return false; }
}

export function registerThirdParty(name, def) {
    registry[name] = def;
    return def;
}

// def: { src, attrs?, parent? (default head), onLoad? }
export function loadThirdParty(name) {
    const def = registry[name];
    if (!def || loaded[name]) return false;
    if (def.consent && !hasConsent()) return false;
    loaded[name] = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = def.src;
    if (def.attrs) {
        Object.keys(def.attrs).forEach(function(k) { s.setAttribute(k, def.attrs[k]); });
    }
    (def.parent || document.head).appendChild(s);
    if (def.onLoad) def.onLoad(s);
    return true;
}

export function thirdPartyLoaded(name) { return !!loaded[name]; }

// Flush every consent-gated vendor — called by consent.js on accept/returning consent.
export function flushConsentGated() {
    Object.keys(registry).forEach(function(n) {
        if (registry[n].consent) loadThirdParty(n);
    });
}
