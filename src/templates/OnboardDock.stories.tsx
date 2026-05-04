import type { Meta, StoryObj } from '@storybook/react';
import { OnboardDock } from '@/screens/onboarding/_chrome';

const meta = {
  title: 'Templates/OnboardDock',
  component: OnboardDock,
  decorators: [
    (Story) => (
      <div className="absolute inset-0 onboard-glass flex flex-col" style={{ background: '#000' }}>
        <div className="lg-atmosphere" />
        <div className="flex-1 z-10 relative" />
        <div className="z-10 relative">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof OnboardDock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryCTA: Story = {
  args: {
    children: (
      <button className="lg-btn-primary lg-shine lg-aura squircle-md py-4 w-full sf text-[14.5px] font-semibold">
        Continue
      </button>
    ),
  },
};
