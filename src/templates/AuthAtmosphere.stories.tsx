import type { Meta, StoryObj } from '@storybook/react';
import { AuthAtmosphere } from '@/screens/auth/_shared';

const meta = {
  title: 'Templates/AuthAtmosphere',
  component: AuthAtmosphere,
} satisfies Meta<typeof AuthAtmosphere>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    children: (
      <div className="px-6 pt-24 text-center">
        <h1 className="sf-display text-[24px] font-bold text-white">Auth screen content goes here</h1>
        <p className="sf text-[13px] text-white/60 mt-2">
          The atmosphere wrapper provides the dark canvas, drift gradient, and vignette.
        </p>
      </div>
    ),
  },
};
