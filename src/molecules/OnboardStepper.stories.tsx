import type { Meta, StoryObj } from '@storybook/react';
import { OnboardStepper } from '@/screens/onboarding/_chrome';

const meta = {
  title: 'Molecules/OnboardStepper',
  component: OnboardStepper,
  decorators: [
    (Story) => (
      <div className="anim-fade text-white sf relative" style={{ minHeight: 200 }}>
        <div className="lg-atmosphere" />
        <div className="relative z-10">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof OnboardStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Step1: Story = { args: { step: 1, total: 3 } };
export const Step2: Story = { args: { step: 2, total: 3, onBack: () => {} } };
export const Step3: Story = { args: { step: 3, total: 3, onBack: () => {}, label: "You're in" } };
