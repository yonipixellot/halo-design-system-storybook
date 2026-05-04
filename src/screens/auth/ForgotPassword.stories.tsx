import type { Meta, StoryObj } from '@storybook/react';
import { ForgotPasswordScreen, ForgotSentScreen } from './ForgotPassword';

const meta = {
  title: 'Pages/ForgotPassword',
  component: ForgotPasswordScreen,
  args: { dispatch: (a) => console.log('dispatch', a) },
} satisfies Meta<typeof ForgotPasswordScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Form: Story = {};

/* Email not on file. */
export const EmailNotFound: Story = {
  name: 'Error · Email not found',
  args: {
    error: "We don't have an account for that email. Check the spelling or sign up.",
    fieldError: 'Not on file',
    initialEmail: 'wrong@school.com',
  },
};

/* Network failure. */
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
    initialEmail: 'tal@school.com',
  },
};

/* Success — reset link sent. Renders the prototype's own success screen. */
export const Sent: Story = {
  name: 'Success · Reset link sent',
  render: (args) => <ForgotSentScreen dispatch={args.dispatch} />,
};
