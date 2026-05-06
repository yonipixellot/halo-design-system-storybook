import { useState } from 'react';
import { PlayerInviteEntry } from './PlayerInviteEntry';
import { TeamsStepLocked } from './TeamsStepLocked';
import { ClaimAndFollow } from './ClaimAndFollow';
import { NotifUpsell } from './NotifUpsell';
import { SignUpScreen } from '@/screens/auth/SignUp';
import { SignInScreen } from '@/screens/auth/SignIn';
import { Home } from '@/screens/home/Home';
import type { FollowState } from '@/screens/home/_data';

/* PlayerOnboarding — orchestrator for the COACH-INVITE PLAYER flow.
   Separate from the existing Onboarding.tsx (parent / fan / coach
   personas) so the two paths can evolve independently.

   Coach side is parked (May 2026) — the invite context is hardcoded
   in initial state instead of being parsed from a URL. When the coach
   side ships, replace the hardcoded `inviteContext` with a router that
   reads the deep-link params.

   Step keys (will fill in turns 2-4):
     - invite-entry      — branching welcome (Sign up / Sign in)        [T1]
     - signup            — player signup (uses generic SignUp until T2) [T1 stub → T2]
     - signin            — existing SignIn                               [T1 ✓]
     - teams-locked      — locked-team chip + LeagueAccordion           [T3]
     - claim-and-follow  — combined roster claim + teammate follow      [T3]
     - notif-upsell      — push permission upsell                       [T4]
     - done              — Home                                         [T1 ✓] */

type Step =
  | 'invite-entry'
  | 'signup'
  | 'signin'
  | 'teams-locked'
  | 'claim-and-follow'
  | 'notif-upsell'
  | 'done';

export interface InviteContext {
  teamId: string;
  coachName: string;
  /** Random invite id — present in production, unused for now. */
  inviteId?: string;
}

export interface PlayerOnboardingProps {
  /** Hardcoded for the demo — production routes pull this from the
      invite link. Defaults match the most-used demo team. */
  inviteContext?: InviteContext;
}

const DEFAULT_INVITE: InviteContext = {
  teamId: 't1',
  coachName: 'Coach Sarah',
  inviteId: 'demo-invite-001',
};

export const PlayerOnboarding = ({
  inviteContext = DEFAULT_INVITE,
}: PlayerOnboardingProps) => {
  const [step, setStep] = useState<Step>('invite-entry');

  /* === Stub state for downstream steps ===
     Real fields will be wired up in turns 2-4. Keeping them here so
     the orchestrator's API stays stable as we fill steps in. */
  const [chosenTeams, setChosenTeams] = useState<string[]>([inviteContext.teamId]);
  const [chosenPlayers, setChosenPlayers] = useState<Record<string, boolean>>({});
  const [claimedSelfId, setClaimedSelfId] = useState<string | null>(null);

  /* Build the FollowState that Home consumes when onboarding completes. */
  const followState: FollowState = {
    persona: 'player',
    followedTeams: chosenTeams,
    followedPlayers: Object.keys(chosenPlayers).filter((k) => chosenPlayers[k]),
  };

  if (step === 'done') {
    return <Home s={followState} />;
  }

  return (
    <div className="absolute inset-0 anim-fade onboard-glass">
      <div className="lg-atmosphere" />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, var(--vignette-corner) 0%, transparent 30%, transparent 70%, var(--vignette-corner-soft) 100%)',
        }}
      />
      <div className="absolute inset-0 z-10 flex flex-col">
        {step === 'invite-entry' && (
          <PlayerInviteEntry
            teamId={inviteContext.teamId}
            coachName={inviteContext.coachName}
            onSignUp={() => setStep('signup')}
            onSignIn={() => setStep('signin')}
          />
        )}

        {step === 'signup' && (
          <SignUpScreen
            dispatch={(action) => {
              if (action.type === 'SET_AUTH_STEP' && action.step === 'signin') {
                setStep('signin');
              } else if (action.type === 'SIGN_IN') {
                setStep('teams-locked');
              }
            }}
          />
        )}

        {step === 'signin' && (
          <SignInScreen
            dispatch={(action) => {
              if (action.type === 'SET_AUTH_STEP' && action.step === 'signup') {
                setStep('signup');
              } else if (action.type === 'SIGN_IN') {
                setStep('teams-locked');
              }
            }}
          />
        )}

        {step === 'teams-locked' && (
          <TeamsStepLocked
            lockedTeamId={inviteContext.teamId}
            coachName={inviteContext.coachName}
            chosen={chosenTeams}
            setChosen={setChosenTeams}
            onBack={() => setStep('invite-entry')}
            onNext={() => setStep('claim-and-follow')}
          />
        )}

        {step === 'claim-and-follow' && (
          <ClaimAndFollow
            teamId={inviteContext.teamId}
            coachName={inviteContext.coachName}
            claimedSelfId={claimedSelfId}
            setClaimedSelfId={setClaimedSelfId}
            chosenPlayers={chosenPlayers}
            setChosenPlayers={setChosenPlayers}
            onBack={() => setStep('teams-locked')}
            onNext={() => setStep('notif-upsell')}
          />
        )}

        {step === 'notif-upsell' && (
          <NotifUpsell
            onAllow={() => setStep('done')}
            onSkip={() => setStep('done')}
          />
        )}
      </div>
    </div>
  );
};
