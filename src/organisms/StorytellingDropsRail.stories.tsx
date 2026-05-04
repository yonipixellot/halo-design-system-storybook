import type { Meta, StoryObj } from '@storybook/react';
import { StorytellingDropsRail } from '@/screens/home/StorytellingDropsRail';

const meta = {
  title: 'Organisms/StorytellingDropsRail',
  component: StorytellingDropsRail,
  decorators: [
    (Story) => (
      <div className="anim-fade text-white sf relative" style={{ minHeight: 420 }}>
        <div className="lg-atmosphere" />
        <div className="relative z-10 pt-8">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof StorytellingDropsRail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Player: Story = { args: { audience: 'player' } };
export const Parent: Story = { args: { audience: 'parent' } };
export const Coach: Story = { args: { audience: 'coach' } };
