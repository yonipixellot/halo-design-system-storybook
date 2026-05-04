import type { Game } from './_data';

/* Verbatim port: halo-v3.2-glass.html line 8861.
   Score's final, drop is being assembled. Animated cyan ring around the
   processing badge; whole mini-card breathes via lg-prep-card. */

export interface GameCardJustEndedProps {
  game: Game;
}

export const GameCardJustEnded = ({ game }: GameCardJustEndedProps) => (
  <div
    className="relative squircle-md overflow-hidden"
    style={{
      background:
        'radial-gradient(ellipse 50% 70% at 22% 28%, rgba(0,214,254,0.10) 0%, transparent 60%),' +
        'radial-gradient(ellipse 50% 70% at 80% 78%, rgba(255,170,90,0.08) 0%, transparent 60%),' +
        'linear-gradient(180deg, var(--card-base-soft-top) 0%, var(--card-base-soft-bot) 100%)',
      border: '1px solid var(--glass-card-border)',
      backdropFilter: 'blur(36px) saturate(180%)',
      WebkitBackdropFilter: 'blur(36px) saturate(180%)',
      boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), var(--glass-card-shadow)',
    }}
  >
    <div
      className="relative z-10 px-4 pt-3 pb-2 flex items-center justify-between"
      style={{ borderBottom: '1px solid var(--hairline)' }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-1.5 h-1.5 rounded-full bg-halo-cyan anim-pulse-dot"
          style={{ boxShadow: '0 0 8px rgba(0,214,254,0.7)' }}
        />
        <span
          className="sf text-[10px] font-bold tracking-[0.14em] uppercase"
          style={{ color: 'var(--brand-cyan-text)' }}
        >
          YOUR DROP IS BEING PREPARED
        </span>
      </div>
      <span
        className="sf text-[10px] font-bold tracking-[0.14em] uppercase"
        style={{ color: 'var(--text-tertiary)' }}
      >
        FINAL
      </span>
    </div>

    <div className="relative z-10 p-4 flex items-end justify-between">
      <div>
        <div
          className="sf-display text-[15px] font-bold tracking-[-0.01em] leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {game.home}
        </div>
        <div className="sf text-[11.5px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          vs {game.away}
        </div>
      </div>
      <div
        className="sf-display text-[28px] font-bold tabular-nums leading-none"
        style={{ color: 'var(--text-primary)' }}
      >
        {game.scoreHome}
        <span className="mx-2" style={{ color: 'var(--text-faint)' }}>
          ·
        </span>
        {game.scoreAway}
      </div>
    </div>

    <div className="relative z-10 px-4 pb-4">
      <div
        className="squircle-sm p-3 flex items-center gap-3 lg-prep-card"
        style={{
          background: 'var(--glass-card-bg)',
          border: '1px solid var(--brand-cyan-border)',
          boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), 0 4px 14px -6px rgba(0,214,254,0.25)',
        }}
      >
        <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full lg-prep-spinner"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, transparent 240deg, rgba(0,214,254,0.85) 320deg, rgba(0,214,254,0.95) 340deg, transparent 360deg)',
              mask: 'radial-gradient(circle, transparent 14px, black 15px)',
              WebkitMask: 'radial-gradient(circle, transparent 14px, black 15px)',
            }}
          />
          <div
            className="w-7 h-7 rounded-full lg-glass-strong flex items-center justify-center"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.30), 0 0 12px -2px rgba(0,214,254,0.45)' }}
          >
            <svg
              width={12}
              height={12}
              viewBox="0 0 14 14"
              fill="none"
              stroke="var(--brand-cyan-text)"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: 12, height: 12, display: 'block' }}
            >
              <path d="M2 7 L5 10 L12 3" />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="sf text-[12.5px] font-semibold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {game.momentsCount || 8} moments captured
          </div>
          <div className="sf text-[10.5px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Building drop · 78%
          </div>
          <div
            className="h-[3px] mt-1.5 overflow-hidden rounded-full"
            style={{ background: 'var(--hairline-strong)' }}
          >
            <div
              className="h-full bg-halo-cyan anim-pulse"
              style={{ width: '78%', boxShadow: '0 0 10px rgba(0,214,254,0.65)' }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
