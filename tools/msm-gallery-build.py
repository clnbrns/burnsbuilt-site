#!/usr/bin/env python3
"""
MSM Gallery Build
==================================================================
Generates thumbnails for any photo in the gallery folder and updates
manifest.json so the page picks them up.

Idempotent — re-running is safe:
- Skips thumbnails that already exist
- Preserves existing manifest entries (alt text, day, team, tags)
- Adds any new photos found in the folder

Uses macOS `sips` for image processing (no installs needed).

Usage:
    cd ~/Documents/Projects/burnsbuilt-site
    python3 tools/msm-gallery-build.py

Optional flags:
    --force-thumbs    regenerate thumbnails even if they exist
    --max-long-edge N max long edge of full image (default 2400px)
    --thumb-width N   thumbnail width in pixels (default 800)
==================================================================
"""
from __future__ import annotations
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
GALLERY = REPO / "msm-summer-2026-dfw" / "gallery"
THUMBS = GALLERY / "thumbs"
MANIFEST = GALLERY / "manifest.json"

# Image extensions we'll process (lowercase). HEIC excluded — needs conversion first.
EXTS = {".jpg", ".jpeg", ".webp", ".png"}


def sips(args: list[str]) -> None:
    """Run sips quietly; raise if it fails."""
    subprocess.run(["sips", *args], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def normalize_full(src: Path, max_long_edge: int) -> None:
    """Resize the original in place to max-long-edge px on its long side."""
    sips(["--resampleHeightWidthMax", str(max_long_edge),
          "--setProperty", "formatOptions", "82",
          str(src), "--out", str(src)])


def make_thumb(src: Path, dst: Path, width: int) -> None:
    """Generate a thumbnail at the given width into dst."""
    dst.parent.mkdir(parents=True, exist_ok=True)
    sips(["--resampleWidth", str(width),
          "--setProperty", "format", "jpeg",
          "--setProperty", "formatOptions", "78",
          str(src), "--out", str(dst)])


def looks_lowercase_hyphenated(name: str) -> bool:
    return name == name.lower() and " " not in name


def slugify(name: str) -> str:
    """Coerce a filename to lowercase-hyphenated form, keeping the extension."""
    stem, _, ext = name.rpartition(".")
    if not ext:
        stem, ext = name, ""
    stem = re.sub(r"\s+", "-", stem.strip()).lower()
    stem = re.sub(r"[^a-z0-9_-]+", "-", stem)
    stem = re.sub(r"-+", "-", stem).strip("-")
    return f"{stem}.{ext.lower()}" if ext else stem


def load_manifest() -> dict:
    if not MANIFEST.exists():
        return {"version": 1, "tournament": "MSM Summer 2026 — DFW West", "downloadAllZip": None, "photos": []}
    return json.loads(MANIFEST.read_text())


def save_manifest(data: dict) -> None:
    MANIFEST.write_text(json.dumps(data, indent=2) + "\n")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force-thumbs", action="store_true")
    parser.add_argument("--max-long-edge", type=int, default=2400)
    parser.add_argument("--thumb-width", type=int, default=800)
    args = parser.parse_args()

    if not GALLERY.exists():
        print(f"Gallery folder not found: {GALLERY}", file=sys.stderr)
        return 1

    manifest = load_manifest()
    existing = {p["src"] for p in manifest.get("photos", [])}

    # 1) Find all candidate images at the top level of /gallery (not in thumbs/)
    candidates = sorted(
        p for p in GALLERY.iterdir()
        if p.is_file() and p.suffix.lower() in EXTS
    )

    if not candidates:
        print("No images found in gallery/. Drop some JPG/WebP files in there first.")
        return 0

    added: list[dict] = []
    skipped: list[str] = []
    renamed_pairs: list[tuple[str, str]] = []

    for src in candidates:
        # Force lowercase-hyphenated filenames
        if not looks_lowercase_hyphenated(src.name):
            new_name = slugify(src.name)
            new_path = src.with_name(new_name)
            if new_path.exists() and new_path != src:
                print(f"  ! Skipping {src.name} — slug target {new_name} already exists")
                continue
            src.rename(new_path)
            renamed_pairs.append((src.name, new_name))
            src = new_path

        # Normalize the full image (cap long edge)
        normalize_full(src, args.max_long_edge)

        # Generate thumbnail
        thumb = THUMBS / src.name
        if not thumb.exists() or args.force_thumbs:
            make_thumb(src, thumb, args.thumb_width)

        # Add to manifest if new
        if src.name not in existing:
            added.append({
                "src": src.name,
                "thumb": f"thumbs/{src.name}",
                "alt": "Tournament action photo",
                "day": "",
                "team": ""
            })
        else:
            skipped.append(src.name)

    if added:
        manifest.setdefault("photos", []).extend(added)
        save_manifest(manifest)

    # Report
    print(f"\n📸 Gallery build complete")
    print(f"   New photos added:      {len(added)}")
    print(f"   Already in manifest:   {len(skipped)}")
    if renamed_pairs:
        print(f"   Renamed (to slug):     {len(renamed_pairs)}")
        for old, new in renamed_pairs:
            print(f"     {old}  →  {new}")
    if added:
        print(f"\n   New entries (edit alt/day/team in manifest.json if desired):")
        for p in added[:5]:
            print(f"     • {p['src']}")
        if len(added) > 5:
            print(f"     … and {len(added) - 5} more")
    print(f"\n   Total in manifest now: {len(manifest['photos'])}")
    print(f"\n📁 Manifest: {MANIFEST.relative_to(REPO)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
