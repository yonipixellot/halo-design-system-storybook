import { cls } from '@/lib/cls';
import type { ReactNode } from 'react';
import { SEED_WATCH_GAMES, type WatchGame } from './_data';
import type { Moment } from '@/screens/home/_data';

/* Watch-tab shared primitives + cards.

   Verbatim port of:
     - Mono / Label / Caption (halo-v3.2-glass.html line 2984) — wireframe
       primitives the Watch chrome leans on for tracking-widest uppercase
       eyebrows.
     - VThumb (line 3002) — the cyan-glow vertical clip thumbnail. Already
       glassy in v3.2, no glassification delta needed.
     - LiveCard (line 10892) — red-radial gradient live game card with
       glass play button. Glassy.
     - PosterCard (line 10930) — blue/purple radial gradient poster card.
       Glassy. */

/* ── Wireframe primitives ─────────────────────────────────────────── */

export const Mono = ({
  className = '',
  children,
}: { className?: string; children: ReactNode }) => (
  <span className={cls('font-mono', className)}>{children}</span>
);

export const Label = ({
  className = '',
  children,
}: { className?: string; children: ReactNode }) => (
  <span className={cls('font-mono text-[10px] tracking-[0.12em] uppercase font-bold', className)}>
    {children}
  </span>
);

export const Caption = ({
  className = '',
  children,
}: { className?: string; children: ReactNode }) => (
  <span className={cls('font-mono text-[10px] tracking-[0.06em] uppercase text-zinc-500', className)}>
    {children}
  </span>
);

/* ── PlayButton — universal play affordance for every thumbnail ────

   One size (48×48) across LiveCard, PosterCard (both sizes), and VThumb
   so the play affordance reads as a Halo signature regardless of card
   shape or rail context. Replaces the prior 4-different-sizes approach
   and the unicode "▶" character with a properly-pathed SVG triangle
   (which centers reliably across browsers/fonts; the unicode glyph has
   inconsistent baseline + horizontal centering).

   Aesthetic:
     - Glass disc base (translucent dark glass + backdrop blur)
     - Cyan ring border (1.5px, 55% alpha) — Halo brand accent
     - Soft cyan outer glow (24px blur, 35% alpha) — feels "active"
     - Top-inset white highlight — gives the disc dimensional depth
     - White SVG triangle, 14×16, geometrically optical-centered (the
       triangle's visual centroid sits left of its bounding-box center;
       a tiny `marginInlineStart: 2` correction makes it look centered) */
export interface PlayButtonProps {
  className?: string;
  /** Pass-through onClick; usually the card itself handles the click and
      the button is decorative-only (pointer-events-none on the parent
      flex container — see card composition for the pattern). */
  onClick?: () => void;
  ariaLabel?: string;
}

export const PlayButton = ({ className = '', onClick, ariaLabel }: PlayButtonProps) => (
  <div
    role={onClick ? 'button' : undefined}
    aria-label={ariaLabel}
    onClick={onClick}
    className={cls(
      /* 32×32 (w-8 h-8) — smaller still than the previous 40 so the
         centered affordance reads as a hint rather than dominating
         the card. Triangle scales down with it. */
      'relative w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200',
      onClick && 'cursor-pointer hover:scale-[1.06] active:scale-[0.98]',
      className,
    )}
    style={{
      /* Borderless glass disc — no cyan stroke. Cyan accent lives
         entirely in the ambient outer glow. */
      background:
        'radial-gradient(ellipse 80% 80% at 30% 20%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 60%),' +
        'rgba(8,12,20,0.60)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      boxShadow:
        '0 0 20px rgba(0,214,254,0.26),' +
        '0 5px 14px -5px rgba(0,0,0,0.55),' +
        'inset 0 1px 0 rgba(255,255,255,0.30)',
    }}
  >
    <svg
      width={9}
      height={11}
      viewBox="0 0 14 16"
      fill="white"
      style={{ width: 9, height: 11, display: 'block', marginInlineStart: 1.5 }}
      aria-hidden="true"
    >
      <path d="M0 1.5v13c0 1 1.1 1.55 1.9 1.05l11-6.5c.8-.5.8-1.7 0-2.2l-11-6.5C1.1 -.05 0 .5 0 1.5z" />
    </svg>
  </div>
);

/* ── VThumb — vertical 9:16 highlight thumbnail ───────────────────── */

