import { useMemo, useState } from 'react';
import { cls } from '@/lib/cls';
import { FeaturedHero } from './FeaturedHero';
import { WatchHeroDesktop } from './WatchHeroDesktop';
import { DivisionTileGrid } from './DivisionTileGrid';
import { DivisionFilterChip } from './DivisionFilterChip';
import { WatchRails, type WatchPersona } from './WatchRails';
import { WatchShell } from '@/layouts/WatchShell';
import { SEED_WATCH_GAMES, useT, type WatchGame } from './_data';

/* WatchScreen — top-level orchestrator with responsive split.

   Phone (< lg):
     Atmosphere + sticky glass header (HALO TV + search) → FeaturedHero
     → DivisionTileGrid → (optional) DivisionFilterChip → WatchRails.
     Verbatim port of halo-v3.2-glass.html line 10499.

   Desktop (lg+):
     `WatchShell` primitive owns the chrome (atmosphere + sticky top bar).
     Cinematic `WatchHeroDesktop` slot, then DivisionTileGrid +
     DivisionFilterChip + WatchRails inside the shell's rails column.
     Search is parked on desktop in this pass — Netflix moves it into
     the top bar as an icon-trigger; we'll add that in Phase 2.5 polish.

   Both trees share state (search query + active division) via this
   component's useState. Both render simultaneously with `lg:hidden` /
   `hidden lg:block` swaps so persona-driven content is consistent
   across viewports. DOM is duplicated; for a Storybook demo this is
   acceptable.

   Persona prop:
     - 'player' (default) — shows "Player highlights" rail seeded from
       the user's own moments
     - 'fan' — shows "From players you follow" rail; if followedPlayers
       is empty, the rail renders an empty-state card

   Theme:
     The Watch tab is ALWAYS dark — `data-theme="dark"` on both the
     phone wrapper and the WatchShell. Watch ignores the global Light
     toggle, the same way Netflix doesn't have a light mode. */

export interface WatchScreenProps {
  /** Drives the PlayerHighlightsRail composition. Default 'player'. */
  persona?: WatchPersona;
  /** For 'fan' persona — ids of followed players. Drives the highlights
      rail content. Empty → empty-state card. */
  followedPlayers?: string[];
  /** Pre-seeded division filter (mostly for stories). */
  initialDivision?: string | null;
  /** Pre-seeded search query (phone only — desktop has no search yet). */
  initialQuery?: string;
  /** Push handlers — every CTA reports out via these so the parent can
      route. Optional in standalone stories. */
  onPushGame?: (gameId: string, status: WatchGame['status']) => void;
  onPickMoment?: (id: string, index: number) => void;
  onAllRail?: (railTitle: string) => void;
}

