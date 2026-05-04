import { useEffect, useState } from 'react';
import { cls } from '@/lib/cls';
import { ROSTER, TEAMS_DB } from './_data';

/* Verbatim port: halo-v3.2-glass.html lines 5981-6238.
   Full-screen jersey-claim page that opens when the user lands from a
   coach-issued invite link (or in Storybook, when the demo URL pill is
   tapped in ClaimAthleteExplainer).

   Three internal phases:
     • idle      — normal jersey grid, all unclaimed tiles tappable.
     • claiming  — chosen jersey pulses 800ms, others fade to ~25%.
     • success   — welcome overlay scales in over a blurred scrim, lives
                   1.2s before onClaimed() fires (1700ms total). */

export interface ClaimPageProps {
  /** Team to claim — usually the team code from the invite URL. */
  teamCode: string;
  /** X close button — back to whichever view opened this. */
  onClose: () => void;
  /** Fired after the success ritual finishes (success → onClaimed in 1.2s). */
  onClaimed?: (payload: { teamId: string; rosterId: string; jerseyNumber: number }) => void;
  /** Coach notify CTA in the "Don't see your number?" card. */
  onAskCoach?: (teamId: string) => void;
}

export const ClaimPage = ({ teamCode, onClose, onClaimed, onAskCoach }: ClaimPageProps) => {
  const [phase, setPhase] = useState<'idle' | 'claiming' | 'success'>('idle');
  const [chosenId, setChosenId] = useState<string | null>(null);

  /* Reset phase whenever a fresh team code mounts — otherwise a prior
     'success' would leak across opens. */
  useEffect(() => {
    setPhase('idle');
    setChosenId(null);
  }, [teamCode]);

  const team = TEAMS_DB.find((t) => t.claimCode === teamCode);

  /* Defensive: unknown teamCode → minimal "team not found" state. */
  if (!team) {
    return (
      <div
        className="absolute inset-0 z-[60] anim-fade flex flex-col items-center justify-center px-8"
        style={{ background: 'var(--canvas-bg)', color: 'var(--text-primary)' }}
      >
        <div className="sf-display text-[22px] font-bold mb-2 text-center">
          Invite link doesn't match
        </div>
        <div
          className="sf text-[13px] text-center mb-6"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Ask your coach for a fresh team invite link.
        </div>
        <button
          onClick={onClose}
          className="lg-btn-primary lg-shine squircle-md py-3 px-8 sf text-[14px] font-semibold"
        >
          Got it
        </button>
      </div>
    );
  }

  const teamRoster = ROSTER.filter((p) => p.teamId === team.id);
  const isClaimed = (p: (typeof ROSTER)[number]) => !!p.claimed;

  const claim = (rosterId: string) => {
    if (phase !== 'idle') return;
    setChosenId(rosterId);
    setPhase('claiming');
    setTimeout(() => setPhase('success'), 800);
    setTimeout(() => {
      const player = teamRoster.find((p) => p.id === rosterId);
      if (player) {
        onClaimed?.({ teamId: team.id, rosterId, jerseyNumber: player.number });
      }
    }, 2000);
  };

  const successPlayer = chosenId ? teamRoster.find((p) => p.id === chosenId) : null;

  return (
    <div
      className="absolute inset-0 z-[60] anim-fade overflow-y-auto"
      style={{ background: 'var(--canvas-bg)', color: 'var(--text-primary)' }}
    >
      <div className="lg-atmosphere" />

      {/* Top bar — close + invite eyebrow */}
      <div className="relative z-10 px-5 pt-12 pb-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="w-9 h-9 lg-glass squircle-sm flex items-center justify-center"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Close"
        >
          <svg
            width={12}
            height={12}
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            style={{ width: 12, height: 12, display: 'block' }}
          >
            <path d="M3 3 L11 11 M11 3 L3 11" />
          </svg>
        </button>
        <div
          className="sf text-[10px] tracking-[0.18em] uppercase font-bold"
          style={{ color: 'var(--brand-cyan-text)' }}
        >
          Coach invite
        </div>
      </div>

      {/* Header — team name + roster count */}
      <div className="relative z-10 px-5 pb-6">
        <h1 className="sf-display text-[28px] font-bold leading-[1.05] tracking-[-0.025em] mb-2">
          Claim your spot on {team.name}
        </h1>
        <p
          className="sf text-[13px] leading-relaxed"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {team.org} · {team.division} · {teamRoster.length} players · tap your number
        </p>
      </div>

      {/* Jersey grid — 3 columns. */}
      <div className="relative z-10 px-5 pb-6">
        <div className="grid grid-cols-3 gap-2.5">
          {teamRoster.map((p) => {
            const claimedAlready = isClaimed(p);
            const isChosen = chosenId === p.id;
            const inTransition = phase !== 'idle';
            const dimmed = inTransition && !isChosen;
            const tileClasses = cls(
              'relative squircle-md p-3 flex flex-col items-center justify-center text-center overflow-hidden lg-aura',
              isChosen && phase === 'claiming' && 'lg-claim-pulse',
            );
            return (
              <button
                key={p.id}
                onClick={claimedAlready || inTransition ? undefined : () => claim(p.id)}
                disabled={claimedAlready || inTransition}
                className={tileClasses}
                style={
                  claimedAlready
                    ? {
                        background: 'var(--hatch-grain)',
                        border: '1px solid var(--hairline)',
                        height: 110,
                        cursor: 'not-allowed',
                        opacity: dimmed ? 0.18 : 0.45,
                        transition: 'opacity 320ms ease',
                      }
                    : {
                        background: 'var(--glass-card-bg)',
                        backdropFilter: 'blur(36px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(36px) saturate(180%)',
                        border: '1px solid var(--glass-card-border)',
                        boxShadow:
                          'inset 0 1px 0 var(--glass-card-inset-top), var(--glass-card-shadow)',
                        height: 110,
                        opacity: dimmed ? 0.25 : 1,
                        transition: 'opacity 320ms ease',
                      }
                }
              >
                <div
                  className="sf text-[8.5px] tracking-[0.18em] uppercase font-bold leading-none mb-0.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  NO.
                </div>
                <div
                  className="sf-display font-bold tabular-nums leading-none"
                  style={{ fontSize: 32, color: 'var(--text-primary)' }}
                >
                  {p.number}
                </div>
                <div
                  className="sf text-[10.5px] font-medium mt-1.5 truncate w-full"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {p.name.split(' ')[0]}
                </div>
                <div
                  className="sf text-[8.5px] tracking-[0.14em] uppercase font-semibold mt-0.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {p.position}
                </div>
                {claimedAlready && (
                  <div
                    className="absolute top-1.5 right-1.5 sf text-[8px] tracking-[0.12em] uppercase font-bold px-1.5 py-0.5 squircle-sm"
                    style={{ background: 'var(--text-faint)', color: 'var(--canvas-bg)' }}
                  >
                    Taken
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer — "not on roster" notify-coach card */}
      <div className="relative z-10 px-5 pb-12">
        <div
          className="squircle-md p-4"
          style={{
            background: 'var(--glass-card-bg)',
            backdropFilter: 'blur(36px) saturate(180%)',
            WebkitBackdropFilter: 'blur(36px) saturate(180%)',
            border: '1px solid var(--glass-card-border)',
            boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), var(--glass-card-shadow)',
          }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-9 h-9 squircle-sm flex items-center justify-center shrink-0"
              style={{
                background: 'var(--brand-cyan-soft)',
                border: '1px solid var(--brand-cyan-border)',
                color: 'var(--brand-cyan-text)',
              }}
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: 16, height: 16, display: 'block' }}
              >
                <circle cx={8} cy={7} r={3} />
                <path d="M2 17 c0 -3.5 3 -6 6 -6" />
                <path d="M14 5 v6 M11 8 h6" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="sf-display text-[13.5px] font-bold leading-tight">
                Don't see your number?
              </div>
              <div
                className="sf text-[11.5px] leading-relaxed mt-1"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Coach hasn't added you yet. Send a request and they'll add you to the roster.
              </div>
            </div>
          </div>
          <button
            onClick={() => onAskCoach?.(team.id)}
            className="w-full squircle-sm py-2.5 sf text-[12.5px] font-semibold"
            style={{
              background: 'var(--brand-cyan-soft)',
              border: '1px solid var(--brand-cyan-border)',
              color: 'var(--brand-cyan-text)',
            }}
          >
            Ask Coach Miles to add me
          </button>
        </div>
      </div>

      {/* Welcome overlay (success phase) */}
      {phase === 'success' && (
        <div
          className="absolute inset-0 z-[70] flex items-center justify-center px-8 lg-claim-scrim"
          style={{
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(14px) saturate(140%)',
            WebkitBackdropFilter: 'blur(14px) saturate(140%)',
            pointerEvents: 'none',
          }}
        >
          <div
            className="relative squircle-md p-6 w-full max-w-[300px] lg-claim-welcome overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse 65% 70% at 25% 30%, rgba(0,214,254,0.32) 0%, transparent 60%),' +
                'radial-gradient(ellipse 70% 70% at 80% 75%, rgba(132,88,255,0.22) 0%, transparent 60%),' +
                'rgba(10, 14, 22, 0.92)',
              border: '1px solid rgba(0,214,254,0.55)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.20), 0 24px 60px -12px rgba(0,214,254,0.45), 0 0 80px -20px rgba(0,214,254,0.30)',
            }}
          >
            <div
              className="sf text-[10px] tracking-[0.18em] uppercase font-bold mb-3 text-center"
              style={{ color: '#00D6FE' }}
            >
              Profile claimed
            </div>
            <div
              className="w-20 h-20 squircle-md mx-auto mb-4 flex flex-col items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.18)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.30), 0 4px 18px -4px rgba(0,214,254,0.35)',
              }}
            >
              <div className="sf text-[8.5px] tracking-[0.16em] uppercase font-bold text-white/65 leading-none">
                NO.
              </div>
              <div
                className="sf-display text-[28px] font-bold tabular-nums text-white leading-none mt-1"
                style={{ textShadow: '0 0 12px rgba(0,214,254,0.55)' }}
              >
                {successPlayer ? successPlayer.number : '—'}
              </div>
            </div>
            <div className="sf-display text-[20px] font-bold text-white text-center leading-tight tracking-[-0.01em]">
              Welcome, {successPlayer ? successPlayer.name.split(' ')[0] : 'athlete'}
            </div>
            <div className="sf text-[12px] text-white/65 text-center mt-1.5">
              You're on {team.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
