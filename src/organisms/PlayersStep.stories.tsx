import type { Meta, StoryObj } from '@storybook/react';
import { PlayersStep } from '@/screens/onboarding/PlayersStep';

const meta = {
  title: 'Organisms/PlayersStep',
  component: PlayersStep,
  decorators: [
    (Story) => (
      <div className="absolute inset-0 anim-fade onboard-glass" style={{ background: '#000' }}>
        <div className="lg-atmosphere" />
        <div className="absolute inset-0 z-10 flex flex-col">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof PlayersStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    chosenTeams: ['t1'],
    chosenPlayers: {},
    notify: {},
    persona: 'parent',
    togglePlayer: () => {},
    handleNotifyToggle: () => {},
    onBack: () => {},
    onFinish: () => {},
  },
};

export const SomeFollowed: Story = {
  args: {
    chosenTeams: ['t1'],
    chosenPlayers: { r1: true, r2: true },
    notify: { r1: true },
    persona: 'parent',
    togglePlayer: () => {},
    handleNotifyToggle: () => {},
    onBack: () => {},
    onFinish: () => {},
  },
};
