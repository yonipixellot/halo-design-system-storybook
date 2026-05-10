import { useEffect, useState } from 'react';
import { SEED_WATCH_GAMES, type WatchGame } from './_data';

/* LivePlayerScreen — full-bleed live game viewer.

   Glassified port of halo-v3.2-glass.html LiveGameScreen (line 11367):
     - 16:9 video frame (uses the same `videoSrc` as the Watch hero by
       default, but accepts an override prop).
     - Glass overlay controls (was raw white-pill paper aesthetic in v3.2).
     - LIVE pill + score chip overlaid top-end so the live score is visible
       without leaving the player.
     - Bottom dock: play/pause + glass scrubber + LIVE · runtime + fullscreen.
     - Back × top-start.

   Layout:
     - Below lg: black canvas, video centered, controls dock at bottom.
     - lg+: video scales to a max-w container (centered), black canvas
       around it, controls dock below the video.

   Navigation:
     - Mounts as a full-screen overlay inside the Watch tree (not a route).
     - `onClose` returns to the Watch list with scroll position preserved. */

export interface LivePlayerScreenProps {
  /** Game to play. Falls back to the first live game in seed if not passed. */
  game?: WatchGame;
  /** Bg video URL — same as the Watch hero default by convention. */
  videoSrc?: string | null;
  /** Called when user dismisses the player (×, back swipe). */
  onClose?: () => void;
}

const DEFAULT_VIDEO_SRC = `${import.meta.env.BASE_URL}videos/live-hero.mp4`;

