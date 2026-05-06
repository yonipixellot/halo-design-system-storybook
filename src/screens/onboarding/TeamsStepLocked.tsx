import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OnboardStepper, OnboardDock } from './_chrome';
import { LeagueAccordion } from './LeagueAccordion';
import { TEAMS_DB } from './_data';
import { useLocalized } from '@/screens/home/_data';
import { TEAM_LOGOS } from '@/screens/home/_avatars';
import { WizardRail } from '@/layouts/WizardRail';

/* TeamsStepLocked — step 2 of player onboarding (coach-invite flow).
   The team the player was invited to is locked in (auto-followed,
   non-removable). They can stack additional teams via LeagueAccordion. */

export interface TeamsStepLockedProps {
  /** Team the player was invited to via the coach link. */
  lockedTeamId: string;
  /** Coach name from the invite — shown as a caption on the locked card. */
  coachName: string;
  /** All currently-followed team ids (including the locked one — caller
      must pre-seed it). */
  chosen: string[];
  setChosen: (ids: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export const TeamsStepLocked = ({
  lockedTeamId,
  coachName,
  chosen,
  setChosen,
  onBack,
  onNext,
}: TeamsStepLockedProps) => {
  const { t } = useTranslation();
  const localized = useLocalized();
  const [q, setQ] = useState('');

  const lockedTeam = TEAMS_DB.find((tm) => tm.id === lockedTeamId);
  const lockedLogo =
    lockedTeam && (TEAM_LOGOS as Record<string, string>)[lockedTeam.initial];

  const toggle = (id: string) => {
    /* Locked team can't be unfollowed — it's permanently in `chosen`. */
    if (id === lockedTeamId) return;
    if (chosen.includes(id)) setChosen(chosen.filter((x) => x !== id));
    else setChosen([...chosen, id]);
  };

  const setChosenSafe = (next: string[]) => {
    /* Whenever a bulk-set runs (e.g. Follow All on a league), make sure
       the locked team stays in. Idempotent — if it's already there,
       no-op. */
    if (!next.includes(lockedTeamId)) {
      setChosen([lockedTeamId, ...next]);
    } else {
      setChosen(next);
    }
  };

  /* Continue button — same JSX is used by both the phone OnboardDock and
     the desktop WizardRail's pinned-CTA slot. */
  const continueButton = (
    <button
      onClick={onNext}
      className="lg-btn-primary lg-shine lg-aura squircle-md py-4 w-full sf text-[14.5px] font-semibold"
    >
      {t('teamsLocked.continue')}
    </button>
  );

  return (
    <>
      {/* Phone-only stepper at top */}
      <div className="lg:hidden">
        <OnboardStepper step={1} total={3} onBack={onBack} />
      </div>

      <WizardRail
        step={1}
        total={2}
        steps={[
          { key: 'teams', label: t('teamsLocked.title'), status: 'current' },
          { key: 'roster', label: t('claimFollow.title'), status: 'todo' },
        ]}
        title={t('teamsLocked.title')}
        description={t('teamsLocked.subtitle')}
        cta={continueButton}
      >
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-[120px] lg:flex-none lg:min-h-0 lg:overflow-visible lg:p-0 anim-fade">
        {/* Phone-only intro — desktop has these in the rail */}
        <div className="lg:hidden">
          <h1 className="sf-display text-[24px] font-bold text-white leading-[1.05] tracking-[-0.025em] mb-2">
            {t('teamsLocked.title')}
          </h1>
          <p className="sf text-[13px] text-white/65 leading-relaxed mb-5">
            {t('teamsLocked.subtitle')}
          </p>
        </div>

        {/* === Locked-team hero card === */}
        {lockedTeam && (
          <div
            className="squircle-md p-3.5 flex items-center gap-3.5 mb-6 lg-aura"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 25% 30%, rgba(0,214,254,0.18) 0%, transparent 60%),' +
                'var(--glass-card-bg)',
              backdropFilter: 'blur(36px) saturate(180%)',
              WebkitBackdropFilter: 'blur(36px) saturate(180%)',
              border: '1px solid rgba(0,214,254,0.35)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 8px 30px -10px rgba(0,214,254,0.20)',
            }}
          >
            {/* Team logo / initial */}
            {lockedLogo ? (
              <img
                src={lockedLogo}
                alt=""
                className="rounded-full shrink-0"
                style={{ width: 52, height: 52, objectFit: 'cover' }}
              />
            ) : (
              <div
                className="w-[52px] h-[52px] squircle-sm lg-glass-strong flex items-center justify-center shrink-0"
              >
                <span className="sf-display text-[14px] font-bold text-white">
                  {lockedTeam.initial}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div
                className="sf text-[9.5px] tracking-[0.18em] uppercase font-bold mb-0.5"
                style={{ color: 'var(--brand-cyan-text)' }}
              >
                {t('teamsLocked.yourTeamCaption')}
              </div>
              <div className="sf-display text-[15.5px] font-bold text-white leading-tight truncate tracking-[-0.01em]">
                {localized(lockedTeam, 'name')}
              </div>
              <div className="sf text-[11.5px] truncate mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                {localized(lockedTeam, 'org')} · {t('invite.addedBy', { coach: coachName })}
              </div>
            </div>

            {/* Lock pill */}
            <div
              className="squircle-sm flex items-center gap-1.5 px-2.5 py-1 shrink-0"
              style={{
                background: 'var(--brand-cyan-soft)',
                border: '1px solid var(--brand-cyan-border)',
                color: 'var(--brand-cyan-text)',
              }}
              aria-label={t('teamsLocked.lockedPill')}
            >
              <svg
                width={12}
                height={12}
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: 12, height: 12, display: 'block' }}
              >
                <rect x="3" y="6" width="8" height="6" rx="1" />
                <path d="M5 6 V4 a2 2 0 0 1 4 0 v2" />
              </svg>
            </div>
          </div>
        )}

        {/* === Section heading + search === */}
        <h2
          className="sf text-[11px] tracking-[0.18em] uppercase font-bold mb-3"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {t('teamsLocked.moreTeams')}
        </h2>
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
            placeholder={t('leagues.searchPlaceholder')}
            className="auth-input sf text-[14px]"
          />
        </div>

        {/* === LeagueAccordion === */}
        <LeagueAccordion chosen={chosen} toggle={toggle} setChosen={setChosenSafe} query={q} />
      </div>
      </WizardRail>

      {/* Phone-only dock — desktop has the CTA inside the WizardRail */}
      <div className="lg:hidden">
        <OnboardDock>{continueButton}</OnboardDock>
      </div>
    </>
  );
};
