import { useState } from 'react';
import { FeaturedHero } from './FeaturedHero';
import { WatchHeroDesktop } from './WatchHeroDesktop';
import { DivisionTileGrid } from './DivisionTileGrid';
import { DivisionFilterChip } from './DivisionFilterChip';
import { WatchRails, type WatchPersona } from './WatchRails';
import { WatchShell } from '@/layouts/WatchShell';
import { LivePlayerScreen } from './LivePlayerScreen';
import { WatchSearchInput } from './WatchSearchInput';
import { SEED_WATCH_GAMES, type WatchGame } from './_data';

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
  const [activeDivision, setActiveDivision] = useState<string | null>(initialDivision);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  /* When the user taps a live game CTA (hero "Watch Live" or any live
     card in the rails), this holds the game id of the live player to
     mount as a full-screen overlay. Closing returns to the Watch list
     with scroll position preserved (the Watch tree stays mounted). */
  const [livePlayerGameId, setLivePlayerGameId] = useState<string | null>(null);

  /* Internal handler — replaces direct onPushGame for live navigation
     so the player opens in-place. Non-live destinations still bubble
     up via onPushGame for the host app to handle. */
  const handlePushGame = (gameId: string, status: WatchGame['status']) => {
    if (status === 'live') {
      setLivePlayerGameId(gameId);
      return;
    }
    onPushGame?.(gameId, status);
  };

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
        onPushGame={handlePushGame}
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

          <WatchSearchInput
            query={searchQuery}
            setQuery={setSearchQuery}
            onPick={handlePushGame}
            variant="phone"
          />
        </div>

        {/* Body — phone hero + shared body */}
        <FeaturedHero
          onWatch={(gameId, isLive) =>
            handlePushGame(gameId, isLive ? 'live' : 'upcoming')
          }
        />
        {body}
      </div>

      {/* ──────────────── Desktop (lg+) ──────────────── */}
      <div className="hidden lg:block">
        <WatchShell
          topBarRight={
            <WatchSearchInput
              query={searchQuery}
              setQuery={setSearchQuery}
              onPick={handlePushGame}
              variant="desktop"
            />
          }
          hero={
            <WatchHeroDesktop
              onWatch={(gameId, isLive) =>
                handlePushGame(gameId, isLive ? 'live' : 'upcoming')
              }
            />
          }
        >
          {body}
        </WatchShell>
      </div>

      {/* ──────────────── Live Player overlay ──────────────── */}
      {livePlayerGameId && (
        <LivePlayerScreen
          game={SEED_WATCH_GAMES.find((g) => g.id === livePlayerGameId)}
          onClose={() => setLivePlayerGameId(null)}
        />
      )}
    </>
  );
};
