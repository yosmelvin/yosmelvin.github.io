#!/usr/bin/env node
/* Regenerate sw.js CACHE + PRECACHE from the real asset graph.
   Sources: every HTML file's src/href/srcset, all of js/ + posts/posts.js
   (covers the ES-module graph without parsing imports), fonts.css url()s,
   vendor webfonts, manifest icons, and project images referenced in
   js/projects.js (plus their -sm.* variants when they exist on disk).
   CACHE derives from package.json version — releases no longer hand-bump. */
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, posix } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const cacheName = 'ymt-v' + pkg.version.split('+')[0];

const ASSET_EXT = /\.(css|js|mjs|json|webp|png|jpe?g|gif|svg|ico|woff2?|ttf|otf|txt|xml|html?)$/i;
const SKIP = /^(https?:|data:|mailto:|tel:|#|javascript:)/i;

const found = new Set();

function addUrl(raw, baseDir) {
    if (!raw || SKIP.test(raw)) return;
    // strip query/hash
    let p = raw.split(/[?#]/)[0];
    if (!p) return;
    // resolve relative to the referencing file's directory
    let abs;
    if (p.startsWith('/')) abs = p.slice(1);
    else abs = posix.normalize(posix.join(baseDir, p));
    if (!ASSET_EXT.test(abs)) return;
    if (!existsSync(join(root, abs))) return;
    found.add('/' + abs);
}

function scanAttrs(html, baseDir) {
    for (const m of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) addUrl(m[1], baseDir);
    for (const m of html.matchAll(/\bsrcset="([^"]+)"/g)) {
        m[1].split(',').forEach(function(candidate) {
            addUrl(candidate.trim().split(/\s+/)[0], baseDir);
        });
    }
}

// 1) HTML files (root + posts)
const htmlFiles = [
    ...readdirSync(root).filter(f => f.endsWith('.html')).map(f => ({ f, dir: '' })),
    ...readdirSync(join(root, 'posts')).filter(f => f.endsWith('.html')).map(f => ({ f: 'posts/' + f, dir: 'posts' }))
];
for (const { f, dir } of htmlFiles) {
    scanAttrs(readFileSync(join(root, f), 'utf8'), dir);
}

// 2) JS — every file under js/ and posts/posts.js (module graph covered wholesale;
//    these are small and it future-proofs new imports)
for (const f of readdirSync(join(root, 'js')).filter(f => f.endsWith('.js'))) {
    addUrl('js/' + f, '');
}
addUrl('posts/posts.js', 'posts');

// 3) fonts.css @font-face urls
const fontsCss = readFileSync(join(root, 'fonts/fonts.css'), 'utf8');
for (const m of fontsCss.matchAll(/url\(['"]?([^'")]+)['"]?\)/g)) addUrl(m[1], 'fonts');

// 4) vendor webfonts + vendor assets already referenced by HTML scan
for (const f of readdirSync(join(root, 'vendor/webfonts'))) {
    if (/\.(woff2?|ttf|eot)$/.test(f)) addUrl('vendor/webfonts/' + f, '');
}

// 5) manifest icons
try {
    const manifest = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'));
    (manifest.icons || []).forEach(ic => addUrl(ic.src || ic.url, ''));
} catch (e) {}

// 6) project images referenced in projects.js + derived -sm variants
const projectsSrc = readFileSync(join(root, 'js/projects.js'), 'utf8');
for (const m of projectsSrc.matchAll(/'(img\/[^']+)'/g)) {
    const img = m[1];
    addUrl(img, '');
    const base = img.replace(/\.(jpe?g|webp|png)$/i, '');
    ['-sm.webp', '-sm.jpg', '.webp', '.jpg'].forEach(function(suf) {
        const cand = base + suf;
        if (cand !== img && existsSync(join(root, cand))) addUrl(cand, '');
    });
}

// always-on essentials
['/', '/index.html', '/offline.html', '/manifest.json', '/sw.js'].forEach(u => {
    if (u === '/') { found.add('/'); return; }
    if (existsSync(join(root, u.slice(1)))) found.add(u);
});

const entries = [...found].sort();
const swPath = join(root, 'sw.js');
let sw = readFileSync(swPath, 'utf8');
sw = sw.replace(/var CACHE = '[^']*';/, "var CACHE = '" + cacheName + "';");
const list = entries.map(u => "    '" + u + "',").join('\n');
sw = sw.replace(/var PRECACHE = \[[\s\S]*?\];/, 'var PRECACHE = [\n' + list + '\n];');
writeFileSync(swPath, sw);

console.log(`sw.js regenerated: CACHE=${cacheName}, ${entries.length} precache entries`);
