import { OnboardStepper, OnboardDock } from './_chrome';
import { ROSTER, TEAMS_DB } from './_data';

/* Verbatim port: halo-v3.2-glass.html lines 6497-6582.
   Post-claim success step in the onboarding flow. Renders after a player
   has tapped their jersey in ClaimPage. Hero card shows the claimed
   jersey + name + team, followed by 3 reassurance rows and a final CTA. */

export interface ClaimedStepProps {
  /** Roster ID the user just claimed (e.g. 'r1'). */
  claimedSelfId: string;
  /** Team ID they're on (usually the first followedTeams entry). */
  teamId: string;
  /** "Continue to Halo" CTA. */
  onContinue: () => void;
}

export const ClaimedStep = ({ claimedSelfId, teamId, onContinue }: ClaimedStepProps) => {
  const player = ROSTER.find((p) => p.id === claimedSelfId) || null;
  const team = TEAMS_DB.find((t) => t.id === teamId) || null;
  const teammateCount = ROSTER.filter((p) => p.teamId === teamId && p.id !== claimedSelfId).length;
  const firstName = player ? player.name.split(' ')[0] : 'you';

  const rows = [
    { label: 'Your highlights auto-tagged', body: 'Every game you appear in feeds your profile.' },
    { label: 'Teammates pre-followed', body: `See drops from ${teammateCount} teammates in your feed.` },
    { label: 'Coach can adjust', body: 'If something looks wrong, your coach can fix it.' },
  ];

  return (
    <>
      <OnboardStepper step={3} total={3} label="You're in" />
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-[120px] anim-fade flex flex-col">
        <div className="shrink-0 mb-6">
          <div
            className="sf text-[10px] tracking-[0.18em] uppercase font-bold mb-2"
            style={{ color: 'var(--brand-cyan-text)' }}
          >
            Profile claimed
          </div>
          <h1 className="sf-display text-[26px] font-bold text-white leading-[1.05] tracking-[-0.025em] mb-2">
            Welcome to {team ? team.name : 'your team'}, {firstName}
          </h1>
          <p className="sf text-[13px] text-white/65 leading-relaxed">
            Your highlights will auto-tag whenever you play. We've also pre-followed your{' '}
            {teammateCount} teammates so their drops show up in your feed.
          </p>
        </div>

        {/* Hero card — jersey + name, mirrors PlayersStepPlayer's "That's me" treatment */}
        <div className="shrink-0">
          <div
            className="relative squircle-md p-5 flex items-center gap-4 overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse 65% 70% at 25% 30%, rgba(0,214,254,0.32) 0%, transparent 60%),' +
                'radial-gradient(ellipse 70% 70% at 80% 75%, rgba(132,88,255,0.22) 0%, transparent 60%),' +
                'var(--glass-card-bg)',
              backdropFilter: 'blur(36px) saturate(180%)',
              WebkitBackdropFilter: 'blur(36px) saturate(180%)',
              border: '1px solid rgba(0,214,254,0.55)',
              boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), 0 12px 32px -10px rgba(0,214,254,0.40)',
            }}
          >
            <div
              className="w-16 h-16 squircle-md lg-glass-strong flex flex-col items-center justify-center shrink-0"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.30), 0 4px 14px -4px rgba(0,214,254,0.30)' }}
            >
              <div className="sf text-[8px] tracking-[0.16em] uppercase font-bold text-white/65 leading-none">
                NO.
              </div>
              <div
                className="sf-display text-[22px] font-bold tabular-nums text-white leading-none mt-0.5"
                style={{ textShadow: '0 0 10px rgba(0,214,254,0.40)' }}
              >
                {player ? player.number : '—'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="sf-display text-[18px] font-bold leading-tight tracking-[-0.01em] text-white truncate">
                {player ? player.name : 'Player'}
              </div>
              <div className="sf text-[12px] text-white/65 mt-0.5">
                {player ? player.position : ''} · {team ? team.name : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Reassurance list */}
        <div className="shrink-0 mt-6 space-y-2">
          {rows.map((row, i) => (
            <div
              key={i}
              className="squircle-sm px-3 py-2.5 flex items-start gap-2.5"
              style={{
                background: 'var(--glass-card-bg)',
                backdropFilter: 'blur(36px) saturate(180%)',
                WebkitBackdropFilter: 'blur(36px) saturate(180%)',
                border: '1px solid var(--glass-card-border)',
              }}
            >
              <div
                className="w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center"
                style={{ background: 'var(--brand-cyan-soft)', border: '1px solid var(--brand-cyan-border)' }}
              >
                <svg
                  width={10}
                  height={10}
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="var(--brand-cyan-text)"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: 10, height: 10, display: 'block' }}
                >
                  <path d="M3 7 L6 10 L11 4" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="sf text-[12.5px] font-semibold text-white leading-tight">
                  {row.label}
                </div>
                <div className="sf text-[11px] text-white/60 leading-relaxed mt-0.5">
                  {row.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <OnboardDock>
        <button
          onClick={onContinue}
          className="w-full lg-btn-primary lg-shine lg-aura squircle-md py-4 sf text-[14.5px] font-semibold"
        >
          Continue to Halo
        </button>
      </OnboardDock>
    </>
  );
};
