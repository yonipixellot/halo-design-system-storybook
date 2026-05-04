import type { Meta, StoryObj } from '@storybook/react';
import { EditorialDropThumb } from '@/screens/home/EditorialDropThumb';
import { SEED_MOMENTS } from '@/screens/home/_data';

const meta = {
  title: 'Molecules/EditorialDropThumb',
  component: EditorialDropThumb,
  decorators: [
    (Story) => (
      <div className="text-white sf relative" style={{ minHeight: 360, padding: 20 }}>
        <div className="lg-atmosphere" />
        <div className="relative z-10">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof EditorialDropThumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = { args: { moment: SEED_MOMENTS[0] } };
export const Hot: Story = { args: { moment: SEED_MOMENTS[1] } };
export const Coach: Story = { args: { moment: SEED_MOMENTS[2] } };
export const Streak: Story = { args: { moment: SEED_MOMENTS[3] } };
export const Untagged: Story = { args: { moment: SEED_MOMENTS[4] } };

export const AllInRow: Story = {
  render: () => (
    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
      {SEED_MOMENTS.map((m) => (
        <EditorialDropThumb key={m.id} moment={m} />
      ))}
    </div>
  ),
};
