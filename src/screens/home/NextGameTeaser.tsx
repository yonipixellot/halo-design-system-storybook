import { SEED_GAMES, fmt, useT, useLocalized } from './_data';

interface Insight {
  id?: string;
  date: string;
  title: string;
  body: string;
  statValue?: string;
  statLabel?: string;
}

/* NextGameTeaser — the "no-game-today / resting hero" card on Home.

   Phone (<lg): single combined card with insight on top + next-game
   panel below, separated by an internal border-top divider. Verbatim
   port of halo-v3.2-glass.html line 8304.

   Desktop (lg+): the same content splits into TWO side-by-side cards
   inside a max-w-[1080] container:
     - Insight card (~60%): cyan-accented hero with the daily-insight
       title, body, +stat tile, and "More insights" CTA
     - Next Game card (~40%): subtler glass card with the kickoff line
   Insight is the hero (per the May 2026 layout review), so it carries
   the cyan accent + bigger flex weight. Next Game is secondary chrome. */

export const NextGameTeaser = ({
  insight,
}: {
  insight?: Insight;
}) => {
  const t = useT();
  const localized = useLocalized();

  const resolvedInsight: Insight = insight ?? {
    date: 'APR 3',
    title: t('home.dailyInsightTitle') || 'Crash on the boards',
    body:
      t('home.dailyInsightBody') ||
      'You owned the offensive glass last night — 4 second-chance points in 6 minutes.',
    statValue: '+4',
    statLabel: '2ND-CH PTS',
  };
  const statValue = resolvedInsight.statValue || '+4';
  const statLabel = resolvedInsight.statLabel || '2ND-CH PTS';
  const lastGame = SEED_GAMES.find((g) => g.status === 'just-ended') || null;
  const nextGame = SEED_GAMES.find((g) => g.status === 'upcoming') || null;
  const lastOpp = lastGame ? localized(lastGame, 'away').split(' ')[0] : 'Northside';
  const nextLabel = nextGame
    ? `${localized(nextGame, 'home')} ${t('common.vs')} ${localized(nextGame, 'away')}`
    : 'Varsity vs Lincoln';

  /* === Card style presets === */
  const insightCardStyle: React.CSSProperties = {
    background:
      'radial-gradient(ellipse 65% 55% at 18% 20%, rgba(0,214,254,0.16) 0%, transparent 60%),' +
      'radial-gradient(ellipse 60% 60% at 85% 90%, rgba(132,88,255,0.10) 0%, transparent 65%),' +
      'linear-gradient(180deg, var(--card-base-soft-top) 0%, var(--card-base-soft-bot) 100%)',
    border: '1px solid var(--brand-cyan-border)',
    backdropFilter: 'blur(36px) saturate(180%)',
    WebkitBackdropFilter: 'blur(36px) saturate(180%)',
  };
  const nextGameCardStyle: React.CSSProperties = {
    background: 'var(--glass-card-bg)',
    border: '1px solid var(--glass-card-border)',
    backdropFilter: 'blur(36px) saturate(180%)',
    WebkitBackdropFilter: 'blur(36px) saturate(180%)',
  };

  /* === Insight content blocks (used by both phone + desktop) === */
  const InsightHeader = (
    <div className="relative z-10 px-4 pt-4 pb-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full bg-halo-cyan anim-pulse-dot"
          style={{
            boxShadow:
              '0 0 12px rgba(0,214,254,0.95), 0 0 4px rgba(0,214,254,0.65)',
          }}
        />
        <span
          className="sf text-[10.5px] tracking-[0.18em] uppercase font-bold"
          style={{ color: 'var(--brand-cyan-text)' }}
        >
          {t('home.dailyInsight')} · {resolvedInsight.date}
        </span>
      </div>
      <button
        className="sf text-[10px] tracking-[0.10em] uppercase font-semibold"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {t('common.vs')} {lastOpp.toUpperCase()}{' '}
        <span className="icon-flip-rtl">›</span>
      </button>
    </div>
  );

  const InsightBody = (
    <button className="relative z-10 w-full text-start px-4 pb-4 flex gap-3 items-start">
      <div className="flex-1 min-w-0">
        <div
          className="sf-display text-[21px] font-bold leading-[1.05] tracking-[-0.02em] mb-1.5"
          style={{ color: 'var(--text-primary)' }}
        >
          “{resolvedInsight.title}”
        </div>
        <div
          className="sf text-[12.5px] leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {resolvedInsight.body}
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
          boxShadow:
            'inset 0 1px 0 var(--glass-card-inset-top), 0 4px 14px -4px rgba(0,214,254,0.30)',
        }}
      >
        <span
          className="sf-display text-[28px] font-bold tabular-nums leading-none block"
          style={{
            color: 'var(--brand-cyan-text)',
            textShadow: '0 0 16px rgba(0,214,254,0.55)',
          }}
        >
          {statValue}
        </span>
        <span
          className="sf text-[8px] tracking-[0.16em] uppercase font-bold block mt-1.5"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {statLabel}
        </span>
      </div>
    </button>
  );

  const MoreInsightsCTA = (
    <button
      className="relative z-10 mx-4 mb-3 px-3 py-2 squircle-sm flex items-center justify-between text-start lg-aura"
      style={{
        background: 'var(--brand-cyan-soft)',
        border: '1px solid var(--brand-cyan-border)',
        width: 'calc(100% - 2rem)',
      }}
    >
      <span
        className="sf text-[11.5px] font-semibold"
        style={{ color: 'var(--brand-cyan-text)' }}
      >
        {t('home.moreInsights')}
      </span>
      <span
        className="text-[14px] font-bold icon-flip-rtl"
        style={{ color: 'var(--brand-cyan-text)' }}
      >
        ›
      </span>
    </button>
  );

  /* === Next-game content (without the border-top, so it can serve as
        a standalone card on desktop OR be wrapped with a divider on
        phone for the combined-card treatment) === */
  const NextGameContent = nextGame ? (
    <button
      className="relative z-10 w-full text-start p-3.5 flex items-center justify-between"
      style={{
        background:
          'radial-gradient(ellipse 70% 80% at 20% 50%, rgba(0,214,254,0.10) 0%, transparent 60%),' +
          'var(--hatch-grain)',
      }}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="sf text-[9.5px] tracking-[0.18em] uppercase font-bold"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {t('home.nextGame')}
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
        <div
          className="sf-display text-[15px] font-bold tracking-[-0.01em] truncate"
          style={{ color: 'var(--text-primary)' }}
        >
          {nextLabel}
        </div>
      </div>
      <div className="text-end shrink-0 ms-3">
        <div
          className="sf-display text-[18px] font-bold tabular-nums leading-none"
          style={{ color: 'var(--text-primary)' }}
        >
          {fmt.countdown(nextGame.kickoffInSec)}
        </div>
        <div
          className="sf text-[9.5px] tracking-[0.14em] uppercase block mt-1"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {localized(nextGame, 'venue') || 'Eastside Gym'}
        </div>
      </div>
    </button>
  ) : (
    <div
      className="p-3.5 flex items-center justify-between"
      style={{ background: 'var(--hatch-grain)' }}
    >
      <div className="min-w-0">
        <div
          className="sf text-[9.5px] tracking-[0.18em] uppercase font-bold mb-1"
          style={{ color: 'var(--text-tertiary)' }}
        >
          OFF-SEASON
        </div>
        <div
          className="sf-display text-[14.5px] font-bold tracking-[-0.01em]"
          style={{ color: 'var(--text-secondary)' }}
        >
          No game on the calendar
        </div>
      </div>
      <div
        className="shrink-0 ms-3 sf text-[10px] tracking-[0.14em] uppercase font-semibold"
        style={{ color: 'var(--text-faint)' }}
      >
        Stay sharp
      </div>
    </div>
  );

  return (
    <div className="px-4 mt-3 mb-4 lg:px-8 xl:px-12 lg:max-w-[1080px] lg:mx-auto">
      {/* Phone: single combined card with internal divider */}
      <div
        className="lg:hidden relative squircle-md overflow-hidden lg-teaser-ember"
        style={insightCardStyle}
      >
        {InsightHeader}
        {InsightBody}
        {MoreInsightsCTA}
        <div style={{ borderBlockStart: '1px solid var(--glass-card-border)' }}>
          {NextGameContent}
        </div>
      </div>

      {/* Desktop: insight (60%) + next-game (40%) side-by-side, equal
          height. Each card carries its own background + border. */}
      <div className="hidden lg:flex lg:gap-4 lg:items-stretch">
        <div
          className="flex-[3] relative squircle-md overflow-hidden lg-teaser-ember flex flex-col"
          style={insightCardStyle}
        >
          {InsightHeader}
          {InsightBody}
          <div className="mt-auto">{MoreInsightsCTA}</div>
        </div>
        <div
          className="flex-[2] relative squircle-md overflow-hidden flex flex-col justify-center"
          style={nextGameCardStyle}
        >
          {NextGameContent}
        </div>
      </div>
    </div>
  );
};
