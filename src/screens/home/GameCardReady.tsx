import type { Game } from './_data';

/* Verbatim port: halo-v3.2-glass.html line 8983.
   The payoff. Drop is assembled and waiting to open. Cyan ember halo,
   stacked glass cards with anticipation shift, tap → trigger pack reveal. */

export interface GameCardReadyProps {
  game: Game;
  onReveal?: (gameId: string) => void;
}

export const GameCardReady = ({ game, onReveal }: GameCardReadyProps) => {
  const winning = (game.scoreHome || 0) > (game.scoreAway || 0);
  const margin = Math.abs((game.scoreHome || 0) - (game.scoreAway || 0));

  return (
    <button
      onClick={() => onReveal?.(game.id)}
      className="relative w-full text-left squircle-md overflow-hidden lg-aura lg-shine lg-ready-ember active:scale-[0.98]"
      style={{
        background:
          'radial-gradient(ellipse 60% 70% at 22% 28%, rgba(0,214,254,0.18) 0%, transparent 60%),' +
          'radial-gradient(ellipse 60% 70% at 80% 78%, rgba(132,88,255,0.10) 0%, transparent 60%),' +
          'linear-gradient(180deg, var(--card-base-soft-top) 0%, var(--card-base-soft-bot) 100%)',
        border: '1px solid var(--brand-cyan-border)',
        backdropFilter: 'blur(36px) saturate(180%)',
        WebkitBackdropFilter: 'blur(36px) saturate(180%)',
        transition: 'transform 120ms cubic-bezier(.2,.8,.2,1)',
      }}
    >
      <div
        className="relative z-10 px-4 pt-3 pb-2 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--hairline)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full bg-halo-cyan anim-pulse-dot"
            style={{ boxShadow: '0 0 10px rgba(0,214,254,0.85)' }}
          />
          <span
            className="sf text-[10px] font-bold tracking-[0.14em] uppercase"
            style={{ color: 'var(--brand-cyan-text)' }}
          >
            YOUR DROP IS READY
          </span>
        </div>
        <span
          className="sf text-[10px] font-bold tracking-[0.14em] uppercase"
          style={{ color: 'var(--brand-cyan-text)' }}
        >
          TAP ›
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
        <div className="flex items-center gap-2">
          <div
            className="sf-display text-[24px] font-bold tabular-nums leading-none"
            style={{ color: 'var(--text-primary)' }}
          >
            {game.scoreHome}
            <span style={{ color: 'var(--text-faint)' }}> · </span>
            {game.scoreAway}
          </div>
          <div
            className="sf text-[10px] tracking-[0.16em] uppercase font-bold px-1.5 py-0.5 squircle-sm"
            style={{
              background: winning ? 'var(--brand-cyan-soft)' : 'var(--hatch-grain)',
              border: '1px solid ' + (winning ? 'var(--brand-cyan-border)' : 'var(--hairline-strong)'),
              color: winning ? 'var(--brand-cyan-text)' : 'var(--text-tertiary)',
            }}
          >
            {winning ? '+' + margin : 'L'}
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 pb-4">
        <div className="relative h-[100px] lg-ready-stack">
          <div
            className="absolute inset-x-12 top-3 h-[80px] lg-glass squircle-sm"
            style={{ transform: 'rotate(-5deg)' }}
          />
          <div
            className="absolute inset-x-8 top-1.5 h-[90px] lg-glass-card squircle-sm"
            style={{ transform: 'rotate(-2deg)' }}
          />
          <div
            className="absolute inset-x-4 top-0 h-[100px] lg-glass-strong squircle-sm flex items-center justify-between px-4"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.30), 0 8px 24px -8px rgba(0,214,254,0.35)' }}
          >
            <div>
              <div
                className="sf-display text-[26px] font-bold leading-none"
                style={{ color: 'var(--text-primary)' }}
              >
                {game.momentsCount || 8}
              </div>
              <span
                className="sf text-[9.5px] tracking-[0.14em] font-bold uppercase mt-1 block"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Moments
              </span>
            </div>
            <div className="text-right">
              <div
                className="sf-display text-[20px] font-bold tabular-nums leading-none"
                style={{ color: 'var(--brand-cyan-text)', textShadow: '0 0 12px rgba(0,214,254,0.45)' }}
              >
                +{margin || 12} PTS
              </div>
              <span
                className="sf text-[9.5px] tracking-[0.14em] font-bold uppercase mt-1 block"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {winning ? 'Your night' : 'Bright spots'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};
