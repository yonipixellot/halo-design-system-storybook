import { LiveCard, PosterCard } from './_shared';
import { WatchLane } from './WatchLane';
import { PlayerHighlightsRail } from './PlayerHighlightsRail';
import {
  SEED_WATCH_GAMES,
  WATCH_TEAMMATE_MOMENTS,
  CLIENT_EASTSIDE,
  useT,
  type WatchGame,
} from './_data';
import { SEED_MOMENTS, type Moment } from '@/screens/home/_data';

/* WatchRails — composer for the 4–5 rails on the Watch tab.

   Persona-aware composition (the only place persona matters):
     - 'player' — PlayerHighlightsRail seeded from `personId === 'self'`
                  (their own moments)
     - 'fan'    — PlayerHighlightsRail seeded from followed players;
                  empty array renders the empty-state card.

   Division filtering: when `activeDivision` is set, the live + ended
   game lists scope to that division. */

export type WatchPersona = 'player' | 'fan';

export interface WatchRailsProps {
  persona: WatchPersona;
  /** Active division id, or null for "all". */
  activeDivision: string | null;
  /** For 'fan' persona: ids of followed players. Drives the highlights
      rail. Ignored for 'player'. */
  followedPlayers?: string[];
  onPushGame?: (gameId: string, status: WatchGame['status']) => void;
  onPickMoment?: (id: string, index: number, all: Moment[]) => void;
  onAllRail?: (railTitle: string) => void;
}

export const WatchRails = ({
  persona,
  activeDivision,
  followedPlayers = [],
  onPushGame,
  onPickMoment,
  onAllRail,
}: WatchRailsProps) => {
  const t = useT();

  /* Division-scope the source lists. Same logic as v3.2 line 10729. */
  const div = activeDivision
    ? CLIENT_EASTSIDE.divisions.find((d) => d.id === activeDivision)
    : null;
  const liveGames = SEED_WATCH_GAMES.filter((g) => g.status === 'live');
  const ended = SEED_WATCH_GAMES.filter(
    (g) => g.status === 'ended' || g.status === 'just-ended',
  );
  const scopedLive = div ? (div.live ? liveGames.filter((g) => g.divisionId === div.id) : []) : liveGames;
  const scopedEnded = div ? ended.filter((g) => g.divisionId === div.id) : ended;

  /* Persona-driven highlights composition. */
  const playerMoments: Moment[] =
    persona === 'player'
      ? SEED_MOMENTS.filter((m) => m.personId === 'self').slice(0, 8)
      : WATCH_TEAMMATE_MOMENTS.filter((m) => followedPlayers.includes(m.personId)).slice(0, 8);

  return (
    <>
      {/* Live now — appears whenever there's 1+ live game. The single
          live game also takes over the hero (per-user-decision May 2026:
          "Hero + Live rail (game shown in both)"), so the rail is
          always present when anything is streaming. Hidden entirely
          when 0 live games — the hero falls back to the last-played
          game in that case. */}
      {scopedLive.length > 0 && (
        <WatchLane
          title={t('watch.liveNow')}
          onAll={() => onAllRail?.(t('watch.liveNow'))}
        >
          {scopedLive.map((g) => (
            <LiveCard
              key={g.id}
              game={g}
              onClick={() => onPushGame?.(g.id, g.status)}
            />
          ))}
        </WatchLane>
      )}

      {/* Full games — landscape posters, large size */}
      <WatchLane
        title={t('watch.fullGames')}
        onAll={() => onAllRail?.(t('watch.fullGames'))}
      >
        {scopedEnded.map((g) => (
          <PosterCard
            key={g.id}
            game={g}
            big
            onClick={() => onPushGame?.(g.id, g.status)}
          />
        ))}
      </WatchLane>

      {/* Game highlights — landscape posters, normal size */}
      <WatchLane
        title={t('watch.gameHighlights')}
        onAll={() => onAllRail?.(t('watch.gameHighlights'))}
      >
        {scopedEnded.slice(0, 5).map((g) => (
          <PosterCard
            key={g.id}
            game={g}
            onClick={() => onPushGame?.(g.id, g.status)}
          />
        ))}
      </WatchLane>

      {/* Player highlights — vertical 9:16 (persona-aware) */}
      <PlayerHighlightsRail
        moments={playerMoments}
        variant={persona === 'fan' ? 'follows' : 'self'}
        onPick={(id, i) => onPickMoment?.(id, i, playerMoments)}
        onAll={() =>
          onAllRail?.(persona === 'fan' ? t('watch.fromYourFollows') : t('watch.playerHighlights'))
        }
      />

      {/* Suggestions — landscape posters from the reverse end of the list */}
      <WatchLane
        title={t('watch.suggestions')}
        onAll={() => onAllRail?.(t('watch.suggestions'))}
      >
        {scopedEnded.slice().reverse().slice(0, 6).map((g) => (
          <PosterCard
            key={g.id}
            game={g}
            onClick={() => onPushGame?.(g.id, g.status)}
          />
        ))}
      </WatchLane>
    </>
  );
};
