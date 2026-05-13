# Tournament Teams — by Division

The `/msm-summer-2026-dfw/#teams` section reads from `teams.json` and renders one block per division with a link out to each team's GameChanger page.

## Structure

```json
{
  "divisions": [
    {
      "name": "12U",
      "label": "12U Division",
      "teams": [
        {
          "name": "Aledo Bearcats 12U",
          "club": "Aledo Bearcats Baseball",
          "hometown": "Aledo, TX",
          "gameChanger": "https://web.gc.com/teams/abc123"
        }
      ]
    }
  ]
}
```

## Field reference

| Field | Required | Notes |
|---|---|---|
| `name` | yes | Team display name. |
| `club` | no | Parent club / org. |
| `hometown` | no | "City, TX". |
| `gameChanger` | no | Full URL to the team's GameChanger page. If blank, the card shows but isn't clickable. |

## Where to find the GameChanger URL

1. Open the team in the GameChanger app or web.gc.com
2. Tap the team name → "Share team page"
3. Paste that URL into the `gameChanger` field

URLs typically look like `https://web.gc.com/teams/<long-id>`.
