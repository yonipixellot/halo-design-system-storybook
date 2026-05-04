import type { Meta, StoryObj } from '@storybook/react';
import { AppleIcon } from '@/screens/auth/_shared';

const meta = {
  title: 'Atoms/AppleIcon',
  component: AppleIcon,
} satisfies Meta<typeof AppleIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="text-white sf p-8 flex items-center gap-3">
      <AppleIcon />
      <span className="text-[14px]">Continue with Apple</span>
    </div>
  ),
};
