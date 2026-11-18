#!/usr/bin/env bash
# Regenerate the purged vendor stylesheets after upgrading Bootstrap/Font Awesome
# or when new markup/JS introduces classes the current purge dropped.
# Requires: npx purgecss (fetched on demand).
#
# Safelist covers classes injected by Bootstrap JS at runtime
# (collapse animation, modal backdrop, alert variants, label helpers)
# that never appear literally in content files.
set -euo pipefail
cd "$(dirname "$0")/.."

CONTENT=(index.html privacy.html 404.html offline.html "posts/*.html" "js/*.js")

purge() {
  local css="$1" outdir="$2"
  shift 2
  local args=(--css "$css")
  local f
  for f in "${CONTENT[@]}"; do args+=(--content "$f"); done
  npx -y purgecss "${args[@]}" "$@" --output "$outdir"
}

purge vendor/bootstrap.min.css /tmp/purge-out-bootstrap \
  --safelist collapsing collapsed modal-backdrop modal-open show fade \
    alert-success alert-danger alert-warning alert-info \
    label-primary label-default label-success label-danger label-warning label-info \
    btn-close
mv /tmp/purge-out-bootstrap/bootstrap.min.css vendor/bootstrap.min.css

purge vendor/font-awesome.min.css /tmp/purge-out-fa
mv /tmp/purge-out-fa/font-awesome.min.css vendor/font-awesome.min.css

purge vendor/v4-shims.min.css /tmp/purge-out-shims
mv /tmp/purge-out-shims/v4-shims.min.css vendor/v4-shims.min.css

echo "Purged CSS regenerated. Diff vendor/*.min.css, then bump CACHE in sw.js."
