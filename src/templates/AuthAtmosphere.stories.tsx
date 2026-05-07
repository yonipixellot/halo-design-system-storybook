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
      /* Center the placeholder copy in the canvas so the story actually
         demonstrates the atmosphere filling the viewport — phone keeps
         the existing top-anchored treatment, desktop centers vertically
         and caps width at the global 1200 rule. */
      <div className="px-6 pt-24 text-center lg:pt-0 lg:min-h-screen lg:max-w-[1200px] lg:mx-auto lg:flex lg:flex-col lg:items-center lg:justify-center">
        <h1 className="sf-display text-[24px] font-bold text-white">Auth screen content goes here</h1>
        <p className="sf text-[13px] text-white/60 mt-2">
          The atmosphere wrapper provides the dark canvas, drift gradient, and vignette.
        </p>
      </div>
    ),
  },
};
