import { useRef, useState } from 'react';
import { cls } from '@/lib/cls';
import { useTranslation } from 'react-i18next';
import {
  STORYTELLING_DROPS,
  SEED_MOMENTS,
  findGame,
  useT,
  useLocalized,
  type Audience,
  type StorytellingDrop,
} from './_data';

/* Compact 2-3 letter team code from full name. Examples:
     "Varsity"        → "VAR"
     "Northside"      → "NOR"
     "Eagles Prep"    → "EP"
     "Westfield Hawks"→ "WH"   */
const teamCode = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.map((w) => w[0]).join('').slice(0, 3).toUpperCase();
};

/* StorytellingDropViewer — full-screen 60-40 viewer.
   Originally a verbatim port of prototype line 13434 (zinc-900 wireframe
   aesthetic). May 2026 glass pass: kept the layout + structure exactly,
   re-skinned every surface in the Halo Liquid Glass vocabulary so it
   feels like a sibling to HighlightViewer instead of a wireframe.

   Aesthetic:
     - Atmospheric cyan/purple radial bg (matches HighlightViewer)
     - Glass header pills (lg-glass-strong) instead of bare text
     - Hero-tinted moment cards (per-card hue from id hash) with
       lg-aura + lg-shine + hatch grain + cyan-glow glass play button
     - Pagination: active dot is brand-cyan with glow
     - Insight panel: lg-glass-strong with cyan hairline top accent
     - sf-display headlines, text-tertiary body */

export interface StorytellingDropViewerProps {
  /** Drop id from STORYTELLING_DROPS. Resolves audience automatically. */
  dropId?: string;
  /** Override the inferred audience if dropId is ambiguous. */
  audience?: Audience;
  onClose: () => void;
}

const findDrop = (
  dropId: string | undefined,
  audience: Audience = 'player',
): StorytellingDrop | null => {
  if (!dropId) return STORYTELLING_DROPS[audience]?.[0] ?? null;
  for (const aud of Object.keys(STORYTELLING_DROPS) as Audience[]) {
    const hit = STORYTELLING_DROPS[aud].find((d) => d.id === dropId);
    if (hit) return hit;
  }
  return STORYTELLING_DROPS[audience]?.[0] ?? null;
};

/* Synthesize moments when drop's momentIds reference fixtures not in
   SEED_MOMENTS (the prototype has a much larger pool). Same stable
   placeholders the FE team will replace with real moments.
   Cycles through real game IDs so the matchup chip renders in stories. */
const synthesizeMoment = (i: number) => ({
  id: `synth-${i}`,
  gameId: ['gE', 'gE', 'gE', 'gL'][i % 4],
  personId: 'self',
  title: ['And-one + roar', 'OT clutch', 'Steal & finish', 'Lockdown D'][i % 4],
  sub: [`Q4 · 0:55`, `OT · 0:04`, `Q3 · 8:42`, `Q2 · 1:18`][i % 4],
  duration: 9,
  tag: null,
  reactions: 0,
});

/* Per-card hero hues. Each moment in the carousel reads as its own
   distinct vibe — matches the StorytellingDropsRail card hue rotation
   so the rail card and the viewer cards feel related. */
const CARD_HUES = [
  { a: 'rgba(0,214,254,0.42)',  b: 'rgba(132,88,255,0.32)' },
  { a: 'rgba(255,90,158,0.42)', b: 'rgba(255,140,40,0.30)' },
  { a: 'rgba(74,222,128,0.36)', b: 'rgba(0,170,220,0.30)' },
  { a: 'rgba(255,210,80,0.36)', b: 'rgba(255,90,50,0.30)' },
];
const hueFor = (id: string) =>
  CARD_HUES[id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % CARD_HUES.length];

