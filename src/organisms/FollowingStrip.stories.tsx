import type { Meta, StoryObj } from '@storybook/react';
import { FollowingStrip } from '@/screens/home/FollowingStrip';
import { defaultPlayerState } from '@/screens/home/_data';

const meta = {
  title: 'Organisms/FollowingStrip',
  component: FollowingStrip,
  decorators: [
    (Story) => (
      <div className="anim-fade text-white sf relative" style={{ minHeight: 320 }}>
        <div className="lg-atmosphere" />
        <div className="relative z-10 pt-8">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof FollowingStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { s: defaultPlayerState } };
export const NoFollows: Story = {
  args: { s: { ...defaultPlayerState, followedTeams: [], followedPlayers: [] } },
};
