import { SEED_WATCH_GAMES, useT } from './_data';

/* WatchHeroDesktop — cinematic Netflix-style hero for the Watch tab.

   Differs from FeaturedHero (the phone hero) in three ways:
     1. Full-bleed, viewport-tall (75vh max). The radial-gradient
        background extends edge-to-edge instead of sitting in a
        padded container.
     2. Two CTAs side-by-side (Watch Live + More info) instead of one.
        Mirrors Netflix's primary/secondary CTA pattern.
     3. Left-anchored content with a strong horizontal gradient scrim
        from the start edge — text reads cleanly against any background
        because the scrim is opaque-black on the start, transparent on
        the far end. This is the Netflix hero treatment exactly.

   Background video:
     When `videoSrc` is provided (defaults to `/videos/live-hero.mp4`
     served from `public/`), a muted, looping, autoplaying video fills
     the hero box. Plays for both live + featured states (per the
     "Always" trigger choice). The radial-gradient base remains as a
     fallback layer — it shows through if the video fails to load and
     also acts as a tinted underlay so the early loading frames have
     ambient color. */

export interface WatchHeroDesktopProps {
  onWatch?: (gameId: string, isLive: boolean) => void;
  /** Background video URL. Default `/videos/live-hero.mp4` (Vite serves
      anything in `public/` at site root). Set to `null` to disable the
      video and fall back to the radial-gradient base only. */
  videoSrc?: string | null;
}

export const WatchHeroDesktop = ({
  onWatch,
  videoSrc = '/videos/live-hero.mp4',
}: WatchHeroDesktopProps) => {
  const t = useT();
  const liveGame = SEED_WATCH_GAMES.find((g) => g.status === 'live');
  /* Last-played fallback — when nothing is live, the hero shows the
     most recent finished game with a neutral LAST MATCH badge (replaces
     the old curated featured event). Same logic as FeaturedHero. */
  const lastGame = SEED_WATCH_GAMES.find(
    (g) => g.status === 'just-ended' || g.status === 'ended',
  );
  const isLive = !!liveGame;
  const game = liveGame ?? lastGame;
  if (!game) return null;

  const data = {
    period: isLive ? (game.period ?? '') : 'FINAL',
    title: `${game.home} vs ${game.away}`,
    score: `${game.scoreHome} — ${game.scoreAway}`,
    gameId: game.id,
    sub: 'BASKETBALL · U18 · EASTSIDE GYM',
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '70vh',
        /* Radial-gradient base — kept as the underlying tint so the video
           never feels orphaned on raw black, AND as a fallback when the
           video file is missing or fails to load. */
        background:
          'radial-gradient(ellipse 60% 70% at 75% 30%, rgba(220,38,38,0.32) 0%, transparent 55%),' +
          'radial-gradient(ellipse 55% 60% at 85% 80%, rgba(132,88,255,0.30) 0%, transparent 60%),' +
          'radial-gradient(ellipse 50% 60% at 25% 65%, rgba(0,180,255,0.22) 0%, transparent 55%),' +
          'linear-gradient(135deg, #0a0e1a 0%, #050810 60%, #0d1228 100%)',
      }}
    >
      {/* Background video — Netflix-ambient treatment.
          - Heavily darkened (brightness 0.45) + desaturated (saturate 0.7)
            so it reads as "hint of motion" rather than competing with text.
          - Opacity 0.7 lets the radial-gradient base tint through, so we
            keep the cyan/red/purple atmosphere even with the video on top.
          - mix-blend-mode: luminosity blends the video's luminance with
            the radial color underneath — Netflix-style ambient.
          - Errors silently: if the file's missing, the video element fails
            to render frames and the radial gradient base shows through. */}
      {videoSrc && (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            /* Lighter Netflix treatment — the previous stack
               (brightness 0.45 + luminosity blend + opacity 0.7 + 6
               scrims) made the hero read as "almost black." Now: just
               a touch of brightness reduction so the video doesn't
               punch through the text, and full opacity so the radial
               base shows through naturally via the scrim alpha. */
            filter: 'brightness(0.78) saturate(0.85)',
          }}
        />
      )}

      {/* Horizontal scrim — opaque-ish on start, transparent on end.
          This is the ONLY major darkening layer; the text legibility
          all comes from this gradient alone (Netflix-style). */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(5,8,16,0.78) 0%, rgba(5,8,16,0.55) 30%, rgba(5,8,16,0.20) 65%, transparent 90%)',
        }}
      />

      {/* Bottom scrim — softer fade into the rails section. Deliberately
          shorter (h-32) so the video stays visible most of the way down. */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(5,8,16,0.40) 55%, rgba(5,8,16,0.85) 100%)',
        }}
      />

      {/* Content overlay — left-anchored, anchored to the same 1200 cap +
          gutter as the rails column so the hero title left-aligns with
          each rail's section header. */}
      <div className="relative z-10 mx-auto max-w-[1200px] px-8 xl:px-12 py-20 flex flex-col justify-end min-h-[70vh]">
        <div className="max-w-[560px]">
          {/* Status row — LIVE pill (red, pulse) when game is live,
              neutral LAST MATCH pill (translucent glass) when showing
              the most-recent finished game as fallback. */}
          <div className="flex items-center gap-3 mb-5">
            {isLive ? (
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(220,38,38,0.95)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.25), 0 0 20px rgba(220,38,38,0.55)',
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white anim-pulse" />
                <span className="sf text-[10.5px] tracking-[0.16em] font-bold uppercase text-white">
                  {t('watch.liveLabel')}
                </span>
              </div>
            ) : (
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.16)',
                  backdropFilter: 'blur(20px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                  border: '1px solid rgba(255,255,255,0.20)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
                }}
              >
                <span className="sf text-[10.5px] tracking-[0.16em] font-bold uppercase text-white/95">
                  {t('watch.lastMatchLabel')}
                </span>
              </div>
            )}
            <span className="sf text-[11.5px] tracking-[0.16em] uppercase font-semibold text-white/75">
              {data.period}
            </span>
          </div>

          {/* Massive title with text-shadow for legibility */}
          <h1
            className="sf-display text-[44px] xl:text-[52px] font-extrabold leading-[1.05] tracking-[-0.025em] text-white mb-5"
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.55)' }}
          >
            {data.title}
          </h1>

          {/* Sub-info row — score chip with proper sf-display typography
              (no more font-mono wireframe vibe), eyebrow as polished sf
              with intentional tracking for hierarchy. */}
          <div className="flex items-center gap-3 mb-7">
            <div
              className="inline-flex items-center px-3 py-1.5 squircle-sm"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(20px) saturate(160%)',
                WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.20)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
            >
              <span className="sf-display text-[15px] font-extrabold tabular-nums text-white tracking-tight">
                {data.score}
              </span>
            </div>
            <span className="sf text-[11px] tracking-[0.14em] uppercase font-semibold text-white/65">
              {data.sub}
            </span>
          </div>

          {/* Primary CTA — secondary "View Details" button removed per
              user request (May 2026); the hero now has a single decisive
              action instead of competing primary/secondary CTAs. */}
          <div className="flex items-center">
            <button
              onClick={() => onWatch?.(data.gameId, isLive)}
              className="lg-btn-primary lg-shine lg-aura squircle-md py-3 px-6 sf text-[14px] font-semibold inline-flex items-center gap-2"
            >
              <span className="text-[14px]">▶</span>
              {isLive ? t('watch.watchLive') : t('watch.watchLive')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
