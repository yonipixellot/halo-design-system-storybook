import { useEffect, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { Game } from './_data';

/* GameCardLive — in-game card with the highest energy of any GameCard
   variant. Composition (May 2026 redesign):
     • Top strip:   LIVE pill (start) · viewer count + period (end)
     • Body row:    team name + matchup (start) · score (end)
     • Footer row:  compact "Watch live" CTA pinned to the trailing
                    edge at ~33% width — visually completes the score
                    column and reads as the natural action target

   Outer container is a div with role="button" + keyboard handlers (not
   a real <button>) so we can nest the Watch-live primary button inside
   for an explicit affordance while keeping the whole card tappable. */

export interface GameCardLiveProps {
  game: Game;
  /** Tap target — wire to your live-game viewer. Fired by the whole
      card AND by the explicit Watch-live CTA. */
  onWatch?: (gameId: string) => void;
}

const PlayIcon = () => (
  <svg
    width={13}
    height={13}
    viewBox="0 0 14 14"
    fill="currentColor"
    stroke="none"
    style={{ width: 13, height: 13, display: 'block' }}
    aria-hidden="true"
  >
    <path d="M3 2 L12 7 L3 12 Z" />
  </svg>
);

export const GameCardLive = ({ game, onWatch }: GameCardLiveProps) => {
  const { t } = useTranslation();
  /* Score "ticks" — every 6s there's a 50% chance momentsCount climbs by 1.
     Sympathetic to the broadcast feel; not a real score model. The
     value still feeds the viewer-count proxy in the header. */
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

      {/* Header strip — LIVE pill + viewer count + period */}
      <div
        className="relative px-4 pt-3 pb-2 lg:px-5 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--hairline)', zIndex: 2 }}
      >
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
        <div className="flex items-center gap-2">
          <span className="sf text-[10px] font-medium tracking-tight text-white/60">
            ○ {moments * 8 + 2}
          </span>
          <span className="lg-glass-strong squircle-sm px-2 py-0.5 sf text-[10px] font-bold tracking-[0.04em] text-white/90 leading-none">
            {game.period || 'Q2'}
          </span>
        </div>
      </div>

      {/* Body row — team / matchup vs score. Typography scales up at lg+
          so the card carries weight at desktop without feeling stretched. */}
      <div
        className="relative px-4 pt-4 lg:px-5 lg:pt-5 flex items-end justify-between gap-4"
        style={{ zIndex: 2 }}
      >
        <div className="min-w-0">
          <div className="sf-display text-[20px] lg:text-[24px] font-bold text-white tracking-[-0.02em] leading-[1.05] truncate">
            {game.home}
          </div>
          <div className="sf text-[12px] lg:text-[13px] text-white/60 mt-1 truncate">
            vs {game.away}
          </div>
        </div>
        <div className="sf-display text-[32px] lg:text-[40px] font-bold tabular-nums leading-none text-white tracking-[-0.02em] shrink-0">
          {game.scoreHome}
          <span className="text-white/35 mx-1.5">·</span>
          {game.scoreAway}
        </div>
      </div>

      {/* Footer row — compact Watch-live CTA pinned to trailing edge.
          ~50% on phone (room for icon + label), ~33% at lg+ for a
          tighter visual landing under the score column. ms-auto pins
          to inline-end so it RTL-flips. stopPropagation so the inner
          button doesn't double-fire with the outer card. */}
      <div
        className="relative px-4 pt-3 pb-4 lg:px-5 lg:pb-5 flex"
        style={{ zIndex: 2 }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fire();
          }}
          className="live-red ms-auto w-1/2 lg:w-1/3 lg:max-w-[280px] squircle-md py-2.5 flex items-center justify-center gap-2 sf text-[13.5px] font-semibold whitespace-nowrap"
        >
          <PlayIcon />
          {t('home.watchLive')}
        </button>
      </div>
    </div>
  );
};
