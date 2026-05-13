# Recaps

AI-drafted game recaps. The page reads `manifest.json` and renders the cards in the **Latest Recaps** section.

## Add a recap (helper script)

From the repo root:

```bash
ADMIN_KEY=your-admin-key \
SITE_URL=https://burnsbuilt.co \
tools/msm-recap.sh \
  --team1 "Aledo Bearcats 12U" \
  --team2 "DFW Stallions 12U" \
  --score1 6 --score2 4 \
  --division 12U --round "pool play" \
  --notes "Bearcats #12 drove in two in the fifth. Stallions battled back but ran out of innings."
```

The script:
1. Calls `/.netlify/functions/msm-recap` with your inputs (Gemini drafts the title + 2-sentence recap)
2. Appends a new entry to `manifest.json`
3. The page picks it up on next load (newest first)

## Manual entry

If you'd rather skip the AI and write it yourself, just append to `manifest.json`:

```json
{
  "title": "Bearcats edge Stallions 6–4",
  "recap": "Aledo's 12U built a quick three-run lead in the second and held on as Stallions bats woke up late. #12 drove in the go-ahead run with a sharp single up the middle.",
  "score": "6–4",
  "division": "12U",
  "round": "pool play",
  "posted_at": "2026-06-09T14:30:00-05:00"
}
```

## Field reference

| Field | Notes |
|---|---|
| `title` | 5–8 word headline. Auto-drafted. |
| `recap` | 2 sentences. Auto-drafted in friendly local-paper voice. |
| `score` | Display string like `"6–4"`. |
| `division` | `"12U"`, `"13U"`, `"14U"`. |
| `round` | `"pool play"`, `"quarterfinal"`, `"semifinal"`, `"final"`. |
| `posted_at` | ISO timestamp. Used to sort newest-first. |
