import type { Meta, StoryObj } from '@storybook/react';
import { WatchScreen } from './WatchScreen';

const meta = {
  title: 'Pages/Watch',
  component: WatchScreen,
  parameters: {
    /* Watch is always-dark, override the global theme decorator's
       background so the story canvas matches the screen's intent. */
    backgrounds: { default: 'ink' },
  },
} satisfies Meta<typeof WatchScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Player ──────────────────────────────────────────────────────── */

export const Player: Story = {
  name: 'Player · default (Eastside Varsity, live game)',
  args: {
    persona: 'player',
  },
};

export const PlayerWithDivisionFilter: Story = {
  name: 'Player · division filter active (Girls JV)',
  args: {
    persona: 'player',
    initialDivision: 'girls-jv',
  },
};

export const PlayerSearching: Story = {
  name: 'Player · search active (‘Lincoln’)',
  args: {
    persona: 'player',
    initialQuery: 'Lincoln',
  },
};

export const PlayerSearchNoMatch: Story = {
  name: 'Player · search no matches',
  args: {
    persona: 'player',
    initialQuery: 'zzzz',
  },
};

/* ── Fan ─────────────────────────────────────────────────────────── */

export const FanWithFollows: Story = {
  name: 'Fan · following Sarah + Dylan',
  args: {
    persona: 'fan',
    followedPlayers: ['sarah', 'dylan'],
  },
};

export const FanEmptyFollows: Story = {
  name: 'Fan · day-one (no follows)',
  args: {
    persona: 'fan',
    followedPlayers: [],
  },
};
