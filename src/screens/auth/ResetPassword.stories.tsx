import type { Meta, StoryObj } from '@storybook/react';
import { ResetPasswordScreen, ResetDoneScreen } from './ResetPassword';

const meta = {
  title: 'Pages/ResetPassword',
  component: ResetPasswordScreen,
  args: { dispatch: (a) => console.log('dispatch', a) },
} satisfies Meta<typeof ResetPasswordScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Form: Story = {};

/* Confirm doesn't match the new password. */
export const PasswordMismatch: Story = {
  name: 'Error · Password mismatch',
  args: {
    error: "Those don't match. Type the same password in both fields.",
    fieldErrors: { confirm: "Doesn't match" },
    initialPassword: 'NewPass123',
    initialConfirmPw: 'NewPass99',
  },
};

/* Network / server failure. */
export const NetworkError: Story = {
  name: 'Error · Network',
  args: {
    error: "Couldn't reach Halo. Check your internet and try again.",
  },
};

/* In-flight — CTA shows spinner. */
export const Loading: Story = {
  args: {
    loading: true,
    initialPassword: 'NewPass123',
    initialConfirmPw: 'NewPass123',
  },
};

/* Token from the email is expired or already used. Full-screen state. */
export const InvalidToken: Story = {
  name: 'Error · Link expired',
  args: { invalidToken: true },
};

/* Success — password updated. Renders the prototype's own done screen. */
export const Done: Story = {
  name: 'Success · Password updated',
  render: (args) => <ResetDoneScreen dispatch={args.dispatch} />,
};
