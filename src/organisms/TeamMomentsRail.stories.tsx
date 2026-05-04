import type { Meta, StoryObj } from '@storybook/react';
import { TeamMomentsRail } from '@/screens/home/TeamMomentsRail';

const meta = {
  title: 'Organisms/TeamMomentsRail',
  component: TeamMomentsRail,
  decorators: [
    (Story) => (
      <div className="anim-fade text-white sf relative" style={{ minHeight: 280 }}>
        <div className="lg-atmosphere" />
        <div className="relative z-10 pt-8">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof TeamMomentsRail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
