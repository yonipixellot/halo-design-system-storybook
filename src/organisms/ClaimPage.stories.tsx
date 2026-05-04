import type { Meta, StoryObj } from '@storybook/react';
import { ClaimPage } from '@/screens/onboarding/ClaimPage';

/* Full-screen jersey-claim page. Opens when the player taps a coach
   invite URL (or in onboarding, the demo URL pill in ClaimAthleteExplainer).
   Tap any unclaimed jersey to play the 2s claim ritual:
     800ms pulse → 1.2s welcome overlay → onClaimed fires. */

/* ClaimPage already carries `absolute inset-0 z-[60]` on its own outer
   div — wrapping it in another absolute decorator would just be redundant.
   Letting the global phoneFrameDecorator's .glass-app be the positioning
   anchor directly. */
const meta = {
  title: 'Organisms/ClaimPage',
  component: ClaimPage,
  args: {
    onClose: () => console.log('close'),
    onClaimed: (p) => console.log('claimed', p),
    onAskCoach: (id) => console.log('ask coach', id),
  },
} satisfies Meta<typeof ClaimPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Default — Varsity (Eastside Prep · U14 · 6 players).
   Sarah (#12) and Dylan (#23) are pre-claimed → TAKEN overlay. */
export const Default: Story = {
  args: { teamCode: 'varsity-eastside-2026' },
};

/* Different team — Hawks (Westfield Catholic · U14). */
export const HawksInvite: Story = {
  args: { teamCode: 'hawks-westfield-2026' },
};

/* Bad invite link — defensive "Invite link doesn't match" state. */
export const InvalidTeamCode: Story = {
  args: { teamCode: 'unknown-team-xxx' },
};
