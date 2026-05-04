import type { Meta, StoryObj } from '@storybook/react';
import { IdentityCircle } from '@/screens/home/IdentityCircle';

const meta = {
  title: 'Atoms/IdentityCircle',
  component: IdentityCircle,
  decorators: [
    (Story) => (
      <div className="text-white sf relative" style={{ minHeight: 160, padding: 24 }}>
        <div className="lg-atmosphere" />
        <div className="relative z-10">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof IdentityCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Self: Story = {
  args: { kind: 'self', avatar: { initial: 'T' }, label: 'You', isNew: true },
};

export const TeamResting: Story = {
  args: { kind: 'team', avatar: { initial: 'EP' }, label: 'Varsity', isNew: true },
};

export const TeamLive: Story = {
  args: { kind: 'team', avatar: { initial: 'EP' }, label: 'Varsity', liveGame: { gameId: 'g1' } },
};

export const PlayerClaimed: Story = {
  args: {
    kind: 'player',
    avatar: { initial: 'S' },
    team: { initial: 'EP' },
    label: 'Sarah',
    isClaimed: true,
    isNew: true,
  },
};

export const PlayerUnclaimed: Story = {
  args: {
    kind: 'player',
    avatar: { jersey: 23 },
    team: { initial: 'EP' },
    label: 'Player #23',
    isClaimed: false,
  },
};
