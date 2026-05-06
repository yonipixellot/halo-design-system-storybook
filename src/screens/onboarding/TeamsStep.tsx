import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OnboardStepper, OnboardDock } from './_chrome';
import { TeamsStepPlayer } from './TeamsStepPlayer';
import { LeagueAccordion } from './LeagueAccordion';
import { TEAMS_DB, type Persona } from './_data';

/* Verbatim port: halo-v3.2-glass.html lines 6655-6960.
   Player branch lives in TeamsStepPlayer.tsx — short-circuited at the top
   of this function so the parent/coach JSX below stays byte-identical.
   May 2026: parent/fan flow now uses <LeagueAccordion /> for collapsible
   league grouping. Coach flow stays single-team since they coach one
   team — no league grouping needed. */

export const TeamsStep = ({
  chosen,
  setChosen,
  persona,
  onBack,
  onNext,
}: {
  chosen: string[];
  setChosen: (ids: string[]) => void;
  persona: Persona;
  onBack: () => void;
  onNext: () => void;
}) => {
  if (persona === 'player') {
    return <TeamsStepPlayer chosen={chosen} setChosen={setChosen} onBack={onBack} onNext={onNext} />;
  }
  const isCoach = persona === 'coach';
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const toggle = (id: string) => {
    if (chosen.includes(id)) setChosen(chosen.filter((x) => x !== id));
    else setChosen([...chosen, id]);
  };

  /* Coach flow stays flat — they pick one team to coach. No league grouping. */
  const coachTeams = isCoach ? TEAMS_DB.filter((t) => t.id === 't1') : [];
  const coachFiltered = coachTeams.filter(
    (t) => !q || (t.name + ' ' + t.org).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <OnboardStepper step={2} total={3} onBack={onBack} />
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-[120px] anim-fade">
        <h1 className="sf-display text-[24px] font-bold text-white leading-[1.05] tracking-[-0.025em] mb-2">
          {isCoach ? 'Pick the team you coach' : t('leagues.title')}
        </h1>
        <p className="sf text-[13px] text-white/65 leading-relaxed mb-6">
          {isCoach
            ? "We'll set up your roster and review queue."
            : t('leagues.subtitle')}
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
            placeholder={isCoach ? 'Search teams or schools…' : t('leagues.searchPlaceholder')}
            className="auth-input sf text-[14px]"
          />
        </div>

        {isCoach ? (
          /* Coach: flat list (single team). */
          <div className="space-y-2">
            {coachFiltered.map((tm) => {
              const active = chosen.includes(tm.id);
              return (
                <button
                  key={tm.id}
                  onClick={() => toggle(tm.id)}
                  className="w-full text-start squircle-md p-3.5 flex items-center gap-3.5 lg-aura"
                  style={
                    active
                      ? {
                          background: 'rgba(0,214,254,0.10)',
                          backdropFilter: 'blur(36px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(36px) saturate(180%)',
                          border: '1px solid rgba(0,214,254,0.55)',
                        }
                      : {
                          background: 'var(--glass-card-bg)',
                          backdropFilter: 'blur(36px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(36px) saturate(180%)',
                          border: '1px solid var(--glass-card-border)',
                        }
                  }
                >
                  <div className="w-11 h-11 squircle-sm lg-glass-strong flex items-center justify-center shrink-0">
                    <span className="sf-display text-[13px] font-bold text-white">{tm.initial}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="sf-display text-[14.5px] font-bold text-white truncate">
                      {tm.name}
                    </div>
                    <div className="sf text-[11px] text-white/60 truncate mt-0.5">
                      {tm.org} · {tm.division}
                    </div>
                  </div>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={
                      active
                        ? { background: '#00D6FE' }
                        : {
                            background: 'var(--hatch-grain)',
                            border: '1px solid var(--hairline-strong)',
                          }
                    }
                  >
                    {active && (
                      <svg
                        width={12}
                        height={12}
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="#000"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 7 L6 10 L11 4" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Parent / fan: league-grouped accordion. */
          <LeagueAccordion chosen={chosen} toggle={toggle} setChosen={setChosen} query={q} />
        )}
      </div>
      <OnboardDock>
        <button
          onClick={onNext}
          disabled={chosen.length === 0}
          className="lg-btn-primary lg-shine lg-aura squircle-md py-4 w-full sf text-[14.5px] font-semibold"
        >
          {chosen.length > 0
            ? `Continue – ${chosen.length} ${chosen.length === 1 ? 'team' : 'teams'}`
            : 'Pick a team to continue'}
        </button>
      </OnboardDock>
    </>
  );
};
