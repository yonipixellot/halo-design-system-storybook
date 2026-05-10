# `public/videos/`

Drop video assets here. Anything in `public/` is served at the site root by Vite, so a file at `public/videos/live-hero.mp4` is reachable at `/videos/live-hero.mp4` from any component.

## Required files

- `live-hero.mp4` — Background loop for the Watch tab's live/featured hero.
  Used by `FeaturedHero` (phone) and `WatchHeroDesktop`. Default path is
  hard-coded as the `videoSrc` prop default; pass `videoSrc={null}` to
  disable in stories.

## Recommended encoding

For the ambient hero loop:
- 1280×720 (mobile-friendly bitrate, scales fine on desktop because the
  hero has heavy darkening + opacity overlay)
- H.264 baseline or main profile
- ~3–6 Mbps target bitrate
- 8–15 second loop (anything longer = bigger download for unclear gain
  since the video is low-attention by design)
- No audio track (the hero plays muted; stripping audio shaves a few
  hundred KB)
- ffmpeg one-liner:
  ```
  ffmpeg -i source.mov \
    -vf "scale=1280:720:flags=lanczos" \
    -c:v libx264 -profile:v main -preset slow -crf 23 \
    -an \
    -movflags +faststart \
    live-hero.mp4
  ```
