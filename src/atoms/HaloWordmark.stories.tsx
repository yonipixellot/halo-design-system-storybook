import type { Meta, StoryObj } from '@storybook/react';
import { HaloWordmark } from '@/screens/auth/_shared';

/* The prototype defines HaloWordmark as `() => null` (placeholder for the
   real wordmark, not yet drawn). Story exists so this layer is documented. */
const meta = {
  title: 'Atoms/HaloWordmark',
  component: HaloWordmark,
} satisfies Meta<typeof HaloWordmark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {
  render: () => (
    <div className="text-white sf p-8">
      <div className="text-[12px] text-white/55 mb-2">
        Prototype currently returns null. Real wordmark to be added.
      </div>
      <HaloWordmark />
    </div>
  ),
};