export const StorytellingDropViewer = ({
  dropId,
  audience = 'player',
  onClose,
}: StorytellingDropViewerProps) => {
  const t = useT();
  const localized = useLocalized();
  /* lg-keep-dark + i18n still need access to language for matchup label localization. */
  useTranslation();
  const drop = findDrop(dropId, audience);
  const [index, setIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (!drop) return null;

  const moments = (drop.momentIds || []).map((id, i) => {
    const found = SEED_MOMENTS.find((m) => m.id === id);
    return found || synthesizeMoment(i);
  });

  /* Carousel page detection — in RTL, WebKit reports `scrollLeft` as a
     negative number (Firefox uses positive). `Math.abs()` normalizes
     across both engines and both directions, giving a consistent
     "distance scrolled from the start" regardless of `dir`. */
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.target as HTMLDivElement;
    const w = el.clientWidth || 1;
    const i = Math.round(Math.abs(el.scrollLeft) / (w * 0.82));
    if (i !== index && i >= 0 && i < moments.length) setIndex(i);
  };

  return (
    <div
      data-theme="dark"
      className="absolute inset-0 z-50 anim-fade flex flex-col lg-keep-dark"
      style={{
        background:
          'radial-gradient(ellipse 65% 40% at 50% 25%, rgba(0,214,254,0.18) 0%, transparent 65%),' +
          'radial-gradient(ellipse 70% 45% at 50% 75%, rgba(132,88,255,0.14) 0%, transparent 70%),' +
          'linear-gradient(180deg, #050810 0%, #020308 100%)',
      }}
    >
      {/* === Top bar — glass label pill + glass close === */}
      <div className="absolute top-0 inset-x-0 z-30 px-4 pt-11 flex items-center justify-between">
        <div className="lg-glass-strong squircle-sm px-2.5 py-1 inline-flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full bg-red-600 anim-pulse-dot"
            style={{ boxShadow: '0 0 6px rgba(220,38,38,0.85)' }}
          />
          <span className="sf text-[9.5px] tracking-[0.18em] uppercase font-bold text-white tabular-nums leading-none">
            {t('viewer.halloDropCount', { count: moments.length })}
          </span>
        </div>
        <button
          onClick={onClose}
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

      {/* === Top 60% — horizontal-snap moment cards === */}
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex gap-3 overflow-x-auto no-scrollbar pt-20 pb-3 px-[10%] shrink-0"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          height: '60%',
        }}
      >
        {moments.map((m, i) => {
          const hue = hueFor(m.id || `synth-${i}`);
          const game = m.gameId ? findGame(m.gameId) : undefined;
          const hasFinalScore =
            game && game.scoreHome !== undefined && game.scoreAway !== undefined;
          const homeWon = hasFinalScore && (game.scoreHome ?? 0) > (game.scoreAway ?? 0);
          const awayWon = hasFinalScore && (game.scoreAway ?? 0) > (game.scoreHome ?? 0);
          return (
            <div
              key={m.id}
              className="shrink-0 relative overflow-hidden h-full lg-aura lg-shine squircle-md"
              style={{
                width: '80%',
                scrollSnapAlign: 'center',
                background:
                  `radial-gradient(ellipse 80% 55% at 25% 20%, ${hue.a} 0%, transparent 60%),` +
                  `radial-gradient(ellipse 75% 55% at 80% 80%, ${hue.b} 0%, transparent 65%),` +
                  'linear-gradient(180deg, var(--card-base-strong-top) 0%, var(--card-base-strong-bot) 100%)',
                border: '1px solid var(--glass-card-border)',
                backdropFilter: 'blur(28px) saturate(180%)',
                WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                boxShadow:
                  'inset 0 1px 0 var(--glass-card-inset-top), 0 12px 40px -12px rgba(0,0,0,0.55)',
              }}
            >
              {/* Hatch grain overlay for texture */}
              <div className="absolute inset-0 hatch-dark opacity-50 pointer-events-none" />

              {/* Timestamp glass pill — top-left */}
              <div className="absolute top-3 start-3 z-10">
                <div className="lg-glass-strong squircle-sm px-2 py-0.5 inline-flex items-center gap-1.5">
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{
                      background: 'var(--brand-cyan)',
                      boxShadow: '0 0 6px var(--brand-cyan-glow)',
                    }}
                  />
                  <span className="sf text-[9px] tracking-[0.16em] uppercase font-bold text-white tabular-nums leading-none">
                    {localized(m, 'sub')}
                  </span>
                </div>
              </div>

              {/* Matchup + score pill — top-right.
                  Mirrors the time pill at top-left (sports-broadcast
                  convention: clock + scoreboard at opposite corners).
                  Winner's team code rendered in white, loser dimmed so
                  the eye reads the result without parsing the digits.
                  Hides entirely on synthesized moments without a game. */}
              {game && (
                <div className="absolute top-3 end-3 z-10">
                  <div className="lg-glass-strong squircle-sm px-2 py-0.5 inline-flex items-center gap-1.5 leading-none">
                    <span
                      className="sf text-[9px] tracking-[0.10em] uppercase font-bold tabular-nums"
                      style={{ color: homeWon ? '#fff' : 'rgba(255,255,255,0.55)' }}
                    >
                      {teamCode(game.home)}
                    </span>
                    {hasFinalScore ? (
                      <span className="sf-display text-[10.5px] font-bold tabular-nums text-white">
                        {game.scoreHome}
                        <span style={{ color: 'rgba(255,255,255,0.30)', margin: '0 3px' }}>·</span>
                        {game.scoreAway}
                      </span>
                    ) : (
                      <span
                        className="sf text-[9px] tracking-[0.10em] uppercase font-bold"
                        style={{ color: 'rgba(255,255,255,0.55)' }}
                      >
                        vs
                      </span>
                    )}
                    <span
                      className="sf text-[9px] tracking-[0.10em] uppercase font-bold tabular-nums"
                      style={{ color: awayWon ? '#fff' : 'rgba(255,255,255,0.55)' }}
                    >
                      {teamCode(game.away)}
                    </span>
                  </div>
                </div>
              )}

              {/* Cyan-glow glass play button — center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="relative w-16 h-16 rounded-full lg-glass-strong flex items-center justify-center"
                  style={{
                    border: '1px solid rgba(255,255,255,0.30)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.30), 0 0 32px -6px rgba(0,214,254,0.55), 0 8px 24px -6px rgba(0,0,0,0.55)',
                  }}
                >
                  <svg
                    width={18}
                    height={20}
                    viewBox="0 0 22 26"
                    fill="#fff"
                    style={{
                      width: 18,
                      height: 20,
                      display: 'block',
                      marginInlineStart: 3,
                      filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.45))',
                    }}
                  >
                    <path d="M2 2 L20 13 L2 24 Z" />
                  </svg>
                </div>
              </div>

              {/* Bottom info — title + moment counter */}
              <div
                className="absolute bottom-0 inset-x-0 px-4 pt-12 pb-4 z-10"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.78) 100%)',
                }}
              >
                <div
                  className="sf-display text-white font-bold tracking-[-0.015em] leading-tight mb-1.5"
                  style={{ fontSize: 17, textShadow: '0 2px 10px rgba(0,0,0,0.45)' }}
                >
                  {localized(m, 'title')}
                </div>
                <span className="sf text-[9px] tracking-[0.20em] uppercase font-bold text-white/55 tabular-nums">
                  {t('viewer.momentOf', { n: i + 1, total: moments.length })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* === Pagination dots — active dot glows brand-cyan === */}
      <div className="flex items-center justify-center gap-1.5 pb-3 shrink-0">
        {moments.map((_, i) => (
          <div
            key={i}
            className={cls(
              'h-1 rounded-full transition-all duration-300',
              i === index ? 'w-6' : 'w-1',
            )}
            style={
              i === index
                ? {
                    background: 'var(--brand-cyan)',
                    boxShadow: '0 0 10px var(--brand-cyan-glow)',
                  }
                : { background: 'rgba(255,255,255,0.30)' }
            }
          />
        ))}
      </div>

      {/* === Bottom 40% — HALO Insight glass panel === */}
      <div
        className="flex-1 overflow-y-auto relative"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,12,20,0.0) 0%, rgba(8,10,16,0.65) 12%, rgba(5,7,12,0.92) 100%)',
        }}
      >
        {/* Cyan hairline accent at the top of the panel */}
        <div
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(0,214,254,0.55) 35%, rgba(0,214,254,0.55) 65%, transparent 100%)',
          }}
        />

        <div className="px-5 pt-5 pb-7">
          {/* HALO Insight chip */}
          <div className="lg-glass-strong squircle-sm px-2 py-0.5 inline-flex items-center gap-1.5 mb-3">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: 'var(--brand-cyan)',
                boxShadow: '0 0 6px var(--brand-cyan-glow)',
              }}
            />
            <span className="sf text-[9.5px] tracking-[0.18em] uppercase font-bold text-white leading-none">
              {t('viewer.haloInsight')}
            </span>
          </div>

          {/* Headline */}
          <div
            className="sf-display text-white font-bold leading-[1.08] tracking-[-0.02em] mb-3"
            style={{ fontSize: 22 }}
          >
            {localized(drop, 'title')}
          </div>

          {/* Body */}
          <div
            className="sf text-[13.5px] leading-[1.55]"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {localized(drop, 'body')}
          </div>
        </div>
      </div>
    </div>
  );
};
