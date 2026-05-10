import { SEED_WATCH_GAMES, useT } from './_data';

/* FeaturedHero — phone hero for the Watch tab.

   May 2026 restructure (per user critique):
     - Full-bleed (no `px-4` padding) — extends edge-to-edge of the
       phone column the way desktop hero is full-bleed.
     - Single cohesive container — LIVE pill, title, score, CTA all
       overlay the video bg with a horizontal/bottom scrim. No more
       "video card detached from text below" treatment.
     - Tall enough (62vh, ~520px on a 850px column) to feel like a
       hero rather than a thumbnail.
     - All chip/label typography uses `sf` (the design system's actual
       font) instead of `font-mono` so labels read as polished UI
       rather than wireframe primitives.

   Behavior preserved:
     - Live game takes over the hero (red LIVE pill, score, "Watch Live").
     - Falls back to curated featured event when no live game.
     - Video bg with Netflix-ambient treatment (lighter than v1: just
       a touch of brightness reduction + horizontal scrim does all the
       legibility work). */

export interface FeaturedHeroProps {
  onWatch?: (gameId: string, isLive: boolean) => void;
  /** Background video URL. Default `/videos/live-hero.mp4` (Vite serves
      anything in `public/` at site root). Set to `null` to disable. */
  videoSrc?: string | null;
}

/* Default video URL is base-aware via Vite's import.meta.env.BASE_URL.
   In dev BASE_URL = '/'; in the GH Pages production build it's
   '/halo-design-system-storybook/'. So the same default works in both
   contexts without forking the path. */
const DEFAULT_VIDEO_SRC = `${import.meta.env.BASE_URL}videos/live-hero.mp4`;

export const FeaturedHero = ({
  onWatch,
  videoSrc = DEFAULT_VIDEO_SRC,
}: FeaturedHeroProps) => {
  const t = useT();
  const liveGame = SEED_WATCH_GAMES.find((g) => g.status === 'live');
  /* Last-played fallback — when nothing is live, the hero shows the most
     recent finished game (just-ended → ended) with a neutral LAST MATCH
     badge instead of the red LIVE NOW pill. Per-user decision May 2026
     replacing the old "curated featured event" fallback. */
  const lastGame = SEED_WATCH_GAMES.find(
    (g) => g.status === 'just-ended' || g.status === 'ended',
  );
  const isLive = !!liveGame;
  const game = liveGame ?? lastGame;
  /* If somehow no game data exists at all, render nothing rather than
     attempting to display undefined fields. */
  if (!game) return null;

  /* Title split — phone wraps "Team A vs / Team B" into two rows so the
     opponent name sits on its own line. */
  const data = {
    period: isLive ? (game.period ?? '') : 'FINAL',
    titleL1: `${game.home} vs`,
    titleL2: game.away,
    score: `${game.scoreHome} — ${game.scoreAway}`,
    gameId: game.id,
    sub: 'BASKETBALL · U18',
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '62vh',
        /* Radial-gradient base — tints the video AND falls back when the
           file is missing. */
        background:
          'radial-gradient(ellipse 70% 80% at 70% 30%, rgba(220,38,38,0.40) 0%, transparent 55%),' +
          'radial-gradient(ellipse 60% 70% at 25% 75%, rgba(0,180,255,0.28) 0%, transparent 60%),' +
          'linear-gradient(135deg, #0a0e1a 0%, #050810 60%, #0d1228 100%)',
      }}
    >
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
            /* Lighter Netflix treatment — same recipe as desktop.
               PLUS: mask-image fades the video to transparent at the
               bottom so there's no hard horizontal seam where the
               video frame ends. The video alpha-fades into the page
               canvas instead of cutting off mid-court. */
            filter: 'brightness(0.78) saturate(0.85)',
            maskImage:
              'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
          }}
        />
      )}

      {/* Bottom-anchored scrim — handles text legibility AND blends
          the hero into the page canvas. The scrim's bottom-most stop
          is the EXACT canvas color (#0C0E14 = var(--canvas-bg) in
          dark theme), fully opaque, so the hero's last pixel matches
          the section that follows — no horizontal seam at the
          transition. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(12,14,20,0.55) 65%, rgba(12,14,20,0.92) 90%, #0C0E14 100%)',
        }}
      />

      {/* Bottom-anchored cluster — tight, consistent rhythm.
          pb-3 (was pb-7) so the CTA sits closer to the division pills
          row that follows in DOM order — hero & state-picker now read
          as adjacent groups, not separated sections. */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-3">
        {/* Status row — LIVE pill (red, pulse) when game is live, neutral
            LAST MATCH pill (translucent glass) when showing the most-
            recent finished game as fallback. */}
        <div className="flex items-center gap-2.5 mb-2">
          {isLive ? (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(220,38,38,0.95)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.25), 0 0 16px rgba(220,38,38,0.50)',
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white anim-pulse" />
              <span className="sf text-[9.5px] tracking-[0.16em] font-bold uppercase text-white">
                {t('watch.liveLabel')}
              </span>
            </div>
          ) : (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.16)',
                backdropFilter: 'blur(20px) saturate(160%)',
                WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.20)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
            >
              <span className="sf text-[9.5px] tracking-[0.16em] font-bold uppercase text-white/95">
                {t('watch.lastMatchLabel')}
              </span>
            </div>
          )}
          <span className="sf text-[10.5px] tracking-[0.16em] uppercase font-semibold text-white/85">
            {data.period}
          </span>
        </div>

        {/* Title — split into two rows after "vs" so opponent gets its
            own line (movie-poster treatment). Tight leading so the two
            lines read as one block. */}
        <h1
          className="sf-display text-[30px] font-extrabold leading-[1.02] tracking-[-0.025em] text-white mb-3"
          style={{ textShadow: '0 2px 16px rgba(0,0,0,0.55)' }}
        >
          <div>{data.titleL1}</div>
          {data.titleL2 && <div>{data.titleL2}</div>}
        </h1>

        {/* Score chip + meta — solid glass pill (not wireframe), sf typography */}
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="inline-flex items-center px-2.5 py-1 squircle-sm"
            style={{
              background: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.22)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.20)',
            }}
          >
            <span className="sf-display text-[13px] font-extrabold tabular-nums text-white tracking-tight">
              {data.score}
            </span>
          </div>
          <span className="sf text-[10.5px] tracking-[0.14em] uppercase font-semibold text-white/70">
            {data.sub}
          </span>
        </div>

        {/* Primary CTA — normal-sized inline button, left-aligned, NOT
            full-width. Matches the desktop hero's CTA treatment. */}
        <button
          onClick={() => onWatch?.(data.gameId, isLive)}
          className="lg-btn-primary lg-shine lg-aura squircle-md py-2.5 px-5 sf text-[13.5px] font-semibold inline-flex items-center gap-2"
        >
          <span className="text-[13px]">▶</span>
          {isLive ? t('watch.watchLive') : t('watch.viewDetails')}
        </button>
      </div>
    </div>
  );
};
