import { useState } from 'react';
import { OnboardStepper, OnboardDock } from './_chrome';
import { TEAMS_DB } from './_data';

/* Verbatim port: halo-v3.2-glass.html lines 6667-6889 (player branch).
   Two-stage flow:
     1. My team — single-select picker. Empty → glass dashed CTA. Tap →
        search field + result list. Pick one → locked card with × clear.
     2. Division teams — multi-select. Only renders after my team is locked.
        Search field auto-shows when there are >3 teams. */

export interface TeamsStepPlayerProps {
  chosen: string[];
  setChosen: (ids: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

type Team = (typeof TEAMS_DB)[number];

export const TeamsStepPlayer = ({ chosen, setChosen, onBack, onNext }: TeamsStepPlayerProps) => {
  const myTeamId = chosen[0] || null;
  const myTeam = myTeamId ? TEAMS_DB.find((t) => t.id === myTeamId) : null;

  const [pickingMyTeam, setPickingMyTeam] = useState(false);
  const [qMy, setQMy] = useState('');
  const [qDiv, setQDiv] = useState('');

  const setMyTeam = (id: string) => {
    setChosen([id]);
    setPickingMyTeam(false);
    setQMy('');
  };
  const clearMyTeam = () => {
    setChosen([]);
    setQDiv('');
  };
  const toggleDiv = (id: string) => {
    if (chosen.includes(id)) setChosen(chosen.filter((x) => x !== id));
    else setChosen([...chosen, id]);
  };

  const myTeamFiltered = TEAMS_DB.filter(
    (t) => !qMy || (t.name + ' ' + t.org).toLowerCase().includes(qMy.toLowerCase()),
  );
  /* Division-only suggestions (shown when search is empty). */
  const divisionTeams = myTeam
    ? TEAMS_DB.filter((t) => t.division === myTeam.division && t.id !== myTeam.id)
    : [];
  /* Search queries the FULL team DB (minus your locked team) so the user
     can follow ANY team, not just same-division. When the search box is
     empty, fall back to the division suggestions. */
  const allOtherTeams = myTeam ? TEAMS_DB.filter((t) => t.id !== myTeam.id) : [];
  const searchActive = qDiv.trim().length > 0;
  const searchResults = allOtherTeams.filter(
    (t) => (t.name + ' ' + t.org).toLowerCase().includes(qDiv.toLowerCase()),
  );
  const visibleList = searchActive ? searchResults : divisionTeams;
  const followingDivCount = chosen.length - 1;

  return (
    <>
      <OnboardStepper step={2} total={3} onBack={onBack} />
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-[120px] anim-fade">
        <h1 className="sf-display text-[24px] font-bold text-white leading-[1.05] tracking-[-0.025em] mb-2">
          Pick your team
        </h1>
        <p className="sf text-[13px] text-white/65 leading-relaxed mb-6">
          Lock in the team you play for, then add rivals from your division.
        </p>

        {/* === MY TEAM === */}
        <div className="mb-6">
          <div className="sf text-[10px] tracking-[0.18em] uppercase font-bold text-halo-cyan mb-2.5">
            My team
          </div>

          {myTeam ? (
            <div
              className="relative squircle-md p-4 flex items-center gap-3.5 overflow-hidden"
              style={{
                background:
                  'radial-gradient(ellipse 65% 70% at 25% 30%, rgba(0,214,254,0.32) 0%, transparent 60%),' +
                  'radial-gradient(ellipse 70% 70% at 80% 75%, rgba(132,88,255,0.22) 0%, transparent 60%),' +
                  'rgba(28,30,40,0.55)',
                backdropFilter: 'blur(36px) saturate(180%)',
                WebkitBackdropFilter: 'blur(36px) saturate(180%)',
                border: '1px solid rgba(0,214,254,0.55)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), 0 12px 32px -10px rgba(0,214,254,0.40)',
              }}
            >
              <div
                className="w-14 h-14 squircle-md lg-glass-strong flex items-center justify-center shrink-0"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.30), 0 4px 14px -4px rgba(0,214,254,0.30)' }}
              >
                <span
                  className="sf-display text-[16px] font-bold text-white tracking-tight"
                  style={{ textShadow: '0 0 12px rgba(0,214,254,0.30)' }}
                >
                  {myTeam.initial}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="sf-display text-[16px] font-bold leading-tight tracking-[-0.01em] text-white">
                  {myTeam.name}
                </div>
                <div className="sf text-[11.5px] text-white/65 mt-0.5">
                  {myTeam.org} · {myTeam.division}
                </div>
              </div>
              <button
                onClick={clearMyTeam}
                className="w-8 h-8 lg-glass squircle-sm flex items-center justify-center text-white/85"
                aria-label="Change team"
              >
                <svg
                  width={11}
                  height={11}
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  style={{ width: 11, height: 11, display: 'block' }}
                >
                  <path d="M3 3 L11 11 M11 3 L3 11" />
                </svg>
              </button>
            </div>
          ) : !pickingMyTeam ? (
            <button
              onClick={() => setPickingMyTeam(true)}
              className="w-full squircle-md py-5 flex items-center justify-center gap-2 sf text-[13px] font-semibold text-white/85"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1.5px dashed rgba(0,214,254,0.45)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <svg
                width={14}
                height={14}
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                style={{ width: 14, height: 14, display: 'block' }}
              >
                <path d="M7 2 V12 M2 7 H12" />
              </svg>
              Select the team you play for
            </button>
          ) : (
            <div className="anim-fade">
              <SearchField value={qMy} onChange={setQMy} placeholder="Search teams or schools…" autoFocus />
              <div className="space-y-2">
                {myTeamFiltered.length === 0 ? (
                  <div className="lg-glass squircle-md p-5 text-center sf text-[12.5px] text-white/65">
                    No teams match "{qMy}". Try a different search.
                  </div>
                ) : (
                  myTeamFiltered.map((t) => (
                    <TeamCard key={t.id} t={t} active={false} onClick={() => setMyTeam(t.id)} />
                  ))
                )}
              </div>
              <button
                onClick={() => {
                  setPickingMyTeam(false);
                  setQMy('');
                }}
                className="block mx-auto mt-4 sf text-[12px] text-white/55 font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* === DIVISION + ALL-TEAMS SEARCH — only after my team is picked.
              The search bar queries the full team DB; when empty, the
              section falls back to division-team suggestions. === */}
        {myTeam && !pickingMyTeam && (
          <div className="anim-fade">
            <div className="flex items-end justify-between mb-2.5">
              <div>
                <div className="sf text-[10px] tracking-[0.18em] uppercase font-bold text-white/55 leading-none">
                  {searchActive ? 'Search results' : 'Division teams'}
                </div>
                <div className="sf text-[11.5px] text-white/55 mt-1">
                  {searchActive
                    ? `${searchResults.length} ${searchResults.length === 1 ? 'team' : 'teams'}`
                    : `${myTeam.division} · optional`}
                </div>
              </div>
              {followingDivCount > 0 && (
                <div className="lg-glass squircle-sm px-2 py-0.5 sf text-[10px] font-bold text-halo-cyan tabular-nums">
                  {followingDivCount} selected
                </div>
              )}
            </div>

            <SearchField
              value={qDiv}
              onChange={setQDiv}
              placeholder="Search teams or schools…"
            />

            {visibleList.length === 0 ? (
              <div className="lg-glass squircle-md p-5 text-center sf text-[12.5px] text-white/65">
                {searchActive
                  ? `No teams match "${qDiv}". Try a different search.`
                  : 'No other teams in your division yet.'}
              </div>
            ) : (
              <div className="space-y-2">
                {visibleList.map((t) => (
                  <TeamCard
                    key={t.id}
                    t={t}
                    active={chosen.includes(t.id)}
                    onClick={() => toggleDiv(t.id)}
                    multi
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <OnboardDock>
        <button
          onClick={onNext}
          disabled={!myTeam}
          className="lg-btn-primary lg-shine lg-aura squircle-md py-4 w-full sf text-[14.5px] font-semibold"
        >
          {myTeam
            ? followingDivCount > 0
              ? `Continue – ${1 + followingDivCount} teams`
              : 'Continue'
            : 'Pick your team to continue'}
        </button>
      </OnboardDock>
    </>
  );
};

/* ===== Sub-components — kept inside this file (player-only scope) ===== */

const TeamCard = ({
  t,
  active,
  onClick,
  multi,
}: {
  t: Team;
  active: boolean;
  onClick: () => void;
  multi?: boolean;
}) => (
  <button
    onClick={onClick}
    className="w-full text-start squircle-md p-3.5 flex items-center gap-3.5 lg-aura relative overflow-hidden"
    style={
      active
        ? {
            background:
              'radial-gradient(ellipse 60% 70% at 25% 30%, rgba(0,214,254,0.30) 0%, transparent 60%), rgba(28,30,40,0.55)',
            backdropFilter: 'blur(36px) saturate(180%)',
            WebkitBackdropFilter: 'blur(36px) saturate(180%)',
            border: '1px solid rgba(0,214,254,0.55)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 8px 24px -10px rgba(0,214,254,0.35)',
          }
        : {
            background: 'rgba(28,30,40,0.42)',
            backdropFilter: 'blur(36px) saturate(180%)',
            WebkitBackdropFilter: 'blur(36px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 8px 24px -10px rgba(0,0,0,0.55)',
          }
    }
  >
    <div className="w-11 h-11 squircle-sm lg-glass-strong flex items-center justify-center shrink-0">
      <span className="sf-display text-[13px] font-bold text-white tracking-tight">{t.initial}</span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="sf-display text-[14.5px] font-bold leading-tight tracking-[-0.01em] text-white truncate">
        {t.name}
      </div>
      <div className="sf text-[11px] text-white/60 truncate mt-0.5">
        {t.org} · {t.division}
      </div>
    </div>
    {multi ? (
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
        style={
          active
            ? { background: '#00D6FE', boxShadow: '0 0 10px rgba(0,214,254,0.6)' }
            : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.20)' }
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
            style={{ width: 12, height: 12, display: 'block' }}
          >
            <path d="M3 7 L6 10 L11 4" />
          </svg>
        )}
      </div>
    ) : (
      <svg
        width={14}
        height={14}
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={active ? 'text-halo-cyan' : 'text-white/40'}
        style={{ width: 14, height: 14, display: 'block' }}
      >
        <path d="M5.5 2.5 L10 7 L5.5 11.5" />
      </svg>
    )}
  </button>
);

const SearchField = ({
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}) => (
  <div className="lg-glass-card squircle-md px-3.5 py-2.5 flex items-center gap-2.5 mb-3">
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      stroke="rgba(255,255,255,0.45)"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16, display: 'block' }}
    >
      <circle cx={7} cy={7} r={5} />
      <path d="M11 11 L14 14" />
    </svg>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className="auth-input sf text-[14px]"
    />
  </div>
);
