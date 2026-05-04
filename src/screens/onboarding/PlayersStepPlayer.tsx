import { useEffect } from 'react';
import { OnboardStepper, OnboardDock } from './_chrome';
import { ClaimAthleteExplainer } from './ClaimAthleteExplainer';
import { ROSTER, RIVAL_STARS } from './_data';

/* Verbatim port: halo-v3.2-glass.html lines 6977-7199 (player branch).
   Two-stage flow:
     Stage 1 — no self-claim → ClaimAthleteExplainer card.
               CTA reads "Continue as Fan".
     Stage 2 — after self-claim OR after notify-coach request:
               • "That's me" / "Request sent" hero card
               • Teammates list (auto-seeded)
               • Top rivals list (RIVAL_STARS)
               CTA reads "Finish – following N". */

export interface PlayersStepPlayerProps {
  chosenPlayers: Record<string, boolean>;
  togglePlayer: (id: string) => void;
  onBack: () => void;
  onFinish: () => void;
  onSkip?: () => void;
  /** Tapping the demo URL pill in stage 1. */
  onClaim?: (teamCode: string) => void;
}

export const PlayersStepPlayer = ({
  chosenPlayers,
  togglePlayer,
  onBack,
  onFinish,
  onSkip,
  onClaim,
}: PlayersStepPlayerProps) => {
  const roster = ROSTER;
  const selfKey =
    Object.keys(chosenPlayers).find((k) => k.startsWith('self_') && chosenPlayers[k]) || null;
  const selfPlayer = selfKey ? roster.find((p) => 'self_' + p.id === selfKey) || null : null;
  const notifiedCoach = !!chosenPlayers['__notified_coach'];
  const teammates = selfPlayer ? roster.filter((p) => p.id !== selfPlayer.id) : roster;

  /* Auto-seed teammate follows the first time we land in stage 2. Mirror
     of prototype line 6984. */
  useEffect(() => {
    if ((selfPlayer || notifiedCoach) && !chosenPlayers['__seeded_teammates']) {
      teammates.forEach((t) => {
        if (!chosenPlayers['mate_' + t.id]) togglePlayer('mate_' + t.id);
      });
      togglePlayer('__seeded_teammates');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selfPlayer?.id, notifiedCoach]);

  const followedMatesCount = teammates.filter((t) => !!chosenPlayers['mate_' + t.id]).length;
  const followedRivalsCount = RIVAL_STARS.filter((r) => !!chosenPlayers['rival_' + r.id]).length;
  const totalFollows = followedMatesCount + followedRivalsCount;

  const clearSelf = () => {
    if (selfKey) togglePlayer(selfKey);
    [
      '__seeded_teammates',
      ...Object.keys(chosenPlayers).filter(
        (k) => (k.startsWith('mate_') || k.startsWith('rival_')) && chosenPlayers[k],
      ),
    ].forEach((k) => togglePlayer(k));
  };
  const cancelCoachRequest = () => {
    togglePlayer('__notified_coach');
    [
      '__seeded_teammates',
      ...Object.keys(chosenPlayers).filter(
        (k) => (k.startsWith('mate_') || k.startsWith('rival_')) && chosenPlayers[k],
      ),
    ].forEach((k) => togglePlayer(k));
  };

  const stage2Visible = !!selfPlayer || notifiedCoach;

  return (
    <>
      <OnboardStepper step={3} total={3} onBack={onBack} />
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-[120px] anim-fade">
        <h1 className="sf-display text-[24px] font-bold text-white leading-[1.05] tracking-[-0.025em] mb-2">
          {stage2Visible ? "You're on Varsity" : 'Find yourself on the roster'}
        </h1>
        <p className="sf text-[13px] text-white/65 leading-relaxed mb-5">
          {stage2Visible
            ? "Now pick teammates and rivals to follow — we'll surface their drops in your feed."
            : "Tap your number — we'll auto-tag your moments in every game."}
        </p>

        {/* === STAGE 1 — claim explainer === */}
        {!stage2Visible && <ClaimAthleteExplainer onClaim={onClaim} />}

        {/* === STAGE 2A — self-claim hero card === */}
        {selfPlayer && (
          <div className="anim-fade mb-6">
            <div className="sf text-[10px] tracking-[0.18em] uppercase font-bold text-halo-cyan mb-2.5">
              That's me
            </div>
            <div
              className="relative squircle-md p-4 flex items-center gap-3.5 overflow-hidden"
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
                className="w-14 h-14 squircle-md lg-glass-strong flex flex-col items-center justify-center shrink-0"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.30), 0 4px 14px -4px rgba(0,214,254,0.30)' }}
              >
                <div className="sf text-[7.5px] tracking-[0.16em] uppercase font-bold text-white/65 leading-none">
                  NO.
                </div>
                <div
                  className="sf-display text-[20px] font-bold tabular-nums text-white leading-none mt-0.5"
                  style={{ textShadow: '0 0 10px rgba(0,214,254,0.40)' }}
                >
                  {selfPlayer.number}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="sf-display text-[16px] font-bold leading-tight tracking-[-0.01em] text-white truncate">
                  {selfPlayer.name}
                </div>
                <div className="sf text-[11.5px] text-white/65 mt-0.5">
                  {selfPlayer.position} · Varsity
                </div>
              </div>
              <button
                onClick={clearSelf}
                className="w-8 h-8 lg-glass squircle-sm flex items-center justify-center text-white/85"
                aria-label="Change jersey"
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
          </div>
        )}

        {/* === STAGE 2B — coach-notify pending === */}
        {notifiedCoach && !selfPlayer && (
          <div className="anim-fade mb-6">
            <div className="sf text-[10px] tracking-[0.18em] uppercase font-bold text-halo-cyan mb-2.5">
              Request sent
            </div>
            <div
              className="squircle-md p-4 flex items-center gap-3.5 overflow-hidden"
              style={{
                background: 'var(--brand-cyan-soft)',
                backdropFilter: 'blur(36px) saturate(180%)',
                WebkitBackdropFilter: 'blur(36px) saturate(180%)',
                border: '1px solid var(--brand-cyan-border)',
                boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), 0 6px 20px -8px rgba(0,214,254,0.30)',
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: '#00D6FE', boxShadow: '0 0 16px rgba(0,214,254,0.55)' }}
              >
                <svg
                  width={22}
                  height={22}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#001218"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: 22, height: 22, display: 'block' }}
                >
                  <path d="M5 13 L10 18 L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="sf-display text-[14.5px] font-bold leading-tight text-white">
                  Coach Miles will add you
                </div>
                <div className="sf text-[11.5px] text-white/65 mt-0.5">
                  We'll notify you once you're on the roster.
                </div>
              </div>
              <button
                onClick={cancelCoachRequest}
                className="w-8 h-8 lg-glass squircle-sm flex items-center justify-center text-white/85"
                aria-label="Cancel request"
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
          </div>
        )}

        {/* === STAGE 2C — teammates list === */}
        {stage2Visible && teammates.length > 0 && (
          <div className="anim-fade mb-6">
            <div className="flex items-end justify-between mb-2.5">
              <div>
                <div className="sf text-[10px] tracking-[0.18em] uppercase font-bold text-white/55 leading-none">
                  Teammates
                </div>
                <div className="sf text-[11.5px] text-white/55 mt-1">
                  Following {followedMatesCount} of {teammates.length}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {teammates.map((p) => (
                <FollowRow
                  key={p.id}
                  prefix="mate_"
                  id={p.id}
                  title={p.name}
                  sub={'#' + p.number + ' · ' + p.position}
                  initial={'#' + p.number}
                  accent
                  active={!!chosenPlayers['mate_' + p.id]}
                  onToggle={() => togglePlayer('mate_' + p.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* === STAGE 2D — top rivals === */}
        {stage2Visible && (
          <div className="anim-fade">
            <div className="flex items-end justify-between mb-2.5">
              <div>
                <div className="sf text-[10px] tracking-[0.18em] uppercase font-bold text-white/55 leading-none">
                  Top rivals
                </div>
                <div className="sf text-[11.5px] text-white/55 mt-1">
                  Star players in your division · optional
                </div>
              </div>
              {followedRivalsCount > 0 && (
                <div className="lg-glass squircle-sm px-2 py-0.5 sf text-[10px] font-bold text-halo-cyan tabular-nums">
                  {followedRivalsCount} selected
                </div>
              )}
            </div>
            <div className="space-y-2">
              {RIVAL_STARS.map((r) => (
                <FollowRow
                  key={r.id}
                  prefix="rival_"
                  id={r.id}
                  title={r.name}
                  sub={r.role + ' · ' + r.teamName}
                  initial={r.teamInitial}
                  active={!!chosenPlayers['rival_' + r.id]}
                  onToggle={() => togglePlayer('rival_' + r.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <OnboardDock>
        <div className="flex gap-2.5">
          <button
            onClick={onSkip}
            className="lg-glass squircle-md py-4 px-5 sf text-[13px] font-semibold text-white"
          >
            Skip
          </button>
          <button
            onClick={onFinish}
            className="flex-1 lg-btn-primary lg-shine lg-aura squircle-md py-4 sf text-[14.5px] font-semibold"
          >
            {stage2Visible
              ? totalFollows > 0
                ? `Finish – following ${totalFollows}`
                : 'Finish'
              : 'Continue as Fan'}
          </button>
        </div>
      </OnboardDock>
    </>
  );
};

const FollowRow = ({
  prefix,
  id,
  title,
  sub,
  initial,
  accent,
  active,
  onToggle,
}: {
  prefix: string;
  id: string;
  title: string;
  sub: string;
  initial: string;
  accent?: boolean;
  active: boolean;
  onToggle: () => void;
}) => (
  <button
    key={prefix + id}
    onClick={onToggle}
    className="w-full text-left squircle-md p-3 flex items-center gap-3 lg-aura relative overflow-hidden"
    style={
      active
        ? {
            background: 'var(--glass-card-bg)',
            backdropFilter: 'blur(36px) saturate(180%)',
            WebkitBackdropFilter: 'blur(36px) saturate(180%)',
            border: '1px solid var(--brand-cyan-border)',
            boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), 0 6px 18px -8px rgba(0,214,254,0.30)',
          }
        : {
            background: 'var(--glass-card-bg)',
            backdropFilter: 'blur(36px) saturate(180%)',
            WebkitBackdropFilter: 'blur(36px) saturate(180%)',
            border: '1px solid var(--glass-card-border)',
            boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), var(--glass-card-shadow)',
          }
    }
  >
    <div
      className="w-10 h-10 squircle-sm flex items-center justify-center shrink-0 sf-display text-[12px] font-bold"
      style={{
        background: accent ? 'var(--brand-cyan-soft)' : 'var(--hatch-grain)',
        border: '1px solid ' + (accent ? 'var(--brand-cyan-border)' : 'var(--glass-card-border)'),
        color: accent ? 'var(--brand-cyan-text)' : 'var(--text-secondary)',
      }}
    >
      {initial}
    </div>
    <div className="flex-1 min-w-0">
      <div className="sf-display text-[14px] font-bold leading-tight text-white truncate">{title}</div>
      <div className="sf text-[11px] text-white/65 truncate mt-0.5">{sub}</div>
    </div>
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
      style={
        active
          ? { background: '#00D6FE', boxShadow: '0 0 10px rgba(0,214,254,0.55)' }
          : { background: 'var(--hatch-grain)', border: '1px solid var(--hairline-strong)' }
      }
    >
      {active && (
        <svg
          width={12}
          height={12}
          viewBox="0 0 14 14"
          fill="none"
          stroke="#001218"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 12, height: 12, display: 'block' }}
        >
          <path d="M3 7 L6 10 L11 4" />
        </svg>
      )}
    </div>
  </button>
);
