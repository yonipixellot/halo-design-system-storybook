import { useEffect, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { Game } from './_data';

/* GameCardLive — in-game card with the highest energy of any GameCard
   variant. Composition:
     • Top strip: LIVE pill (red), viewer count, period chip
     • Body: matchup + tabular score
     • NEW: status line + "Watch live" CTA (red-filled, prominent)

   Outer container is a div with role="button" + keyboard handlers (not
   a real <button>) so we can nest the Watch-live primary button inside
   for an explicit affordance while keeping the whole card tappable.
   The lg-live-ember class adds a breathing red glow; lg-live-amp adds
   the inner tally rail + broadcast sweep. */

export interface GameCardLiveProps {
  game: Game;
  /** Tap target — wire to your live-game viewer. Fired by the whole
      card AND by the explicit Watch-live CTA. */
  onWatch?: (gameId: string) => void;
}

const PlayIcon = () => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="currentColor"
    stroke="none"
    style={{ width: 14, height: 14, display: 'block' }}
    aria-hidden="true"
  >
    <path d="M3 2 L12 7 L3 12 Z" />
  </svg>
);

export const GameCardLive = ({ game, onWatch }: GameCardLiveProps) => {
  const { t } = useTranslation();
  /* Score "ticks" — every 6s there's a 50% chance momentsCount climbs by 1.
     Sympathetic to the broadcast feel; not a real score model. */
  const [moments, setMoments] = useState(game.momentsCount || 5);
  useEffect(() => {
    const tick = setInterval(
      () => setMoments((m) => m + (Math.random() > 0.5 ? 1 : 0)),
      6000,
    );
    return () => clearInterval(tick);
  }, []);

  const fire = () => onWatch?.(game.id);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fire();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={fire}
      onKeyDown={onKeyDown}
      aria-label={`${t('home.watchLive')} — ${game.home} vs ${game.away}`}
      className="relative w-full text-start squircle-md overflow-hidden lg-aura lg-shine lg-live-ember cursor-pointer"
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
              style={{
                boxShadow: '0 0 6px rgba(255,255,255,0.95)',
                flexShrink: 0,
              }}
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
        className="relative p-4 lg:p-5 flex items-end justify-between"
        style={{ zIndex: 2 }}
      >
        <div>
          <div className="sf-display text-[15px] lg:text-[18px] font-bold text-white tracking-[-0.01em] leading-tight">
            {game.home}
          </div>
          <div className="sf text-[11.5px] lg:text-[12.5px] text-white/60 mt-0.5">
            vs {game.away}
          </div>
        </div>
        <div className="sf-display text-[28px] lg:text-[32px] font-bold tabular-nums leading-none text-white">
          {game.scoreHome}
          <span className="text-white/35 mx-2">·</span>
          {game.scoreAway}
        </div>
      </div>

      {/* Status line + Watch-live CTA — gives the card more presence and
          an explicit primary action. Status line shows live moment
          tally; CTA fires the same onWatch handler as the outer card.
          stopPropagation prevents double-fire. CTA capped at 360 on
          desktop and centered inside the card. */}
      <div
        className="relative px-4 pb-4 lg:px-5 lg:pb-5"
        style={{ zIndex: 2 }}
      >
        <div
          className="sf text-[10.5px] tracking-[0.14em] uppercase font-bold text-white/55 mb-2.5 text-center lg:text-start"
          aria-live="polite"
        >
          {moments} {t('home.momentsCaptured')}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fire();
          }}
          className="live-red w-full lg:max-w-[360px] lg:mx-auto squircle-md py-3 flex items-center justify-center gap-2 sf text-[14px] font-semibold"
        >
          <PlayIcon />
          {t('home.watchLive')}
        </button>
      </div>
    </div>
  );
};
