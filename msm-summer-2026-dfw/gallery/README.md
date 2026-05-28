# MSM Tournament Gallery

This is where parents download free tournament photos. Photos here render automatically in the gallery section of `/msm-summer-2026-dfw/`.

## How to add photos

### Option A — drop files + edit manifest (manual, simplest)

1. Drop JPG/WebP files into this folder. **Use lowercase, hyphenated filenames** like `saturday-court-3-action-01.jpg`.
2. For each photo also create a thumbnail at `thumbs/<same-filename>` (max 800px wide, ~80KB). The page lazy-loads thumbs and only fetches the full image on click.
3. Add an entry to `manifest.json`:

```json
{
  "src": "saturday-court-3-action-01.jpg",
  "thumb": "thumbs/saturday-court-3-action-01.jpg",
  "alt": "12U player rounds third base",
  "day": "Saturday",
  "team": "Bearcats 12U"
}
```

### Option B — auto-generate manifest (recommended)

Drop the files in this folder, then run the helper from the repo root:

```bash
cd ~/Documents/Projects/burnsbuilt-site
python3 tools/msm-gallery-build.py
```

This:
- Resizes each full image to a max long-edge of 2400px (in place)
- Generates an 800px-wide thumbnail at `thumbs/<filename>`
- Renames files to lowercase-hyphenated form if they aren't already
  (e.g. `IMG_4582.JPG` → `img-4582.jpg`)
- Updates `manifest.json` with all photos in this folder
- Skips files already in the manifest (preserves your alt text and tags)

Uses macOS built-in `sips` for image processing — no installs needed.

After running, you can edit `manifest.json` to add `alt`, `day`, and
`team` for each photo. They render in the gallery either way.

### Tagging for "Find My Kid" AI search

Once photos are uploaded and live, run `tools/msm-tag-photos.sh` to
have Gemini auto-tag each photo with jersey numbers, team names, and
jersey colors. Required for the search bar above the gallery to work
on those photos.

## Image guidelines

- **Format:** JPG (best compatibility) or WebP (smaller). HEIC won't work — convert first.
- **Long edge:** 2400px max. Anything bigger is wasted bandwidth on phones.
- **File size:** under 600KB per full image. Thumbs under 80KB.
- **Filenames:** lowercase, hyphens, no spaces. e.g. `saturday-12u-vs-bearcats-01.jpg`.
- **Faces of minors:** Standard tournament practice — only post photos approved by the player's family. When in doubt, leave it out.

## Free downloads

The page includes a "Download" button on each photo that links directly to the full-resolution file. No login, no payment, no email gate. Parents tap and save.

For a "download all" zip, run:

```bash
cd msm-summer-2026-dfw/gallery
zip -r msm-2026-dfw-photos.zip *.jpg *.webp -x "thumbs/*"
```

Then upload `msm-2026-dfw-photos.zip` to this folder and the page will show a "Download All" link.
