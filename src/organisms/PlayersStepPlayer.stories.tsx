import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PlayersStepPlayer } from '@/screens/onboarding/PlayersStepPlayer';
import { ClaimPage } from '@/screens/onboarding/ClaimPage';
import { ClaimedStep } from '@/screens/onboarding/ClaimedStep';

/* Step 3 of 3 — player branch only. Two stages:
     Stage 1 — ClaimAthleteExplainer (educational + demo URL pill).
               CTA: "Continue as Fan".
     Stage 2 — That's me / Request sent + Teammates + Top rivals.
               CTA: "Finish – following N".

   Stories use real useState so toggling teammates/rivals updates count.
   The Stage 1 demo URL pill opens ClaimPage as an overlay; picking a
   jersey routes to ClaimedStep so the full claim chain demos here too. */

const InteractivePlayers = ({
  initial = {} as Record<string, boolean>,
}: {
  initial?: Record<string, boolean>;
}) => {
  const [chosenPlayers, setChosenPlayers] = useState(initial);
  const [claimSheet, setClaimSheet] = useState<{ teamCode: string } | null>(null);
  const [claimedSelfId, setClaimedSelfId] = useState<string | null>(null);
  const [claimedTeamId, setClaimedTeamId] = useState<string>('t1');
  const togglePlayer = (id: string) =>
    setChosenPlayers((prev) => ({ ...prev, [id]: !prev[id] }));

  if (claimedSelfId) {
    return (
      <ClaimedStep
        claimedSelfId={claimedSelfId}
        teamId={claimedTeamId}
        onContinue={() => console.log('continue to halo')}
      />
    );
  }

  return (
    <>
      <PlayersStepPlayer
        chosenPlayers={chosenPlayers}
        togglePlayer={togglePlayer}
        onBack={() => console.log('back')}
        onFinish={() => console.log('finish', chosenPlayers)}
        onSkip={() => console.log('skip')}
        onClaim={(code) => setClaimSheet({ teamCode: code })}
      />
      {claimSheet && (
        <ClaimPage
          teamCode={claimSheet.teamCode}
          onClose={() => setClaimSheet(null)}
          onClaimed={({ rosterId, teamId }) => {
            setClaimedSelfId(rosterId);
            setClaimedTeamId(teamId);
            setClaimSheet(null);
          }}
          onAskCoach={(teamId) => console.log('ask coach', teamId)}
        />
      )}
    </>
  );
};

const meta = {
  title: 'Organisms/PlayersStepPlayer',
  component: PlayersStepPlayer,
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
} satisfies Meta<typeof PlayersStepPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Stage 1 — no self-claim yet → ClaimAthleteExplainer card. */
export const Stage1Explainer: Story = {
  name: 'Stage 1 · Claim explainer',
  render: () => <InteractivePlayers initial={{}} />,
};

/* Stage 2 — claimed jersey #7 (Tal). Teammates auto-seeded. */
export const Stage2SelfClaimed: Story = {
  name: 'Stage 2 · Self-claimed jersey #7',
  render: () => (
    <InteractivePlayers
      initial={{
        self_r1: true,
        __seeded_teammates: true,
        mate_r2: true,
        mate_r3: true,
        mate_r4: true,
        mate_r5: true,
        mate_r6: true,
      }}
    />
  ),
};

/* Stage 2 — coach-notify pending (no self-claim). */
export const Stage2RequestSent: Story = {
  name: 'Stage 2 · Request sent to coach',
  render: () => (
    <InteractivePlayers
      initial={{
        __notified_coach: true,
        __seeded_teammates: true,
        mate_r1: true,
        mate_r2: true,
        mate_r3: true,
        mate_r4: true,
        mate_r5: true,
        mate_r6: true,
      }}
    />
  ),
};

/* Stage 2 + 2 rivals followed — full follow state. */
export const Stage2WithRivals: Story = {
  name: 'Stage 2 · 2 rivals followed',
  render: () => (
    <InteractivePlayers
      initial={{
        self_r1: true,
        __seeded_teammates: true,
        mate_r2: true,
        mate_r3: true,
        mate_r4: true,
        mate_r5: true,
        mate_r6: true,
        rival_rv1: true,
        rival_rv3: true,
      }}
    />
  ),
};
