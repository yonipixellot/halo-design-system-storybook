import type { Meta, StoryObj } from '@storybook/react';
import { DropsSection } from '@/screens/home/DropsSection';

const meta = {
  title: 'Organisms/DropsSection',
  component: DropsSection,
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
} satisfies Meta<typeof DropsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/* Day-one empty state — user has no drops yet. */
export const Empty: Story = {
  name: 'Empty · day-one',
  args: { moments: [] },
};
