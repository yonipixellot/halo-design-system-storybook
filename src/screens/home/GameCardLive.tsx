import { useEffect, useState } from 'react';
import type { Game } from './_data';

/* Verbatim port: halo-v3.2-glass.html lines 8759-8855.
   In-game card with score ticking. Composition:
     • Top strip: LIVE pill (red), viewer count, period chip
     • Body: matchup + tabular score
   Outer card carries `lg-live-ember` (breathing red glow) + `lg-live-amp`
   child overlay (tally rail + broadcast sweep, theme-conditional in CSS). */

export interface GameCardLiveProps {
  game: Game;
  /** Tap target — wire to your live-game viewer. */
  onWatch?: (gameId: string) => void;
}

export const GameCardLive = ({ game, onWatch }: GameCardLiveProps) => {
  /* Score "ticks" — every 6s there's a 50% chance momentsCount climbs by 1.
     Sympathetic to the broadcast feel; not a real score model. */
  const [moments, setMoments] = useState(game.momentsCount || 5);
  useEffect(() => {
    const t = setInterval(() => setMoments((m) => m + (Math.random() > 0.5 ? 1 : 0)), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <button
      onClick={() => onWatch?.(game.id)}
      className="relative w-full text-left squircle-md overflow-hidden lg-aura lg-shine lg-live-ember"
      style={{
        background:
          'linear-gradient(180deg, var(--card-base-soft-top) 0%, var(--card-base-soft-bot) 100%)',
        border: '1px solid var(--glass-card-border)',
        backdropFilter: 'blur(36px) saturate(180%)',
        WebkitBackdropFilter: 'blur(36px) saturate(180%)',
      }}
    >
      {/* Inner amp overlay — tally rail + broadcast sweep + ambient red mood. */}
      <div className="lg-live-amp" aria-hidden="true" />

      {/* Header strip — LIVE pill + period + viewer count */}
      <div
        className="relative px-4 pt-3 pb-2 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--hairline)', zIndex: 2 }}
      >
        <div className="flex items-center gap-2">
          <div className="live-red squircle-sm px-2 py-1 inline-flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full bg-white anim-pulse-dot"
              style={{ boxShadow: '0 0 6px rgba(255,255,255,0.95)', flexShrink: 0 }}
            />
            <span
              className="sf text-[10px] font-bold tracking-[0.18em] uppercase leading-none"
              style={{ color: '#FFF' }}
            >
              LIVE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="sf text-[10px] font-medium tracking-tight text-white/60">
            ○ {moments * 8 + 2}
          </span>
          <span className="lg-glass-strong squircle-sm px-2 py-0.5 sf text-[10px] font-bold tracking-[0.04em] text-white/90 leading-none">
            {game.period || 'Q2'}
          </span>
        </div>
      </div>

      {/* Body — matchup + score */}
      <div
        className="relative p-4 flex items-end justify-between"
        style={{ zIndex: 2 }}
      >
        <div>
          <div
            className="sf-display text-[15px] font-bold text-white tracking-[-0.01em] leading-tight"
          >
            {game.home}
          </div>
          <div className="sf text-[11.5px] text-white/60 mt-0.5">vs {game.away}</div>
        </div>
        <div className="sf-display text-[28px] font-bold tabular-nums leading-none text-white">
          {game.scoreHome}
          <span className="text-white/35 mx-2">·</span>
          {game.scoreAway}
        </div>
      </div>
    </button>
  );
};
