import type { Meta, StoryObj } from '@storybook/react';
import { GameCard } from '@/screens/home/GameCard';

/* Morphing game card — the hero card at the top of Home that swaps
   between states based on game.status. Story order per user spec:
     1. Off-day      (no games / storytelling)
     2. Pre-game     (2h before tipoff)
     3. Live         (in-game, score ticking)
     4. Just-ended   (post-game / drop on the way)
     5. Drop ready   (drop assembled — payoff)
     6. Error        (snag fallback) */

const meta = {
  title: 'Organisms/GameCard',
  component: GameCard,
  args: {
    onReveal: (id) => console.log('reveal drop', id),
    onWatch: (id) => console.log('watch live game', id),
    onRetry: () => console.log('retry'),
    onReport: () => console.log('report a bug'),
  },
} satisfies Meta<typeof GameCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 1. No game — editorial Daily Insight + Next-Game footer (or off-season fallback). */
export const OffDay: Story = {
  name: '1 · Off-day (storytelling)',
  args: { state: 'off' },
};

/* 2. Pre-game — countdown ticking, cyan ember, breathing border.
   Wired to a 2h-out fixture per the spec. */
export const PreGame: Story = {
  name: '2 · Pre-game (2h before)',
  args: {
    state: 'pre',
    game: {
      id: 'gPre',
      home: 'Varsity',
      away: 'Lincoln Tigers',
      teamId: 't1',
      status: 'upcoming',
      kickoffInSec: 7200,
      venue: 'Lincoln HS',
    },
  },
};

/* Sub-state: < 10 min to tipoff. Header flips to "STARTING SOON",
   cyan glow doubles, countdown number gets a glow shadow. */
export const PreGameImminent: Story = {
  name: '2a · Pre-game (imminent · 5 min)',
  args: {
    state: 'pre',
    game: {
      id: 'gPre',
      home: 'Varsity',
      away: 'Lincoln Tigers',
      teamId: 't1',
      status: 'upcoming',
      kickoffInSec: 300,
      venue: 'Lincoln HS',
    },
  },
};

/* 3. LIVE — in-game card with breathing red ember, tally rail, broadcast
   sweep (dark mode), score ticker. Tap goes to the live-game viewer. */
export const Live: Story = {
  name: '3 · Live (score ticking)',
  args: { state: 'live' },
};

/* 4. Just-ended — score is final, drop is being assembled.
   Spinning cyan ring around the processing badge. */
export const JustEnded: Story = {
  name: '4 · Just-ended (drop on the way)',
  args: { state: 'just-ended' },
};

/* 5. Drop ready — the payoff. Tap to trigger reveal ceremony. */
export const DropReady: Story = {
  name: '5 · Drop ready',
  args: { state: 'ready' },
};

/* Loss variant — same Ready card but with an L chip instead of +margin. */
export const DropReadyLoss: Story = {
  name: '5a · Drop ready (loss)',
  args: {
    state: 'ready',
    game: {
      id: 'gLoss',
      home: 'Varsity',
      away: 'Northside',
      teamId: 't1',
      status: 'just-ended',
      scoreHome: 58,
      scoreAway: 64,
      momentsCount: 6,
    },
  },
};

/* 6. Error fallback — invented variant. NOT in v3.2 prototype.
   Same surface as the others, neutral amber tint, "Report a bug" link. */
export const ErrorState: Story = {
  name: '6 · Error (snag · report a bug)',
  args: { state: 'error' },
};