export const WatchScreen = ({
  persona = 'player',
  followedPlayers = [],
  initialDivision = null,
  initialQuery = '',
  onPushGame,
  onPickMoment,
  onAllRail,
}: WatchScreenProps) => {
  const t = useT();
  const [activeDivision, setActiveDivision] = useState<string | null>(initialDivision);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const isSearching = searchQuery.length > 0;

  const suggestions = useMemo(() => {
    if (!isSearching) return [];
    const q = searchQuery.toLowerCase();
    return SEED_WATCH_GAMES.filter((g) =>
      `${g.home} ${g.away}`.toLowerCase().includes(q),
    ).slice(0, 6);
  }, [searchQuery, isSearching]);

  /* Shared body — division grid + filter chip + rails. Reused by both
     phone and desktop trees so persona/division logic lives in one place. */
  const body = (
    <>
      <DivisionTileGrid active={activeDivision} setActive={setActiveDivision} />
      {activeDivision && (
        <DivisionFilterChip
          active={activeDivision}
          onClear={() => setActiveDivision(null)}
        />
      )}
      <WatchRails
        persona={persona}
        activeDivision={activeDivision}
        followedPlayers={followedPlayers}
        onPushGame={onPushGame}
        onPickMoment={(id, index) => onPickMoment?.(id, index)}
        onAllRail={onAllRail}
      />
    </>
  );

  return (
    <>
      {/* ──────────────── Phone (< lg) ──────────────── */}
      <div
        data-theme="dark"
        className="lg:hidden anim-fade pb-28 text-white sf relative min-h-screen"
      >
        {/* Atmosphere + vignette */}
        <div className="lg-atmosphere" />
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, var(--vignette-corner) 0%, transparent 30%, transparent 70%, var(--vignette-corner-soft) 100%)',
          }}
        />

        {/* Header — overlays the top of the FeaturedHero. NO backdrop blur
            (per user request) so it reads as part of the same surface as
            the section below it. Just a subtle top-down fade so the wordmark
            and search input have enough contrast against bright video frames
            but the chrome itself feels integrated, not a separate glass bar. */}
        <div
          className="absolute top-0 inset-x-0 z-30 px-4 pt-5 pb-3"
          style={{
            background:
              'linear-gradient(180deg, rgba(5,8,16,0.55) 0%, rgba(5,8,16,0.20) 70%, transparent 100%)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="sf-display font-bold text-[22px] text-white">
              HALO <span className="text-halo-cyan">TV</span>
            </span>
          </div>

          <div className="relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('watch.searchPlaceholder')}
              className="w-full ps-10 pe-10 py-3 squircle-md text-[15px] outline-none text-white placeholder:text-white/45 lg-glass sf"
            />
            <span className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[16px] text-white/70 pointer-events-none">
              ⌕
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-[13px] text-white/70 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
                aria-label="Clear"
              >
                ✕
              </button>
            )}

            {isSearching && (
              <div className="absolute start-0 end-0 top-[calc(100%+8px)] z-30 lg-glass-card squircle-md overflow-hidden anim-fade">
                {suggestions.length === 0 ? (
                  <div className="px-3 py-4 text-center">
                    <span className="sf text-[10.5px] tracking-[0.14em] uppercase font-semibold text-white/55">
                      {t('watch.noMatches')}
                    </span>
                  </div>
                ) : (
                  suggestions.map((g, i) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setSearchQuery('');
                        onPushGame?.(g.id, g.status);
                      }}
                      className={cls(
                        'w-full px-3 py-2.5 flex items-center gap-3 text-start hover:bg-white/5',
                        i < suggestions.length - 1 ? 'border-b border-white/10' : '',
                      )}
                    >
                      <div
                        className={cls(
                          'w-1.5 h-1.5 rounded-full shrink-0',
                          g.status === 'live'
                            ? 'bg-red-500 anim-pulse'
                            : g.status === 'upcoming'
                              ? 'bg-white/40'
                              : 'bg-white/20',
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="sf text-[13px] font-semibold text-white truncate text-start">
                          {g.home} vs {g.away}
                        </div>
                        <span className="sf text-[10px] tracking-[0.12em] uppercase font-semibold text-white/55">
                          {g.status === 'live'
                            ? `LIVE · ${g.period} · ${g.scoreHome}–${g.scoreAway}`
                            : g.status === 'upcoming'
                              ? 'UPCOMING'
                              : `FINAL · ${g.scoreHome}–${g.scoreAway}`}
                        </span>
                      </div>
                      <span className="text-[12px] text-white/40">›</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Body — phone hero + shared body */}
        <FeaturedHero
          onWatch={(gameId, isLive) =>
            onPushGame?.(gameId, isLive ? 'live' : 'upcoming')
          }
        />
        {body}
      </div>

      {/* ──────────────── Desktop (lg+) ──────────────── */}
      <div className="hidden lg:block">
        <WatchShell
          hero={
            <WatchHeroDesktop
              onWatch={(gameId, isLive) =>
                onPushGame?.(gameId, isLive ? 'live' : 'upcoming')
              }
            />
          }
        >
          {body}
        </WatchShell>
      </div>
    </>
  );
};
