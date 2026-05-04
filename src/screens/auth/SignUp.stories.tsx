import type { Meta, StoryObj } from '@storybook/react';
import { SignUpScreen } from './SignUp';

const meta = {
  title: 'Pages/SignUp',
  component: SignUpScreen,
  args: { dispatch: (a) => console.log('dispatch', a) },
} satisfies Meta<typeof SignUpScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/* Email already in use. */
export const EmailTaken: Story = {
  name: 'Error · Email taken',
  args: {
    error: 'That email is already on a Halo account. Try signing in instead.',
    fieldErrors: { email: 'Already in use' },
    initialName: 'Tal Weiss',
    initialEmail: 'tal@school.com',
  },
};

/* Weak password — fails our backend rule even though it passes client-side. */
export const WeakPassword: Story = {
  name: 'Error · Weak password',
  args: {
    error: 'That password was found in a known-leaked list. Pick something stronger.',
    fieldErrors: { password: 'Try a longer phrase only you would use' },
    initialName: 'Tal Weiss',
    initialEmail: 'tal@school.com',
    initialPassword: 'Password1',
  },
};

/* Network failure during signup. */
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
    initialName: 'Tal Weiss',
    initialEmail: 'tal@school.com',
    initialPassword: 'StrongPw1',
    initialConfirmPw: 'StrongPw1',
  },
};

/* Success — verification email sent. Replaces form with a glass card. */
export const EmailSent: Story = {
  name: 'Success · Verification email sent',
  args: {
    emailSent: true,
    initialEmail: 'tal@school.com',
  },
};
