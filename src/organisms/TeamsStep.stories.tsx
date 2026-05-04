import type { Meta, StoryObj } from '@storybook/react';
import { TeamsStep } from '@/screens/onboarding/TeamsStep';

const meta = {
  title: 'Organisms/TeamsStep',
  component: TeamsStep,
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
} satisfies Meta<typeof TeamsStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ParentEmpty: Story = {
  args: {
    chosen: [],
    setChosen: () => {},
    persona: 'parent',
    onBack: () => {},
    onNext: () => {},
  },
};

export const ParentSelected: Story = {
  args: {
    chosen: ['t1', 't3'],
    setChosen: () => {},
    persona: 'parent',
    onBack: () => {},
    onNext: () => {},
  },
};

