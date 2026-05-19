#!/usr/bin/env python3
"""
NCS Command — local bundler

Reads the source .jsx files from ncs/, gzip-encodes them, and patches the
in-place __bundler/manifest in ncs/index.html. Lets us iterate on the dashboard
without round-tripping through Claude Design.

Workflow:
  1. Edit ncs/*.jsx
  2. python3 tools/ncs-build.py
  3. git add -A && git commit && git push

Files that get re-bundled:
  ncs/widgets.jsx, charts.jsx, data.jsx, app.jsx, primitives.jsx, tweaks-panel.jsx

Vendor libs (React, ReactDOM, Lucide, Tailwind) and fonts are left untouched.

Layout (preserved during rebuild):
  - The noindex/viewport meta tags I inject manually in <head> stay put.
  - The bundler loader <script> at top of <body> stays put.
  - Only the JSON inside <script type="__bundler/manifest">...</script> changes.
"""

from __future__ import annotations
import base64
import gzip
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
NCS = REPO / "ncs"
INDEX = NCS / "index.html"
BUNDLE_MAP = NCS / ".bundle-map.json"

MANIFEST_RE = re.compile(
    r'(<script type="__bundler/manifest">\s*)([\s\S]*?)(\s*</script>)'
)


def encode_jsx(text: str) -> str:
    """gzip + base64-encode a source file the way the bundler expects."""
    return base64.b64encode(gzip.compress(text.encode("utf-8"))).decode("ascii")


def main() -> int:
    if not INDEX.exists():
        print(f"ERR: {INDEX} not found", file=sys.stderr)
        return 1
    if not BUNDLE_MAP.exists():
        print(
            f"ERR: {BUNDLE_MAP} missing. "
            "Run the extract one-liner first or restore from git history.",
            file=sys.stderr,
        )
        return 1

    bundle_map = json.loads(BUNDLE_MAP.read_text())
    jsx_map: dict[str, str] = bundle_map["jsx"]  # filename -> uuid

    html = INDEX.read_text()
    m = MANIFEST_RE.search(html)
    if not m:
        print("ERR: could not find <script type='__bundler/manifest'>", file=sys.stderr)
        return 1

    manifest = json.loads(m.group(2))

    changed = []
    skipped = []
    for fname, uuid in jsx_map.items():
        src_path = NCS / fname
        if not src_path.exists():
            print(f"  WARN: {fname} listed in bundle-map but not on disk — skipping")
            continue
        if uuid not in manifest:
            print(f"  WARN: uuid {uuid[:8]}... ({fname}) not in current manifest — skipping")
            continue

        src_text = src_path.read_text()
        # Decode current bundle entry to compare
        current_b64 = manifest[uuid]["data"]
        current_raw = gzip.decompress(base64.b64decode(current_b64)).decode("utf-8")

        if current_raw == src_text:
            skipped.append(fname)
            continue

        # Re-encode and substitute
        manifest[uuid]["data"] = encode_jsx(src_text)
        manifest[uuid]["compressed"] = True
        manifest[uuid].setdefault("mime", "application/javascript")
        changed.append((fname, len(src_text), len(current_raw)))

    if not changed:
        print(f"no changes — all {len(skipped)} jsx files already match bundle")
        return 0

    # Serialize back exactly the same way (compact, no spaces — original was minified)
    new_manifest_json = json.dumps(manifest, separators=(",", ":"))
    new_html = html[: m.start(2)] + new_manifest_json + html[m.end(2):]
    INDEX.write_text(new_html)

    print(f"rebuilt {INDEX} ({len(new_html):,} bytes)")
    for fname, new_size, old_size in changed:
        delta = new_size - old_size
        sign = "+" if delta >= 0 else ""
        print(f"  ✓ {fname:24s} {old_size:>6,}b → {new_size:>6,}b  ({sign}{delta})")
    if skipped:
        print(f"  unchanged: {', '.join(skipped)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
