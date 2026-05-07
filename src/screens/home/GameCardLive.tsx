import { useEffect, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { Game } from './_data';
import { TEAM_LOGOS } from './_avatars';
import { TEAMS_DB } from '@/screens/onboarding/_data';

/* Team badge used on either side of the score. Tries the bundled
   TEAM_LOGOS image when we can resolve a team initial; otherwise falls
   back to a 1-2 letter monogram on a glass-strong disc.

   Home team gets a cyan ring (subtle "this is your team" cue); away
   team is plain glass-strong. */
const TeamBadge = ({
  name,
  side,
  initial,
  size = 44,
}: {
  name: string;
  side: 'home' | 'away';
  /** Optional team initial — used to look up a real logo image. */
  initial?: string;
  size?: number;
}) => {
  const monogram = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const logoUrl =
    initial && (TEAM_LOGOS as Record<string, string>)[initial];

  const accentBorder =
    side === 'home'
      ? '1.5px solid var(--brand-cyan)'
      : '1px solid var(--glass-strong-border)';
  const accentShadow =
    side === 'home'
      ? '0 0 14px -2px var(--brand-cyan-glow), inset 0 1px 0 rgba(255,255,255,0.10)'
      : 'inset 0 1px 0 rgba(255,255,255,0.10)';

  return (
    <div
      className="rounded-full lg-glass-strong flex items-center justify-center shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        border: accentBorder,
        boxShadow: accentShadow,
      }}
      aria-label={name}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt=""
          className="w-full h-full"
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <span
          className="sf-display font-bold text-white tracking-tight"
          style={{ fontSize: Math.round(size * 0.34) }}
        >
          {monogram}
        </span>
      )}
    </div>
  );
};

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

      {/* Body — scoreboard treatment. [home logo] 28 · 24 [away logo]
          centered, with the matchup line directly below it. The home
          badge tries to render the bundled logo image (resolved via
          game.teamId → TEAMS_DB → initial → TEAM_LOGOS); the away
          badge falls back to a monogram. Score scales up at lg+ so
          it reads as the hero. */}
      <div
        className="relative px-4 pt-4 lg:px-5 lg:pt-5"
        style={{ zIndex: 2 }}
      >
        <div className="flex items-center justify-center gap-4 lg:gap-6">
          <TeamBadge
            name={game.home}
            side="home"
            initial={
              TEAMS_DB.find((tm) => tm.id === game.teamId)?.initial
            }
            size={44}
          />
          <div className="sf-display text-[36px] lg:text-[48px] font-bold tabular-nums leading-none text-white tracking-[-0.03em] flex items-baseline gap-2 lg:gap-3">
            <span>{game.scoreHome}</span>
            <span className="text-white/30">·</span>
            <span>{game.scoreAway}</span>
          </div>
          <TeamBadge name={game.away} side="away" size={44} />
        </div>

        {/* Matchup line — small, centered caption below the scoreboard */}
        <div className="text-center mt-2.5 sf text-[11.5px] lg:text-[12.5px] text-white/55 truncate">
          {game.home} <span className="text-white/35 mx-1">vs</span> {game.away}
        </div>
      </div>

      {/* Footer row — compact Watch-live CTA pinned to inline-start
          (under the team-name column). ~50% on phone (room for icon +
          label), ~33% at lg+ (max 280px). RTL-safe because the parent
          flex row uses flex-start by default; in RTL the button
          auto-flips to the start edge (right side). stopPropagation
          so the inner button doesn't double-fire with the outer card. */}
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
          className="live-red w-1/2 lg:w-1/3 lg:max-w-[280px] squircle-md py-2.5 flex items-center justify-center gap-2 sf text-[13.5px] font-semibold whitespace-nowrap"
        >
          <PlayIcon />
          {t('home.watchLive')}
        </button>
      </div>
    </div>
  );
};
