import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OnboardStepper, OnboardDock } from './_chrome';
import { PlayersStepPlayer } from './PlayersStepPlayer';
import { TeamRosterAccordion } from './TeamRosterAccordion';
import { type Persona } from './_data';

/* Verbatim port: halo-v3.2-glass.html line 6962 — parent/fan/coach branch.
   Player branch lives in PlayersStepPlayer.tsx — short-circuited at the
   top of this function so the parent/coach JSX below stays intact.
   May 2026: parent/fan flow now uses <TeamRosterAccordion /> grouped by
   the teams the user followed in step 2. Sort is jersey-number ascending
   inside each team. Coach branch unchanged. */

export const PlayersStep = ({
  chosenTeams,
  chosenPlayers,
  setChosenPlayers,
  notify: _notify,
  persona,
  togglePlayer,
  handleNotifyToggle: _handleNotifyToggle,
  onBack,
  onFinish,
  onSkip,
  onClaim,
}: {
  chosenTeams: string[];
  chosenPlayers: Record<string, boolean>;
  /** Optional bulk-set escape hatch for "Follow all" / "Unfollow all" on
      a team header. Provide it when wiring TeamRosterAccordion;
      otherwise we fall back to togglePlayer in a loop. */
  setChosenPlayers?: (next: Record<string, boolean>) => void;
  notify: Record<string, boolean>;
  persona: Persona;
  togglePlayer: (id: string) => void;
  handleNotifyToggle: (id: string, on: boolean) => void;
  onBack: () => void;
  onFinish: () => void;
  onSkip?: () => void;
  onClaim?: (teamCode: string) => void;
}) => {
  const { t } = useTranslation();
  if (persona === 'player') {
    return (
      <PlayersStepPlayer
        chosenPlayers={chosenPlayers}
        togglePlayer={togglePlayer}
        onBack={onBack}
        onFinish={onFinish}
        onSkip={onSkip}
        onClaim={onClaim}
      />
    );
  }
  const totalSelected = Object.keys(chosenPlayers).filter((k) => chosenPlayers[k]).length;
  const [q, setQ] = useState('');

  /* Fallback when caller doesn't pass setChosenPlayers — apply one
     toggle at a time. Less efficient but keeps the existing call sites
     working without breaking changes. */
  const setMap =
    setChosenPlayers ??
    ((next: Record<string, boolean>) => {
      Object.entries(next).forEach(([id, want]) => {
        const have = !!chosenPlayers[id];
        if (have !== want) togglePlayer(id);
      });
    });

  return (
    <>
      <OnboardStepper step={3} total={3} onBack={onBack} />
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-[120px] anim-fade">
        <h1 className="sf-display text-[24px] font-bold text-white leading-[1.05] tracking-[-0.025em] mb-2">
          {t('roster.title')}
        </h1>
        <p className="sf text-[13px] text-white/65 leading-relaxed mb-6">
          {t('roster.subtitle')}
        </p>
        <div className="lg-glass-card squircle-md px-3.5 py-2.5 flex items-center gap-2.5 mb-4">
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: 16, height: 16, display: 'block' }}
          >
            <circle cx={7} cy={7} r={5} />
            <path d="M11 11 L14 14" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('roster.searchPlaceholder')}
            className="auth-input sf text-[14px]"
          />
        </div>

        <TeamRosterAccordion
          teamIds={chosenTeams}
          chosenPlayers={chosenPlayers}
          togglePlayer={togglePlayer}
          setChosenPlayers={setMap}
          query={q}
        />
      </div>
      <OnboardDock>
        <button
          onClick={onFinish}
          className="lg-btn-primary lg-shine lg-aura squircle-md py-4 w-full sf text-[14.5px] font-semibold"
        >
          {totalSelected > 0 ? `Finish – following ${totalSelected}` : 'Finish'}
        </button>
      </OnboardDock>
    </>
  );
};
