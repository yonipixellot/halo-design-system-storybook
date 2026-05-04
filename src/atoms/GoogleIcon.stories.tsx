import type { Meta, StoryObj } from '@storybook/react';
import { GoogleIcon } from '@/screens/auth/_shared';

const meta = {
  title: 'Atoms/GoogleIcon',
  component: GoogleIcon,
} satisfies Meta<typeof GoogleIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="text-white sf p-8 flex items-center gap-3">
      <GoogleIcon />
      <span className="text-[14px]">Continue with Google</span>
    </div>
  ),
};
