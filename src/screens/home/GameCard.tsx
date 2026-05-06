import { NextGameTeaser } from './NextGameTeaser';
import { GameCardPre } from './GameCardPre';
import { GameCardLive } from './GameCardLive';
import { GameCardJustEnded } from './GameCardJustEnded';
import { GameCardReady } from './GameCardReady';
import { GameCardError } from './GameCardError';
import { SEED_GAMES, type Game } from './_data';

/* Verbatim port: halo-v3.2-glass.html line 8263.
   Morphing card at the top of Home. Default = NextGameTeaser ("resting
   home"). Override picks a specific variant — pre-game countdown, live
   in-progress, just-ended drop assembling, drop-ready (the payoff), or
   error.

   Variant order (per user spec):
     1. off          → NextGameTeaser  (no game / storytelling)
     2. pre          → GameCardPre     (2 hours before tipoff)
     3. live         → GameCardLive    (in-game, score ticking)
     4. just-ended   → GameCardJustEnded (drop on the way)
     5. ready        → GameCardReady   (drop is ready — payoff)
     6. error        → GameCardError   (snag fallback) */

export type GameCardState = 'off' | 'pre' | 'live' | 'just-ended' | 'ready' | 'error';

export interface GameCardProps {
  state?: GameCardState;
  /** Optional explicit game override. When omitted, picks from SEED_GAMES by status. */
  game?: Game;
  /** Called when user taps the Drop-Ready card. Wire to your reveal trigger. */
  onReveal?: (gameId: string) => void;
  /** Called when user taps the LIVE card. Wire to your live-game viewer. */
  onWatch?: (gameId: string) => void;
  /** Error state callbacks. */
  onRetry?: () => void;
  onReport?: () => void;
}

export const GameCard = ({
  state = 'off',
  game,
  onReveal,
  onWatch,
  onRetry,
  onReport,
}: GameCardProps) => {
  if (state === 'off') {
    return <NextGameTeaser />;
  }

  if (state === 'error') {
    return (
      <div className="px-4 mt-3 mb-4 lg:px-8 xl:px-12 lg:max-w-[840px] lg:mx-auto">
        <GameCardError onRetry={onRetry} onReport={onReport} />
      </div>
    );
  }

  let resolved = game;
  if (!resolved) {
    if (state === 'pre') resolved = SEED_GAMES.find((g) => g.status === 'upcoming');
    if (state === 'live') resolved = SEED_GAMES.find((g) => g.status === 'live');
    if (state === 'just-ended' || state === 'ready') resolved = SEED_GAMES.find((g) => g.status === 'just-ended');
  }
  if (!resolved) return <NextGameTeaser />;

  return (
    <div className="px-4 mt-3 mb-4">
      {state === 'pre' && <GameCardPre game={resolved} />}
      {state === 'live' && <GameCardLive game={resolved} onWatch={onWatch} />}
      {state === 'just-ended' && <GameCardJustEnded game={resolved} />}
      {state === 'ready' && <GameCardReady game={resolved} onReveal={onReveal} />}
    </div>
  );
};
