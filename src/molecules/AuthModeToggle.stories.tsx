import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AuthModeToggle, type AuthMode } from '@/screens/auth/_shared';

const meta = {
  title: 'Molecules/AuthModeToggle',
  component: AuthModeToggle,
  decorators: [
    (Story) => (
      <div className="anim-fade text-white sf relative" style={{ minHeight: 200 }}>
        <div className="lg-atmosphere" />
        <div className="relative z-10 px-6 pt-12">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof AuthModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignInActive: Story = {
  render: () => {
    const [m, setM] = useState<AuthMode>('signin');
    return <AuthModeToggle mode={m} onChange={setM} />;
  },
};

export const SignUpActive: Story = {
  render: () => {
    const [m, setM] = useState<AuthMode>('signup');
    return <AuthModeToggle mode={m} onChange={setM} />;
  },
};
