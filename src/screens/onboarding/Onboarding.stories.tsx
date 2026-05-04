import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Onboarding } from './Onboarding';
import { PersonaStep } from './PersonaStep';
import { TeamsStep } from './TeamsStep';
import { PlayersStep } from './PlayersStep';
import { ClaimPage } from './ClaimPage';
import { ClaimedStep } from './ClaimedStep';

const wrap = (children: React.ReactNode) => (
  /* No hardcoded `background: #000` here — the inherited .glass-app from
     preview.tsx supplies var(--canvas-bg) which respects the global theme
     toggle. Hardcoding black would force every story dark even in Light. */
  <div className="absolute inset-0 anim-fade onboard-glass">
    <div className="lg-atmosphere" />
    <div
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{
        background:
          'linear-gradient(180deg, var(--vignette-corner) 0%, transparent 30%, transparent 70%, var(--vignette-corner-soft) 100%)',
      }}
    />
    <div className="absolute inset-0 z-10 flex flex-col">{children}</div>
  </div>
);

const meta = {
  title: 'Pages/Onboarding',
  component: Onboarding,
} satisfies Meta<typeof Onboarding>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullFlow: Story = {};

export const Step1Persona: Story = {
  render: () => wrap(<PersonaStep onPick={(p) => console.log('persona', p)} />),
};

const Step2Interactive = () => {
  const [chosen, setChosen] = useState<string[]>([]);
  return (
    <TeamsStep
      chosen={chosen}
      setChosen={setChosen}
      persona="player"
      onBack={() => console.log('back')}
      onNext={() => console.log('next', chosen)}
    />
  );
};

export const Step2Teams: Story = {
  render: () => wrap(<Step2Interactive />),
};

/* Step 3 standalone interactive — wires the full claim chain so tapping
   the demo URL pill opens ClaimPage, picking a jersey routes to ClaimedStep. */
const Step3Interactive = () => {
  const [chosenPlayers, setChosenPlayers] = useState<Record<string, boolean>>({});
  const [notify, setNotify] = useState<Record<string, boolean>>({});
  const [claimSheet, setClaimSheet] = useState<{ teamCode: string } | null>(null);
  const [claimedSelfId, setClaimedSelfId] = useState<string | null>(null);
  const [claimedTeamId, setClaimedTeamId] = useState<string>('t1');
  const togglePlayer = (id: string) =>
    setChosenPlayers((prev) => ({ ...prev, [id]: !prev[id] }));
  const handleNotifyToggle = (id: string, on: boolean) =>
    setNotify((prev) => ({ ...prev, [id]: on }));

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
      <PlayersStep
        chosenTeams={['t1']}
        chosenPlayers={chosenPlayers}
        notify={notify}
        persona="player"
        togglePlayer={togglePlayer}
        handleNotifyToggle={handleNotifyToggle}
        onBack={() => console.log('back')}
        onFinish={() => console.log('finish', { chosenPlayers, notify })}
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

export const Step3Players: Story = {
  render: () => wrap(<Step3Interactive />),
};