export const LivePlayerScreen = ({
  game,
  videoSrc = DEFAULT_VIDEO_SRC,
  onClose,
}: LivePlayerScreenProps) => {
  const resolvedGame =
    game ?? SEED_WATCH_GAMES.find((g) => g.status === 'live') ?? SEED_WATCH_GAMES[0];
  const [playing, setPlaying] = useState(true);
  /* Fake live clock — increment a runtime counter every second while
     playing. Mirrors the v3.2 behavior. */
  const [secs, setSecs] = useState(1240);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setSecs((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [playing]);
  const mm = Math.floor(secs / 60);
  const ss = secs % 60;
  const runtime = `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;

  if (!resolvedGame) return null;

  return (
    <div
      data-theme="dark"
      className="fixed inset-0 bg-black anim-fade flex flex-col text-white sf"
      /* z-[200] sits above Storybook's global ThemeToggle (z-100), so the
         player covers it cleanly — the toggle isn't relevant inside the
         always-dark live viewer. */
      style={{ zIndex: 200 }}
    >
      {/* Back × — top-end (RTL-safe; was start, moved to right per critique) */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 end-4 z-30 w-10 h-10 rounded-full flex items-center justify-center text-white/95 hover:text-white transition-colors"
        style={{
          background: 'rgba(8,12,20,0.55)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          boxShadow: '0 4px 12px -4px rgba(0,0,0,0.55)',
        }}
      >
        <span className="text-[16px] leading-none">✕</span>
      </button>

      {/* (LIVE + score chips moved into the title block below the video
          per user critique — they now sit ABOVE the "Team A vs Team B"
          line as a status row, instead of overlaying the top-start
          corner of the video frame.) */}

      {/* Video + title group — vertically centered. Video on top, title
          BELOW it as flow content (was overlaid inside the video frame
          previously per user critique). Both items align to the same
          left edge so the title block reads as a "caption" of the
          video. */}
      <div className="flex-1 flex flex-col items-center justify-center px-0 lg:px-8 xl:px-12">
        <div className="w-full lg:max-w-[1200px] mx-auto">
          {/* Video frame — 16:9, full-bleed on phone, capped on desktop. */}
          <div
            className="relative w-full bg-zinc-900 overflow-hidden"
            style={{ aspectRatio: '16 / 9' }}
          >
            {videoSrc ? (
              <video
                key={`${resolvedGame.id}-${playing}`}
                src={videoSrc}
                autoPlay={playing}
                muted
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            ) : (
              <div className="absolute inset-0 hatch-dark" />
            )}

            {/* Center play/pause — glass disc, only visible when paused */}
            {!playing && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <button
                  onClick={() => setPlaying(true)}
                  aria-label="Play"
                  className="w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-[1.06] active:scale-[0.98]"
                  style={{
                    background:
                      'radial-gradient(ellipse 80% 80% at 30% 20%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 60%),' +
                      'rgba(8,12,20,0.60)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    boxShadow:
                      '0 0 32px rgba(0,214,254,0.30),' +
                      '0 8px 24px -8px rgba(0,0,0,0.55),' +
                      'inset 0 1px 0 rgba(255,255,255,0.30)',
                  }}
                >
                  <svg
                    width={22}
                    height={26}
                    viewBox="0 0 14 16"
                    fill="white"
                    style={{ width: 22, height: 26, marginInlineStart: 3 }}
                    aria-hidden="true"
                  >
                    <path d="M0 1.5v13c0 1 1.1 1.55 1.9 1.05l11-6.5c.8-.5.8-1.7 0-2.2l-11-6.5C1.1 -.05 0 .5 0 1.5z" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Title block — flow content below the video. Status row
              (LIVE pill + score) sits at the TOP of this block, above
              the title, both on phone and desktop (per user critique). */}
          <div className="px-4 lg:px-0 pt-5">
            <div className="flex items-center gap-2 mb-2.5">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(220,38,38,0.95)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.25), 0 0 16px rgba(220,38,38,0.50)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white anim-pulse" />
                <span className="sf text-[9.5px] tracking-[0.16em] font-bold text-white uppercase">
                  Live
                </span>
              </div>
              {resolvedGame.scoreHome != null && (
                <div
                  className="inline-flex items-center px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.14)',
                    backdropFilter: 'blur(20px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                    border: '1px solid rgba(255,255,255,0.20)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
                  }}
                >
                  <span className="sf-display text-[11.5px] font-extrabold tabular-nums text-white tracking-tight leading-none">
                    {resolvedGame.scoreHome}–{resolvedGame.scoreAway}
                  </span>
                </div>
              )}
              {resolvedGame.period && (
                <span className="sf text-[10.5px] tracking-[0.16em] uppercase font-semibold text-white/75">
                  {resolvedGame.period}
                </span>
              )}
            </div>
            <div className="sf-display text-white text-[18px] lg:text-[24px] font-bold leading-tight tracking-[-0.01em]">
              {resolvedGame.home} vs {resolvedGame.away}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom dock — play/pause + scrubber + runtime + fullscreen.
          Glass surface that floats above the black canvas. */}
      <div className="relative z-30 px-4 lg:px-8 xl:px-12 py-4 lg:py-5">
        <div
          className="mx-auto lg:max-w-[1200px] flex items-center gap-3 lg:gap-4 px-4 py-3 rounded-full"
          style={{
            background: 'rgba(8,12,20,0.55)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 24px -8px rgba(0,0,0,0.45)',
          }}
        >
          {/* Play/pause */}
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause' : 'Play'}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 hover:bg-white/10 transition-colors"
          >
            {playing ? (
              <svg
                width={12}
                height={14}
                viewBox="0 0 12 14"
                fill="white"
                style={{ width: 12, height: 14 }}
                aria-hidden="true"
              >
                <rect x="0" y="0" width="4" height="14" rx="1" />
                <rect x="8" y="0" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg
                width={12}
                height={14}
                viewBox="0 0 14 16"
                fill="white"
                style={{ width: 12, height: 14, marginInlineStart: 1.5 }}
                aria-hidden="true"
              >
                <path d="M0 1.5v13c0 1 1.1 1.55 1.9 1.05l11-6.5c.8-.5.8-1.7 0-2.2l-11-6.5C1.1 -.05 0 .5 0 1.5z" />
              </svg>
            )}
          </button>

          {/* Scrubber — glass track with cyan-tinted fill (red-ish for live
              feel since we're at the live edge). For live the playhead
              sits at the far end. */}
          <div className="flex-1 h-1.5 rounded-full relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.16)' }}>
            <div
              className="absolute inset-y-0 start-0 rounded-full"
              style={{
                width: '94%',
                background:
                  'linear-gradient(90deg, rgba(220,38,38,0.85) 0%, rgba(220,38,38,1) 100%)',
                boxShadow: '0 0 8px rgba(220,38,38,0.6)',
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white"
              style={{ insetInlineStart: '94%', boxShadow: '0 0 8px rgba(255,255,255,0.5)' }}
            />
          </div>

          {/* LIVE · runtime */}
          <span className="sf text-[10.5px] tracking-[0.14em] uppercase font-bold text-white/85 tabular-nums shrink-0">
            Live · {runtime}
          </span>

          {/* Fullscreen */}
          <button
            aria-label="Fullscreen"
            className="w-8 h-8 flex items-center justify-center text-white/85 hover:text-white shrink-0"
            onClick={() => {
              /* Actual fullscreen API call goes here in production —
                 stubbed for now. */
            }}
          >
            <svg
              width={14}
              height={14}
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: 14, height: 14 }}
              aria-hidden="true"
            >
              <path d="M2 5V2h3M9 2h3v3M12 9v3H9M5 12H2V9" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
