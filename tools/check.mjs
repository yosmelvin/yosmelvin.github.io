#!/usr/bin/env node
/* Smoke checks for the static site — run with `npm run check`.
   1. Syntax-check every JS file (node --check, ESM-aware via package type).
   2. Local asset references in HTML/JS resolve to real files.
   3. i18n: EN/ID key parity per namespace + every data-i18n* key used in
      HTML exists in the matching dictionary namespace.
   4. js/config.js VERSION matches package.json.
   5. sw.js CACHE name matches the derived version. */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;
const fail = (msg) => { failures++; console.error('  ✗ ' + msg); };
const ok = (msg) => console.log('  ✓ ' + msg);

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const { DICT } = await import(join(root, 'js/i18n-dict.js'));
const { CONFIG } = await import(join(root, 'js/config.js'));

// ── 1. syntax ──────────────────────────────────────────────────────────
console.log('JS syntax');
const jsFiles = [
    ...readdirSync(join(root, 'js')).filter(f => f.endsWith('.js')).map(f => 'js/' + f),
    'posts/posts.js', 'sw.js', 'tools/build-sw.mjs', 'tools/check.mjs'
];
for (const f of jsFiles) {
    try {
        execFileSync('node', ['--check', join(root, f)], { stdio: 'pipe' });
    } catch (e) {
        fail(`${f}: ${String(e.stderr).split('\n').find(l => l.trim()) || 'syntax error'}`);
    }
}
if (!failures) ok(`${jsFiles.length} files parse`);

// ── 2. asset references ────────────────────────────────────────────────
console.log('Asset references');
const SKIP = /^(https?:|data:|mailto:|tel:|#|javascript:)/i;
const EXT = /\.(css|js|mjs|json|webp|png|jpe?g|gif|svg|ico|woff2?|ttf|otf|txt|xml|html?)$/i;
let assetFails = 0;
function checkAsset(raw, baseDir, from) {
    if (!raw || SKIP.test(raw)) return;
    const p = raw.split(/[?#]/)[0];
    if (!p || !EXT.test(p)) return;
    const abs = p.startsWith('/') ? p.slice(1) : join(baseDir, p);
    if (!existsSync(join(root, abs))) { assetFails++; fail(`missing asset ${raw} (referenced by ${from})`); }
}
const htmlFiles = [
    ...readdirSync(root).filter(f => f.endsWith('.html')).map(f => ({ f, dir: '' })),
    ...readdirSync(join(root, 'posts')).filter(f => f.endsWith('.html')).map(f => ({ f: 'posts/' + f, dir: 'posts' }))
];
for (const { f, dir } of htmlFiles) {
    const html = readFileSync(join(root, f), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
    for (const m of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) checkAsset(m[1], dir, f);
    for (const m of html.matchAll(/\bsrcset="([^"]+)"/g)) {
        m[1].split(',').forEach(c => checkAsset(c.trim().split(/\s+/)[0], dir, f));
    }
}
// ES module imports
for (const f of jsFiles.filter(f => f.endsWith('.js') && f.startsWith('js/'))) {
    const src = readFileSync(join(root, f), 'utf8');
    for (const m of src.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
        const target = join(root, 'js', m[1]);
        if (!existsSync(target)) { assetFails++; fail(`unresolved import ${m[1]} in ${f}`); }
    }
}
for (const m of readFileSync(join(root, 'posts/posts.js'), 'utf8').matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
    const target = join(root, 'posts', m[1]);
    if (!existsSync(target)) { assetFails++; fail(`unresolved import ${m[1]} in posts/posts.js`); }
}
if (!assetFails) ok('all local references resolve');

// ── 3. i18n ────────────────────────────────────────────────────────────
console.log('i18n dictionaries');
let i18nFails = 0;
for (const ns of Object.keys(DICT)) {
    const enKeys = Object.keys(DICT[ns].en).sort();
    const idKeys = Object.keys(DICT[ns].id).sort();
    const missingId = enKeys.filter(k => !DICT[ns].id[k]);
    const missingEn = idKeys.filter(k => !DICT[ns].en[k]);
    if (missingId.length || missingEn.length) {
        i18nFails++;
        fail(`${ns}: key parity — missing in id: [${missingId}] missing in en: [${missingEn}]`);
    }
}
if (!i18nFails) ok(`key parity OK (${Object.entries(DICT).map(([k, v]) => `${k}:${Object.keys(v.en).length}`).join(', ')})`);

// data-i18n usage vs namespace
const NS_FOR = { 'index.html': 'site', '404.html': 'p404' };
for (const { f, dir } of htmlFiles) {
    const ns = dir === 'posts' ? 'blog' : NS_FOR[f];
    if (!ns) continue;
    const html = readFileSync(join(root, f), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
    const used = new Set();
    for (const m of html.matchAll(/data-i18n(?:-html|-ph|-aria|-title)?="([^"]+)"/g)) used.add(m[1]);
    for (const k of used) {
        if (DICT[ns].en[k] == null) { i18nFails++; fail(`${f}: data-i18n key "${k}" missing in DICT.${ns}`); }
    }
}
if (!i18nFails) ok('all data-i18n keys resolve');

// ── 4. config version ──────────────────────────────────────────────────
console.log('Config');
const cfgVersion = CONFIG.VERSION;
const pkgVersion = pkg.version.split('+')[0];
if (cfgVersion !== pkgVersion) fail(`config VERSION ${cfgVersion} != package.json ${pkgVersion}`);
else ok(`version ${cfgVersion} consistent`);

// ── 5. service worker ──────────────────────────────────────────────────
console.log('Service worker');
const sw = readFileSync(join(root, 'sw.js'), 'utf8');
const swCache = (sw.match(/var CACHE = '([^']+)'/) || [])[1];
if (swCache !== 'ymt-v' + pkgVersion) fail(`sw.js CACHE "${swCache}" != ymt-v${pkgVersion} — run npm run build`);
else ok(`CACHE ${swCache}`);
const precache = [...sw.matchAll(/^ {4}'(\/[^']*)',$/gm)].map(m => m[1]);
let swMiss = 0;
for (const u of precache) {
    const p = u === '/' ? 'index.html' : u.slice(1);
    if (!existsSync(join(root, p))) { swMiss++; fail(`sw.js precache missing on disk: ${u}`); }
}
if (!swMiss) ok(`${precache.length} precache entries exist`);

console.log(failures ? `\n${failures} check(s) FAILED` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
