import type { Meta, StoryObj } from '@storybook/react';
import { HomeHeader } from '@/screens/home/HomeHeader';

const meta = {
  title: 'Organisms/HomeHeader',
  component: HomeHeader,
  decorators: [
    (Story) => (
      <div className="anim-fade text-white sf relative" style={{ minHeight: 320 }}>
        <div className="lg-atmosphere" />
        <div className="relative z-10">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof HomeHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { greeting: 'Game day' } };
export const ParentGreeting: Story = { args: { greeting: "Tal's playing" } };
export const CoachGreeting: Story = { args: { greeting: 'Team status' } };
