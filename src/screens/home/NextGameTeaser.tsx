import { SEED_GAMES, fmt } from './_data';

interface Insight {
  id?: string;
  date: string;
  title: string;
  body: string;
  statValue?: string;
  statLabel?: string;
}

/* Verbatim port: halo-v3.2-glass.html line 8304.
   The "no-game-today" / resting hero card on Home — editorial Insight on top
   + connected Next-Game panel below. */
export const NextGameTeaser = ({
  insight = {
    date: 'APR 3',
    title: 'Crash on the boards',
    body: 'You owned the offensive glass last night — 4 second-chance points in 6 minutes.',
    statValue: '+4',
    statLabel: '2ND-CH PTS',
  },
}: {
  insight?: Insight;
}) => {
  const statValue = insight.statValue || '+4';
  const statLabel = insight.statLabel || '2ND-CH PTS';
  const lastGame = SEED_GAMES.find((g) => g.status === 'just-ended') || null;
  const nextGame = SEED_GAMES.find((g) => g.status === 'upcoming') || null;
  const lastOpp = lastGame ? lastGame.away.split(' ')[0] : 'Northside';
  const nextLabel = nextGame ? `${nextGame.home} vs ${nextGame.away}` : 'Varsity vs Lincoln';

  return (
    <div className="px-4 mt-3 mb-4">
      <div
        className="relative squircle-md overflow-hidden lg-teaser-ember"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 18% 20%, rgba(0,214,254,0.16) 0%, transparent 60%),' +
            'radial-gradient(ellipse 60% 60% at 85% 90%, rgba(132,88,255,0.10) 0%, transparent 65%),' +
            'linear-gradient(180deg, var(--card-base-soft-top) 0%, var(--card-base-soft-bot) 100%)',
          border: '1px solid var(--brand-cyan-border)',
          backdropFilter: 'blur(36px) saturate(180%)',
          WebkitBackdropFilter: 'blur(36px) saturate(180%)',
        }}
      >
        <div className="relative z-10 px-4 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full bg-halo-cyan anim-pulse-dot"
              style={{ boxShadow: '0 0 12px rgba(0,214,254,0.95), 0 0 4px rgba(0,214,254,0.65)' }}
            />
            <span className="sf text-[10.5px] tracking-[0.18em] uppercase font-bold" style={{ color: 'var(--brand-cyan-text)' }}>
              DAILY INSIGHT · {insight.date}
            </span>
          </div>
          <button className="sf text-[10px] tracking-[0.10em] uppercase font-semibold" style={{ color: 'var(--text-tertiary)' }}>
            vs {lastOpp.toUpperCase()} ›
          </button>
        </div>

        <button className="relative z-10 w-full text-left px-4 pb-4 flex gap-3 items-start">
          <div className="flex-1 min-w-0">
            <div
              className="sf-display text-[21px] font-bold leading-[1.05] tracking-[-0.02em] mb-1.5"
              style={{ color: 'var(--text-primary)' }}
            >
              “{insight.title}”
            </div>
            <div className="sf text-[12.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {insight.body}
            </div>
          </div>
          <div
            className="shrink-0 squircle-sm px-3.5 py-3 text-center lg-teaser-stat"
            style={{
              minWidth: 78,
              background:
                'radial-gradient(ellipse 80% 80% at 50% 35%, rgba(0,214,254,0.22) 0%, transparent 70%),' +
                'var(--glass-strong-bg)',
              border: '1px solid var(--brand-cyan-border)',
              boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), 0 4px 14px -4px rgba(0,214,254,0.30)',
            }}
          >
            <span
              className="sf-display text-[28px] font-bold tabular-nums leading-none block"
              style={{ color: 'var(--brand-cyan-text)', textShadow: '0 0 16px rgba(0,214,254,0.55)' }}
            >
              {statValue}
            </span>
            <span className="sf text-[8px] tracking-[0.16em] uppercase font-bold block mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
              {statLabel}
            </span>
          </div>
        </button>

        <button
          className="relative z-10 mx-4 mb-3 px-3 py-2 squircle-sm flex items-center justify-between text-left lg-aura"
          style={{
            background: 'var(--brand-cyan-soft)',
            border: '1px solid var(--brand-cyan-border)',
            width: 'calc(100% - 2rem)',
          }}
        >
          <span className="sf text-[11.5px] font-semibold" style={{ color: 'var(--brand-cyan-text)' }}>
            More insights from this week
          </span>
          <span className="text-[14px] font-bold" style={{ color: 'var(--brand-cyan-text)' }}>›</span>
        </button>

        {nextGame ? (
          <button
            className="relative z-10 w-full text-left p-3.5 flex items-center justify-between"
            style={{
              borderTop: '1px solid var(--glass-card-border)',
              background:
                'radial-gradient(ellipse 70% 80% at 20% 50%, rgba(0,214,254,0.10) 0%, transparent 60%),' +
                'var(--hatch-grain)',
            }}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="sf text-[9.5px] tracking-[0.18em] uppercase font-bold" style={{ color: 'var(--text-tertiary)' }}>
                  NEXT GAME
                </span>
                <span
                  className="squircle-sm sf text-[8.5px] tracking-[0.14em] uppercase font-bold px-1.5 py-0.5 leading-none"
                  style={{
                    background: 'var(--brand-cyan-soft)',
                    border: '1px solid var(--brand-cyan-border)',
                    color: 'var(--brand-cyan-text)',
                  }}
                >
                  {fmt.until(nextGame.kickoffInSec ?? 0)}
                </span>
              </div>
              <div className="sf-display text-[15px] font-bold tracking-[-0.01em] truncate" style={{ color: 'var(--text-primary)' }}>
                {nextLabel}
              </div>
            </div>
            <div className="text-right shrink-0 ml-3">
              <div className="sf-display text-[18px] font-bold tabular-nums leading-none" style={{ color: 'var(--text-primary)' }}>
                {fmt.countdown(nextGame.kickoffInSec)}
              </div>
              <div className="sf text-[9.5px] tracking-[0.14em] uppercase block mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {nextGame.venue || 'Eastside Gym'}
              </div>
            </div>
          </button>
        ) : (
          <div
            className="p-3.5 flex items-center justify-between"
            style={{ borderTop: '1px solid var(--glass-card-border)', background: 'var(--hatch-grain)' }}
          >
            <div className="min-w-0">
              <div className="sf text-[9.5px] tracking-[0.18em] uppercase font-bold mb-1" style={{ color: 'var(--text-tertiary)' }}>
                OFF-SEASON
              </div>
              <div className="sf-display text-[14.5px] font-bold tracking-[-0.01em]" style={{ color: 'var(--text-secondary)' }}>
                No game on the calendar
              </div>
            </div>
            <div
              className="shrink-0 ml-3 sf text-[10px] tracking-[0.14em] uppercase font-semibold"
              style={{ color: 'var(--text-faint)' }}
            >
              Stay sharp
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
