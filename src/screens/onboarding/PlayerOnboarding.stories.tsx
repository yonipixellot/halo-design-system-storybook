import type { Meta, StoryObj } from '@storybook/react';
import { PlayerOnboarding } from './PlayerOnboarding';
import { PlayerInviteEntry } from './PlayerInviteEntry';

/* PlayerOnboarding — coach-invite player flow.
   Coach side parked (May 2026): the invite context is hardcoded into
   the orchestrator. Storybook starts at PlayerInviteEntry for every
   variant; downstream steps (signup-player, teams-locked,
   claim-and-follow, notif-upsell) are scaffolded with placeholder
   cards in T1 and replaced by real screens in T2-T4.

   No avatar URLs are passed: the player-side flow is photo-free —
   coach hero renders as an initials letterform. */

const wrap = (children: React.ReactNode) => (
  /* Desktop: relative + min-h-screen + 1200 cap so the standalone story
     doesn't stretch edge-to-edge — mirrors the orchestrator's layout. */
  <div className="absolute inset-0 anim-fade onboard-glass lg:relative lg:inset-auto lg:min-h-screen">
    <div className="lg-atmosphere" />
    <div
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{
        background:
          'linear-gradient(180deg, var(--vignette-corner) 0%, transparent 30%, transparent 70%, var(--vignette-corner-soft) 100%)',
      }}
    />
    <div className="absolute inset-0 z-10 flex flex-col lg:relative lg:inset-auto lg:min-h-screen lg:max-w-[1200px] lg:mx-auto">
      {children}
    </div>
  </div>
);

const meta = {
  title: 'Pages/PlayerOnboarding',
  component: PlayerOnboarding,
} satisfies Meta<typeof PlayerOnboarding>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Full chain — start at the invite entry, step through to Home. */
export const FullFlow: Story = {
  name: 'Full flow · Coach Sarah → Varsity',
};

/* Variants on the invite context — different coach, different team. */
export const FromCoachMike: Story = {
  name: 'Variant · Coach Mike → Tigers',
  args: {
    inviteContext: {
      teamId: 't3',
      coachName: 'Coach Mike',
    },
  },
};

export const FromCoachWomensVarsity: Story = {
  name: "Variant · Coach Maya → Lady Eagles",
  args: {
    inviteContext: {
      teamId: 't15',
      coachName: 'Coach Maya',
    },
  },
};

/* Standalone PlayerInviteEntry — for design review without orchestrator. */
const InviteEntryStandalone = ({
  teamId = 't1',
  coachName = 'Coach Sarah',
}: {
  teamId?: string;
  coachName?: string;
}) =>
  wrap(
    <PlayerInviteEntry
      teamId={teamId}
      coachName={coachName}
      onSignUp={() => console.log('sign up')}
      onSignIn={() => console.log('sign in')}
    />,
  );

export const InviteEntryDefault: Story = {
  name: 'Just the invite-entry screen · default',
  render: () => <InviteEntryStandalone />,
};

export const InviteEntryNoTeamLogo: Story = {
  name: 'Just the invite-entry screen · team without logo (initial fallback)',
  render: () => <InviteEntryStandalone teamId="t9" coachName="Coach Riley" />,
};

export const InviteEntryGirlsTeam: Story = {
  name: "Just the invite-entry screen · Coach Maya → Lady Eagles",
  render: () => (
    <InviteEntryStandalone teamId="t15" coachName="Coach Maya" />
  ),
};
