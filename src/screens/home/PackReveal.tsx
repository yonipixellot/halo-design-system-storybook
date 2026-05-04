import { useEffect, useState } from 'react';
import { cls } from '@/lib/cls';
import { findGame, ROSTER_LITE, SEED_GAMES, SEED_MOMENTS, type Moment } from './_data';

/* Holographic card-pack reveal ceremony — replaces the prototype's
   monochrome wireframe (bg-white / font-mono) with a cinematic dark
   portal. Three stages, ~2.2s total:
     1. locked    (0–600ms)    pack stack floats, foil shimmer, halo pulses
     2. revealing (600–1700ms) shake intensifies, cyan ramp builds
     3. reveal    (1700ms+)    burst flash → title + moment grid + CTA

   The VThumb inside the reveal grid is the glass version from the
   prototype (line 3002), trimmed to size='sm' for a 3-col grid. */

/* Verbatim glass VThumb (prototype line 3002), size='sm'. */
const VThumb = ({ moment, onClick }: { moment: Moment; onClick?: () => void }) => {
  const w = 92;
  const h = w * (16 / 9);
  const personId = moment?.personId === 'self' ? 'r1' : moment?.personId;
  const player = personId ? ROSTER_LITE.find((p) => p.id === personId) : null;
  const game = moment?.gameId ? SEED_GAMES.find((g) => g.id === moment.gameId) : null;
  const titleText = player ? `#${player.number} player highlight` : moment?.title || 'Highlight';
  const subText = game ? `${game.home} vs ${game.away}` : moment?.sub || '';
  const durationStr = moment?.duration != null ? `0:${String(moment.duration).padStart(2, '0')}` : null;
  return (
    <button
      onClick={onClick}
      className="relative shrink-0 overflow-hidden squircle-md lg-aura lg-shine"
      style={{
        width: w,
        height: h,
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
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-11 h-11 rounded-full lg-glass-strong flex items-center justify-center">
          <svg
            width={12}
            height={14}
            viewBox="0 0 12 14"
            fill="currentColor"
            className="text-white ml-0.5"
            style={{ width: 12, height: 14, display: 'block' }}
          >
            <path d="M0 1.2v11.6c0 .9 1 1.4 1.7 1l9.6-5.8c.7-.4.7-1.5 0-1.9L1.7.2C1 -.2 0 .3 0 1.2z" />
          </svg>
        </div>
      </div>
      {durationStr && (
        <div className="absolute top-2 left-2 lg-glass squircle-sm px-1.5 py-0.5 z-10">
          <span className="sf text-[9.5px] font-semibold text-white/90 leading-none tabular-nums">
            {durationStr}
          </span>
        </div>
      )}
      <div
        className="absolute inset-x-0 bottom-0 px-2.5 pt-8 pb-2.5 z-10"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.95) 100%)',
        }}
      >
        <div className="sf-display text-white text-[11px] font-bold leading-tight tracking-[-0.005em] clip2">
          {titleText}
        </div>
        <div className="sf text-white/65 text-[9.5px] mt-0.5 truncate">{subText}</div>
      </div>
    </button>
  );
};

/* The actual holographic card — three-tier glass stack with cyan/purple
   foil. Front card carries the moment count + game matchup. */
