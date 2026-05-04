import type { Meta, StoryObj } from '@storybook/react';
import { SignInScreen } from './SignIn';

const meta = {
  title: 'Pages/SignIn',
  component: SignInScreen,
  args: { dispatch: (a) => console.log('dispatch', a) },
} satisfies Meta<typeof SignInScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/* Per-field error — invalid credentials. Email + password highlighted red. */
export const InvalidCredentials: Story = {
  name: 'Error · Invalid credentials',
  args: {
    error: "Email or password don't match. Try again.",
    fieldErrors: { email: 'Check your email', password: 'Or your password' },
    initialEmail: 'tal@school.com',
    initialPassword: 'wrongpw',
  },
};

/* Banner-only error — network failure. */
export const NetworkError: Story = {
  name: 'Error · Network',
  args: {
    error: "Couldn't reach Halo. Check your internet and try again.",
  },
};

/* Account locked after too many attempts. */
export const AccountLocked: Story = {
  name: 'Error · Account locked',
  args: {
    error: 'Too many failed attempts. Try again in 15 minutes — or reset your password below.',
    initialEmail: 'tal@school.com',
  },
};

/* In-flight — CTA shows spinner, all buttons disabled. */
export const Loading: Story = {
  args: {
    loading: true,
    initialEmail: 'tal@school.com',
    initialPassword: '••••••••',
  },
};
