import { useState } from 'react';
import { PersonaStep } from './PersonaStep';
import { TeamsStep } from './TeamsStep';
import { PlayersStep } from './PlayersStep';
import { ClaimPage } from './ClaimPage';
import { ClaimedStep } from './ClaimedStep';
import { Home } from '@/screens/home/Home';
import type { FollowState } from '@/screens/home/_data';
import type { Persona } from './_data';

/* Verbatim port: halo-v3.2-glass.html line 6303.
   Self-contained orchestrator with internal step state — replaces the
   reducer-driven s.onboardStep pattern with useState so the screen renders
   in isolation inside Storybook.

   Player flow path:  persona → teams → players → [tap demo URL] →
                      ClaimPage overlay → [tap jersey, ritual finishes] →
                      claimed → [Continue to Halo] → done. */

type Step = 'persona' | 'teams' | 'players' | 'claimed' | 'done';

export const Onboarding = () => {
  const [step, setStep] = useState<Step>('persona');
  const [persona, setPersona] = useState<Persona>('player');
  const [chosenTeams, setChosenTeams] = useState<string[]>([]);
  const [chosenPlayers, setChosenPlayers] = useState<Record<string, boolean>>({});
  const [notify, setNotify] = useState<Record<string, boolean>>({});

  /* claimSheet overlay state — opens when player taps the demo URL pill in
     PlayersStepPlayer's ClaimAthleteExplainer. Holds the team code so
     ClaimPage can resolve the team. */
  const [claimSheet, setClaimSheet] = useState<{ teamCode: string } | null>(null);
  /* claimedSelfId — the roster id the user picked in ClaimPage, passed to
     ClaimedStep so it can render the "Welcome to Varsity, Tal" hero card. */
  const [claimedSelfId, setClaimedSelfId] = useState<string | null>(null);

  const togglePlayer = (id: string) => {
    setChosenPlayers((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (!next[id]) setNotify((p) => ({ ...p, [id]: false }));
      return next;
    });
  };

  const handleNotifyToggle = (id: string, on: boolean) => {
    setNotify((prev) => ({ ...prev, [id]: on }));
  };

  /* Build the FollowState that Home consumes when onboarding finishes.
     The Persona type in Home doesn't include 'fan' — fan→parent in the
     persona picker, so by the time we get here persona is already one of
     the three Home knows about. */
  const followState: FollowState = {
    persona: persona === 'fan' ? 'parent' : persona,
    followedTeams: chosenTeams,
    followedPlayers: Object.keys(chosenPlayers).filter((k) => chosenPlayers[k]),
  };

  /* Once the user finishes onboarding, swap the whole orchestrator out
     for Home. No transition wrapper — Home owns its own atmosphere /
     vignette layers, so re-rendering inside the same .glass-app frame
     gives a clean "you're in" handoff. */
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
        {step === 'persona' && (
          <PersonaStep
            onPick={(p) => {
              setPersona(p === 'fan' ? 'parent' : p);
              setStep('teams');
            }}
          />
        )}
        {step === 'teams' && (
          <TeamsStep
            chosen={chosenTeams}
            setChosen={setChosenTeams}
            persona={persona}
            onBack={() => setStep('persona')}
            onNext={() => {
              if (persona === 'coach') {
                console.log('onboarding complete (coach)', { persona, chosenTeams });
              } else {
                setStep('players');
              }
            }}
          />
        )}
        {step === 'players' && (
          <PlayersStep
            chosenTeams={chosenTeams}
            chosenPlayers={chosenPlayers}
            setChosenPlayers={setChosenPlayers}
            notify={notify}
            persona={persona}
            togglePlayer={togglePlayer}
            handleNotifyToggle={handleNotifyToggle}
            onBack={() => setStep('teams')}
            onFinish={() => setStep('done')}
            onSkip={() => setStep('done')}
            onClaim={(teamCode) => setClaimSheet({ teamCode })}
          />
        )}
        {step === 'claimed' && claimedSelfId && (
          <ClaimedStep
            claimedSelfId={claimedSelfId}
            teamId={chosenTeams[0] || 't1'}
            onContinue={() => setStep('done')}
          />
        )}
      </div>

      {/* ClaimPage overlay — sits on top of the active step. Opens when
          player taps the demo URL in ClaimAthleteExplainer. Closes either
          via × button (cancels) or after a successful claim ritual, which
          routes the user to the 'claimed' step. */}
      {claimSheet && (
        <ClaimPage
          teamCode={claimSheet.teamCode}
          onClose={() => setClaimSheet(null)}
          onClaimed={({ rosterId, teamId }) => {
            setClaimedSelfId(rosterId);
            /* Ensure the claimed team is in chosenTeams so ClaimedStep can
               resolve it. The picker UI may have left chosenTeams empty if
               the user came directly via deep link. */
            setChosenTeams((prev) => (prev.length > 0 ? prev : [teamId]));
            setClaimSheet(null);
            setStep('claimed');
          }}
          onAskCoach={(teamId) =>
            console.log('coach notify request sent for team', teamId)
          }
        />
      )}
    </div>
  );
};