export interface VThumbProps {
  moment: Moment;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/* Phone widths kept identical to v3.2; desktop bumps each tier up by
   roughly one step so the vertical clips have presence in the wider
   rails (md 120→160, lg 156→200, etc). Static class strings (not
   dynamically-built) so Tailwind's JIT picks them up at build time.
   Heights = width × (16/9) for 9:16 portrait. */
const VTHUMB_CLASSES: Record<NonNullable<VThumbProps['size']>, string> = {
  sm: 'w-[92px]  h-[164px] lg:w-[120px] lg:h-[213px]',
  md: 'w-[120px] h-[213px] lg:w-[160px] lg:h-[284px]',
  lg: 'w-[156px] h-[277px] lg:w-[200px] lg:h-[356px]',
  xl: 'w-[196px] h-[349px] lg:w-[240px] lg:h-[427px]',
};

/* Verbatim port — halo-v3.2-glass.html line 3002 (with May 2026 fixes
   per user critique):
     - Removed top-left duration glass pill (duplicated time info with
       the bottom row).
     - Removed Q2/Q3 in-game timestamp from bottom sub (highlights are
       per-game reels, not single-quarter clips, so the period marker
       was meaningless context).
     - Added game indication on bottom line 2 ("Team A vs Team B") so
       users can see WHICH game the highlight is from. Duration moves
       inline as the muted suffix (mirrors the PosterCard pattern of
       "primary · muted secondary"). */
export const VThumb = ({ moment, onClick, size = 'md', className = '' }: VThumbProps) => {
  const titleText = moment.title || 'Highlight';
  /* Resolve which game this moment came from. Fallback to the moment's
     original `sub` field if the game can't be found (defensive — for
     moments seeded with arbitrary gameIds in stories). */
  const game = SEED_WATCH_GAMES.find((g) => g.id === moment.gameId);
  const gameLabel = game ? `${game.home} vs ${game.away}` : moment.sub || '';
  const durationStr =
    moment.duration != null ? `0:${String(moment.duration).padStart(2, '0')}` : null;

  return (
    <button
      onClick={onClick}
      className={cls(
        'relative shrink-0 overflow-hidden squircle-md lg-aura lg-shine',
        VTHUMB_CLASSES[size],
        className,
      )}
      style={{
        background:
          'radial-gradient(ellipse 75% 65% at 25% 25%, rgba(0,214,254,0.20) 0%, transparent 60%),' +
          'radial-gradient(ellipse 75% 65% at 80% 80%, rgba(132,88,255,0.16) 0%, transparent 60%),' +
          'linear-gradient(180deg, var(--card-base-soft-top) 0%, var(--card-base-soft-bot) 100%)',
        border: '1px solid var(--glass-card-border)',
        backdropFilter: 'blur(36px) saturate(180%)',
        WebkitBackdropFilter: 'blur(36px) saturate(180%)',
        boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), var(--glass-card-shadow)',
      }}
    >
      <div className="absolute inset-0 hatch opacity-40" />

      {/* Halo-signature play button — centered. Compact 32px reads as
          a hint, not a dominant target. */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <PlayButton />
      </div>

      {/* Bottom info — title + game · duration (mirrors PosterCard
          pattern of "primary info · muted secondary"). Top corners are
          empty now; the only chrome is the centered play button. */}
      <div
        className="absolute inset-x-0 bottom-0 px-3 pt-9 pb-3 z-10"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.95) 100%)',
        }}
      >
        <div className="sf-display text-white text-[13px] font-bold leading-tight tracking-[-0.01em] text-start line-clamp-2">
          {titleText}
        </div>
        <div className="sf text-white/80 text-[11px] font-semibold leading-tight tracking-[0.01em] mt-0.5 text-start truncate">
          {gameLabel}
          {durationStr && (
            <span className="text-white/55 font-medium tabular-nums">
              {' '}
              · {durationStr}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

/* ── LiveCard — red live game card ────────────────────────────────── */

export interface LiveCardProps {
  game: WatchGame;
  onClick?: () => void;
}

/* Verbatim port — halo-v3.2-glass.html line 10892. Sized to match the
   big PosterCard (Full Games rail) so live + full-game rails share the
   same card footprint — adjacent rails read with consistent rhythm. */
export const LiveCard = ({ game, onClick }: LiveCardProps) => (
  <button
    onClick={onClick}
    className="shrink-0 squircle-md relative overflow-hidden lg-shine lg-aura lg-aura-warm sf transition-transform hover:scale-[1.02]"
    style={{
      width: 260,
      height: 156,
      background:
        'radial-gradient(ellipse at 70% 25%, rgba(220,38,38,0.45) 0%, transparent 55%), linear-gradient(135deg, #1a0c14 0%, #0a0e1a 100%)',
      boxShadow: '0 12px 32px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)',
    }}
  >
    <div className="absolute inset-0 hatch-dark opacity-50 pointer-events-none" />
    {/* LIVE pill — top-start, RTL-safe. Only top-corner element on
        LiveCard now (score moved to the bottom title block). */}
    <div
      className="absolute top-2.5 start-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{
        background: 'rgba(220,38,38,0.95)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.25), 0 0 12px rgba(220,38,38,0.45)',
      }}
    >
      <span className="w-1 h-1 rounded-full bg-white anim-pulse" />
      <span className="sf text-[9.5px] tracking-[0.16em] font-bold text-white uppercase">
        Live
      </span>
    </div>
    {/* Halo-signature play button — centered. Compact 32px. */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <PlayButton />
    </div>
    {/* Bottom info — tight two-line block:
        line 1: team names (primary, leading-tight)
        line 2: score · period (mt-0.5 — 2px gap; leading-tight) */}
    <div className="absolute inset-x-0 bottom-0 p-3">
      <div className="sf-display text-[13.5px] font-bold leading-tight text-white truncate tracking-[-0.01em] text-start">
        {game.home} vs {game.away}
      </div>
      <div className="sf text-[11px] font-semibold leading-tight text-white/80 mt-0.5 text-start tabular-nums tracking-[0.01em]">
        {game.scoreHome}–{game.scoreAway}
        <span className="text-white/55 font-medium"> · {game.period}</span>
      </div>
    </div>
  </button>
);

/* ── PosterCard — generic landscape game card ─────────────────────── */

export interface PosterCardProps {
  game: WatchGame;
  onClick?: () => void;
  big?: boolean;
}

/* Verbatim port — halo-v3.2-glass.html line 10930. */
export const PosterCard = ({ game, onClick, big = false }: PosterCardProps) => (
  <button
    onClick={onClick}
    className="shrink-0 squircle-md relative overflow-hidden lg-shine lg-aura sf transition-transform hover:scale-[1.02]"
    style={
      big
        ? {
            width: 260,
            height: 156,
            background:
              'radial-gradient(ellipse at 25% 20%, rgba(0,180,255,0.40) 0%, transparent 55%), radial-gradient(ellipse at 80% 75%, rgba(132,88,255,0.40) 0%, transparent 60%), linear-gradient(135deg, #0e1428 0%, #050a18 100%)',
            boxShadow:
              '0 12px 32px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)',
          }
        : {
            width: 220,
            height: 130,
            background:
              'radial-gradient(ellipse at 30% 30%, rgba(64,140,255,0.30) 0%, transparent 60%), linear-gradient(140deg, #131722 0%, #080b14 100%)',
            boxShadow:
              '0 8px 24px -8px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.08)',
          }
    }
  >
    <div className="absolute inset-0 hatch-dark opacity-30 pointer-events-none" />
    {/* Moments count — moved off the top-end and inlined into the
        bottom title block as tertiary text (per user: "less important,
        can be shown bottom left of the thumbnail"). The PosterCard
        top corners are now empty — cleanest possible card. */}
    {/* Halo-signature play button — centered, same as LiveCard. */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <PlayButton />
    </div>
    {/* Bottom info — tight two-line block matching LiveCard:
        line 1: team names (leading-tight)
        line 2: score · FINAL · moments (mt-0.5 — 2px gap; leading-tight) */}
    <div className="absolute inset-x-0 bottom-0 p-3">
      <div
        className={cls(
          'sf-display font-bold leading-tight text-white truncate tracking-[-0.01em] text-start',
          big ? 'text-[14.5px]' : 'text-[13px]',
        )}
      >
        {game.home} vs {game.away}
      </div>
      <div
        className={cls(
          'sf font-semibold leading-tight text-white/80 mt-0.5 text-start tabular-nums tracking-[0.01em]',
          big ? 'text-[11.5px]' : 'text-[11px]',
        )}
      >
        {game.scoreHome != null ? (
          <>
            {game.scoreHome}–{game.scoreAway}
            <span className="text-white/55 font-medium"> · Final</span>
            {/* Moments count — only on the small variant (Game
                Highlights / Suggestions rails). Big posters are Full
                Games (full MP4s, no moment compilation), so the count
                doesn't apply there. */}
            {!big && game.momentsCount != null && game.momentsCount > 0 && (
              <span className="text-white/45 font-medium">
                {' '}
                · {game.momentsCount} moments
              </span>
            )}
          </>
        ) : (
          <span className="text-white/55 font-medium uppercase tracking-[0.10em]">
            Upcoming
          </span>
        )}
      </div>
    </div>
  </button>
);