const HoloCard = ({
  count,
  matchup,
  intensity,
}: {
  count: number;
  matchup: string;
  intensity: 'idle' | 'revealing';
}) => (
  <div
    className={cls(
      'relative w-[208px] h-[280px]',
      intensity === 'idle' ? 'lg-pack-float' : 'anim-wiggle',
    )}
  >
    {/* Back card — most tilted, dimmest */}
    <div
      className="absolute squircle-md lg-glass"
      style={{
        inset: '20px -8px 0 24px',
        transform: 'rotate(-9deg)',
        opacity: 0.72,
        boxShadow: '0 12px 28px -10px rgba(0,0,0,0.55)',
      }}
    />
    {/* Middle card — slight tilt */}
    <div
      className="absolute squircle-md lg-glass-card"
      style={{
        inset: '10px 8px 0 16px',
        transform: 'rotate(-4deg)',
        opacity: 0.88,
        boxShadow: '0 16px 32px -12px rgba(0,0,0,0.6)',
      }}
    />
    {/* Front card — the holographic foil hero */}
    <div
      className="absolute inset-0 squircle-md overflow-hidden lg-shine"
      style={{
        background:
          'conic-gradient(from 220deg at 30% 30%, rgba(0,214,254,0.55) 0deg, rgba(132,88,255,0.45) 110deg, rgba(255,92,158,0.35) 200deg, rgba(0,214,254,0.55) 360deg),' +
          'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(255,255,255,0.25) 0%, transparent 60%),' +
          'linear-gradient(180deg, rgba(20,22,30,0.85) 0%, rgba(8,10,16,0.92) 100%)',
        backgroundSize: '200% 200%, 100% 100%, 100% 100%',
        border: '1px solid rgba(0,214,254,0.55)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.30), 0 0 60px -8px rgba(0,214,254,0.55), 0 24px 48px -16px rgba(0,0,0,0.7)',
      }}
    >
      {/* Foil sheen — drifts across the surface */}
      <div
        className="absolute inset-0 lg-pack-foil"
        style={{
          background:
            'conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.0) 0deg, rgba(255,255,255,0.18) 60deg, rgba(255,255,255,0.0) 120deg, rgba(255,255,255,0.0) 360deg)',
          mixBlendMode: 'overlay',
          opacity: 0.7,
        }}
      />
      {/* Hatch grain — adds tooth so it doesn't read as plastic */}
      <div className="absolute inset-0 hatch opacity-50" />

      {/* Eyebrow — top center */}
      <div className="absolute top-5 inset-x-0 z-10 text-center">
        <span
          className="sf text-[9px] font-bold tracking-[0.22em] uppercase"
          style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 0 12px rgba(0,214,254,0.85)' }}
        >
          YOUR DROP
        </span>
      </div>

      {/* Big number — the moment count, glowing cyan */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <div
          className="sf-display font-bold tabular-nums leading-none"
          style={{
            fontSize: 88,
            color: '#fff',
            textShadow:
              '0 0 24px rgba(0,214,254,0.85), 0 0 56px rgba(0,214,254,0.45), 0 6px 18px rgba(0,0,0,0.6)',
          }}
        >
          {count}
        </div>
        <div
          className="sf text-[10.5px] mt-2 font-bold tracking-[0.28em] uppercase"
          style={{ color: 'rgba(255,255,255,0.85)' }}
        >
          Moments
        </div>
      </div>

      {/* Bottom matchup chip */}
      <div
        className="absolute bottom-3 inset-x-3 px-2 py-1.5 squircle-sm text-center z-10"
        style={{
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <span
          className="sf text-[9px] font-bold tracking-[0.16em] uppercase leading-none"
          style={{ color: 'rgba(255,255,255,0.92)' }}
        >
          {matchup}
        </span>
      </div>
    </div>

    {/* Cyan halo behind the whole stack */}
    <div
      className="absolute inset-0 -z-10 lg-pack-halo pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,214,254,0.55) 0%, transparent 70%)',
        filter: 'blur(20px)',
        transform: 'scale(1.2)',
      }}
    />
  </div>
);

export interface PackRevealProps {
  /** Game ID of the drop being unwrapped. */
  gameId: string;
  /** Dismiss the ceremony (X button or "Added to drops" CTA). */
  onDismiss: () => void;
  /** Tap a moment thumbnail in the reveal grid → open HighlightViewer. */
  onOpenMoment?: (ids: string[], index: number) => void;
}

export const PackReveal = ({ gameId, onDismiss, onOpenMoment }: PackRevealProps) => {
  const game = findGame(gameId);
  const moments = SEED_MOMENTS.filter((m) => m.gameId === gameId);
  const [stage, setStage] = useState<'locked' | 'revealing' | 'reveal'>('locked');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('revealing'), 600);
    const t2 = setTimeout(() => setStage('reveal'), 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      data-theme="dark"
      className="absolute inset-0 z-50 anim-fade flex flex-col lg-keep-dark"
      style={{
        background:
          'radial-gradient(ellipse 70% 50% at 50% 35%, rgba(0,214,254,0.18) 0%, transparent 65%),' +
          'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(132,88,255,0.14) 0%, transparent 70%),' +
          'linear-gradient(180deg, #050810 0%, #020308 100%)',
      }}
    >
      {/* Top bar — eyebrow + close */}
      <div className="px-4 pt-12 pb-3 flex items-center justify-between relative z-30">
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full bg-halo-cyan anim-pulse-dot"
            style={{ boxShadow: '0 0 10px rgba(0,214,254,0.85)' }}
          />
          <span
            className="sf text-[10px] font-bold tracking-[0.18em] uppercase"
            style={{ color: 'var(--brand-cyan-text)' }}
          >
            DROP REVEAL
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="w-9 h-9 lg-glass squircle-sm flex items-center justify-center text-white"
          aria-label="Close"
        >
          <svg
            width={12}
            height={12}
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            style={{ width: 12, height: 12, display: 'block' }}
          >
            <path d="M3 3 L11 11 M11 3 L3 11" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Atmospheric particle dust — floats up behind the pack while locked/revealing */}
        {stage !== 'reveal' && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            {[18, 35, 52, 68, 82].map((leftPct, i) => (
              <div
                key={i}
                className="absolute lg-pack-dust"
                style={{
                  left: `${leftPct}%`,
                  bottom: '30%',
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: 'rgba(0,214,254,0.55)',
                  boxShadow: '0 0 6px rgba(0,214,254,0.85)',
                  animationDelay: `${i * 280}ms`,
                }}
              />
            ))}
          </div>
        )}

        {/* Pack — locked / revealing stages */}
        {stage !== 'reveal' && (
          <HoloCard
            count={moments.length}
            matchup={game ? `${game.home} vs ${game.away}` : 'YOUR DROP'}
            intensity={stage === 'revealing' ? 'revealing' : 'idle'}
          />
        )}

        {/* Burst flash — fires on the locked → reveal stage flip */}
        {stage === 'reveal' && (
          <div
            className="absolute inset-0 pointer-events-none lg-pack-burst"
            aria-hidden
            style={{
              background:
                'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.95) 0%, rgba(0,214,254,0.65) 30%, transparent 60%)',
            }}
          />
        )}

        {/* Reveal stage — title, score, moment grid, CTA */}
        {stage === 'reveal' && (
          <div className="w-full max-w-[340px] anim-fade">
            <div className="text-center mb-5 lg-pack-title-in">
              <div
                className="sf text-[9.5px] font-bold tracking-[0.22em] uppercase mb-2"
                style={{
                  color: 'var(--brand-cyan-text)',
                  textShadow: '0 0 12px rgba(0,214,254,0.65)',
                }}
              >
                YOUR DROP IS UNLOCKED
              </div>
              <div
                className="sf-display text-[24px] font-bold tracking-[-0.02em] leading-none"
                style={{
                  color: '#fff',
                  textShadow: '0 0 24px rgba(0,214,254,0.45), 0 4px 14px rgba(0,0,0,0.55)',
                }}
              >
                {game?.home} <span style={{ color: 'rgba(255,255,255,0.45)' }}>vs</span> {game?.away}
              </div>
              {game && game.scoreHome != null && (
                <div
                  className="inline-flex items-center gap-2 mt-3 squircle-sm px-2.5 py-1"
                  style={{
                    background: 'var(--glass-card-bg)',
                    border: '1px solid var(--glass-card-border)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  <span
                    className="sf text-[9.5px] font-bold tracking-[0.18em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    FINAL
                  </span>
                  <span
                    className="sf-display text-[13px] font-bold tabular-nums"
                    style={{ color: '#fff' }}
                  >
                    {game.scoreHome}–{game.scoreAway}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {moments.map((m, i) => (
                <div key={m.id} className="anim-slide-up" style={{ animationDelay: `${200 + i * 80}ms` }}>
                  <VThumb
                    moment={m}
                    onClick={() => {
                      onDismiss();
                      onOpenMoment?.(
                        moments.map((x) => x.id),
                        i,
                      );
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={onDismiss}
              className="lg-btn-primary lg-shine squircle-sm w-full mt-5 py-3 sf text-[12.5px] font-semibold flex items-center justify-center gap-2 anim-slide-up"
              style={{ animationDelay: `${200 + moments.length * 80 + 80}ms` }}
            >
              <span>Added to your drops</span>
              <span className="text-[14px] leading-none">›</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
