# MSM Coaches — Past-Tournament Atmosphere Photos

Drop coach photos in this folder to populate the **MSM in action** visual strip
on `https://msm.burnsbuilt.co/coaches/`.

These aren't portraits-with-names — they're atmosphere shots that show what
MSM looks like (coaches at the bench, in the dugout, talking with kids, etc).
The page renders whatever's there as a clean image grid.

## How to drop

Name the files in slot order: `coach-1.jpg`, `coach-2.jpg`, `coach-3.jpg`,
up through `coach-8.jpg`. The page checks those 8 slots; whichever ones exist
get rendered, and missing ones quietly hide.

```
coach-1.jpg
coach-2.jpg
coach-3.jpg
...
coach-8.jpg
```

## File specs

- **Format:** JPG or WEBP preferred (smaller). PNG fine but bigger.
- **Aspect ratio:** Landscape (4:3 or 16:9) or square (1:1) both work.
  Vertical portraits also OK — the grid handles mixed ratios with object-fit cover.
- **Size:** 1200px on the long edge minimum. 2400px max so we don't ship oversize files.
- **Compression:** Run through TinyPNG or similar before dropping if files are >500 KB each.

## Want more than 8?

Just say the word — I'll add more slots.
