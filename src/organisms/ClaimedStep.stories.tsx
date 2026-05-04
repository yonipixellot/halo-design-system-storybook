import type { Meta, StoryObj } from '@storybook/react';
import { ClaimedStep } from '@/screens/onboarding/ClaimedStep';

/* Final onboarding step (player only) — appears after the claim ritual
   in ClaimPage finishes. Stepper label flips to "You're in"; CTA reads
   "Continue to Halo". */

const meta = {
  title: 'Organisms/ClaimedStep',
  component: ClaimedStep,
  decorators: [
    (Story) => (
      <div className="absolute inset-0 anim-fade onboard-glass">
        <div className="lg-atmosphere" />
        <div className="absolute inset-0 z-10 flex flex-col">
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    onContinue: () => console.log('continue to halo'),
  },
} satisfies Meta<typeof ClaimedStep>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Default — Tal Weiss (#7 · SG) on Varsity. 5 teammates pre-followed. */
export const TalWeissOnVarsity: Story = {
  args: { claimedSelfId: 'r1', teamId: 't1' },
};

/* Different player — Sarah Kim (#12 · PG) on Varsity. */
export const SarahKimOnVarsity: Story = {
  args: { claimedSelfId: 'r2', teamId: 't1' },
};
