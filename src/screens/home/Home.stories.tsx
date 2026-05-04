import type { Meta, StoryObj } from '@storybook/react';
import { Home } from './Home';
import { HomeHeader } from './HomeHeader';
import { FollowingStrip } from './FollowingStrip';
import { defaultPlayerState } from './_data';

const meta = {
  title: 'Pages/Home',
  component: Home,
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Variant order matches Organisms/GameCard:
   off → pre → live → just-ended → ready → error. */
export const Default: Story = {};
export const PreGame: Story = { args: { gameState: 'pre' } };
export const Live: Story = { args: { gameState: 'live' } };
export const JustEnded: Story = { args: { gameState: 'just-ended' } };
export const DropReady: Story = { args: { gameState: 'ready' } };
export const ErrorState: Story = { args: { gameState: 'error' } };
/* Drops in this game haven't been revealed → tapping them plays PackReveal before HighlightViewer. */
export const WithUnrevealedDrops: Story = {
  args: { gameState: 'ready', unrevealedGameIds: ['gE'] },
};

export const HeaderOnly: Story = {
  render: () => (
    <div className="text-white sf relative" style={{ minHeight: '100%' }}>
      <div className="lg-atmosphere" />
      <div className="relative z-10">
        <HomeHeader greeting="Game day" />
      </div>
    </div>
  ),
};

export const FollowingStripOnly: Story = {
  render: () => (
    <div className="text-white sf relative" style={{ minHeight: '100%' }}>
      <div className="lg-atmosphere" />
      <div className="relative z-10 pt-12">
        <FollowingStrip s={defaultPlayerState} />
      </div>
    </div>
  ),
};
