import type { Meta, StoryObj } from '@storybook/react';
import { LivePlayerScreen } from './LivePlayerScreen';
import { SEED_WATCH_GAMES } from './_data';

const meta = {
  title: 'Pages/Watch',
  component: LivePlayerScreen,
  parameters: {
    /* LivePlayer is always-dark and full-screen, override the global
       Storybook backgrounds. */
    backgrounds: { default: 'ink' },
    /* Render at fullscreen since the player is `fixed inset-0`. */
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LivePlayerScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const liveGame = SEED_WATCH_GAMES.find((g) => g.status === 'live');

export const LivePlayer: Story = {
  name: 'Live Player · default (Varsity vs Westfield Hawks)',
  args: {
    game: liveGame,
    onClose: () => console.log('close player'),
  },
};

export const LivePlayerNoVideo: Story = {
  name: 'Live Player · no video src (radial fallback)',
  args: {
    game: liveGame,
    videoSrc: null,
    onClose: () => console.log('close player'),
  },
};
