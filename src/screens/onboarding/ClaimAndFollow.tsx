import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OnboardStepper, OnboardDock } from './_chrome';
import { TEAMS_DB, ROSTER } from './_data';
import { useLocalized } from '@/screens/home/_data';
import { TEAM_LOGOS } from '@/screens/home/_avatars';

/* ClaimAndFollow — combined "claim your jersey" + "follow your
   teammates" screen. Step 3 of player onboarding (coach-invite flow).

   Behaviour:
     - Roster of the locked team renders as a list, sorted by jersey #.
     - User taps "This is me" on their own row → that row becomes the
       claimed-self state (cyan halo + "Claimed by you" label).
     - The moment a player is claimed, all other teammates auto-follow
       (the whole roster minus self goes into chosenPlayers). User can
       still uncheck individuals.
     - "I'm not on this roster yet" link opens CoachNotifyModal.
     - Continue is disabled until the user claims a row OR notifies
       the coach (claimed flag persists). */

export interface ClaimAndFollowProps {
  teamId: string;
  coachName: string;
  /** Roster id of the player the user has claimed as self. null = not
      yet claimed. */
  claimedSelfId: string | null;
  setClaimedSelfId: (id: string | null) => void;
  chosenPlayers: Record<string, boolean>;
  setChosenPlayers: (next: Record<string, boolean>) => void;
  onBack: () => void;
  onNext: () => void;
}

export const ClaimAndFollow = ({
  teamId,
  coachName,
  claimedSelfId,
  setClaimedSelfId,
  chosenPlayers,
  setChosenPlayers,
  onBack,
  onNext,
}: ClaimAndFollowProps) => {
  const { t } = useTranslation();
  const localized = useLocalized();
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifySent, setNotifySent] = useState(false);

  const team = TEAMS_DB.find((tm) => tm.id === teamId);
  const teamLogo = team && (TEAM_LOGOS as Record<string, string>)[team.initial];

  const roster = useMemo(
    () =>
      ROSTER.filter((p) => p.teamId === teamId).sort((a, b) => a.number - b.number),
    [teamId],
  );

  /* When the user claims a row, auto-follow every OTHER teammate. */
  const onClaim = (rosterId: string) => {
    setClaimedSelfId(rosterId);
    const next: Record<string, boolean> = { ...chosenPlayers };
    roster.forEach((p) => {
      next[p.id] = p.id !== rosterId;
    });
    setChosenPlayers(next);
  };

  /* If self changes (e.g. user re-claims a different row), recompute
     the auto-follow set so "everyone else" stays accurate. */
  useEffect(() => {
    if (!claimedSelfId) return;
    const next: Record<string, boolean> = { ...chosenPlayers };
    let changed = false;
    roster.forEach((p) => {
      const want = p.id !== claimedSelfId;
      if (chosenPlayers[p.id] !== want) {
        next[p.id] = want;
        changed = true;
      }
    });
    if (changed) setChosenPlayers(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimedSelfId]);

  const togglePlayer = (id: string) => {
    if (id === claimedSelfId) return; // can't unfollow yourself
    setChosenPlayers({ ...chosenPlayers, [id]: !chosenPlayers[id] });
  };

  const canContinue = !!claimedSelfId || notifySent;

  return (
    <>
      <OnboardStepper step={2} total={3} onBack={onBack} />
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-[120px] anim-fade">
        <h1 className="sf-display text-[24px] font-bold text-white leading-[1.05] tracking-[-0.025em] mb-2">
          {t('claimFollow.title')}
        </h1>
        <p className="sf text-[13px] text-white/65 leading-relaxed mb-5">
          {t('claimFollow.subtitle')}
        </p>

        {/* Team header — small chip */}
        {team && (
          <div className="flex items-center gap-2.5 mb-3.5">
            {teamLogo ? (
              <img
                src={teamLogo}
                alt=""
                className="rounded-full"
                style={{ width: 28, height: 28, objectFit: 'cover' }}
              />
            ) : (
              <div className="w-7 h-7 squircle-sm lg-glass-strong flex items-center justify-center">
                <span className="sf-display text-[10px] font-bold text-white">
                  {team.initial}
                </span>
              </div>
            )}
            <span
              className="sf text-[11.5px] tracking-[0.10em] uppercase font-bold"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {t('claimFollow.rosterFor', { team: localized(team, 'name') })}
            </span>
          </div>
        )}

        {/* === Pre-claim state === flat list, every row exposes "This is me" === */}
        {!claimedSelfId && (
          <div className="space-y-2">
            {roster.map((p) => (
              <div
                key={p.id}
                className="squircle-md p-3 flex items-center gap-3 lg-aura"
                style={{
                  background: 'var(--glass-card-bg)',
                  backdropFilter: 'blur(36px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(36px) saturate(180%)',
                  border: '1px solid var(--glass-card-border)',
                }}
              >
                <JerseyBadge number={p.number} size="md" />
                <div className="flex-1 min-w-0">
                  <div
                    className="sf-display text-[14.5px] font-bold leading-tight truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {localized(p, 'name')}
                  </div>
                  <div
                    className="sf text-[11px] mt-0.5 truncate"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {p.position}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onClaim(p.id)}
                  className="squircle-sm px-3 py-1.5 sf text-[11px] font-semibold lg-aura shrink-0"
                  style={{
                    background: 'var(--brand-cyan-soft)',
                    border: '1px solid var(--brand-cyan-border)',
                    color: 'var(--brand-cyan-text)',
                  }}
                >
                  {t('claimFollow.thisIsMe')}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* === Post-claim state === hero + section divider + compact teammate list === */}
        {claimedSelfId && (() => {
          const self = roster.find((p) => p.id === claimedSelfId);
          const teammates = roster.filter((p) => p.id !== claimedSelfId);
          const followedCount = teammates.filter((p) => chosenPlayers[p.id]).length;
          if (!self) return null;
          return (
            <>
              {/* Hero — claimed self */}
              <div
                className="squircle-md p-4 flex items-center gap-3.5 lg-aura mb-1"
                style={{
                  background:
                    'radial-gradient(ellipse 65% 60% at 22% 30%, rgba(0,214,254,0.22) 0%, transparent 62%),' +
                    'var(--glass-card-bg)',
                  backdropFilter: 'blur(36px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(36px) saturate(180%)',
                  border: '1.5px solid var(--brand-cyan)',
                  boxShadow:
                    'inset 0 1px 0 var(--glass-card-inset-top), 0 10px 30px -10px rgba(0,214,254,0.40)',
                }}
              >
                <JerseyBadge number={self.number} size="lg" />
                <div className="flex-1 min-w-0">
                  <div
                    className="sf text-[9.5px] tracking-[0.18em] uppercase font-bold mb-0.5"
                    style={{ color: 'var(--brand-cyan-text)' }}
                  >
                    {t('claimFollow.playingAs')}
                  </div>
                  <div
                    className="sf-display text-[16px] font-bold leading-tight tracking-[-0.01em] truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {localized(self, 'name')}
                  </div>
                  <div
                    className="sf text-[11.5px] mt-0.5 truncate"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {self.position}
                  </div>
                </div>
                {/* Change pill — un-claims so the user can pick again */}
                <button
                  type="button"
                  onClick={() => setClaimedSelfId(null)}
                  className="squircle-sm px-3 py-1.5 sf text-[11px] font-semibold shrink-0 lg-aura"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--brand-cyan-border)',
                    color: 'var(--brand-cyan-text)',
                  }}
                >
                  {t('claimFollow.change')}
                </button>
              </div>

              {/* Section divider — sits BETWEEN hero and teammate list */}
              {teammates.length > 0 && (
                <div className="px-1 mt-7 mb-3">
                  <div
                    className="sf text-[10px] tracking-[0.18em] uppercase font-bold"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {t('claimFollow.yourTeammatesCount', { count: followedCount })}
                  </div>
                  <div
                    className="sf text-[10.5px] mt-1"
                    style={{ color: 'var(--text-faint)' }}
                  >
                    {t('claimFollow.tapToUnfollow')}
                  </div>
                </div>
              )}

              {/* Compact teammate rows */}
              <div className="space-y-1.5">
                {teammates.map((p) => {
                  const isFollowed = !!chosenPlayers[p.id];
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePlayer(p.id)}
                      aria-pressed={isFollowed}
                      className="w-full text-start squircle-sm p-2.5 flex items-center gap-2.5 lg-aura"
                      style={{
                        background: isFollowed
                          ? 'rgba(0,214,254,0.06)'
                          : 'transparent',
                        border: isFollowed
                          ? '1px solid rgba(0,214,254,0.22)'
                          : '1px solid var(--glass-card-border)',
                      }}
                    >
                      <JerseyBadge number={p.number} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div
                          className="sf-display text-[13.5px] font-bold leading-tight truncate"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {localized(p, 'name')}
                        </div>
                        <div
                          className="sf text-[10.5px] mt-0.5 truncate"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          {p.position}
                        </div>
                      </div>
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={
                          isFollowed
                            ? { background: 'var(--brand-cyan)' }
                            : {
                                background: 'var(--hatch-grain)',
                                border: '1px solid var(--hairline-strong)',
                              }
                        }
                      >
                        {isFollowed && (
                          <svg
                            width={10}
                            height={10}
                            viewBox="0 0 14 14"
                            fill="none"
                            stroke="#000"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: 10, height: 10, display: 'block' }}
                          >
                            <path d="M3 7 L6 10 L11 4" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          );
        })()}

        {/* "Not on roster" link */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => setNotifyOpen(true)}
            className="sf text-[12.5px] font-semibold"
            style={{ color: 'var(--brand-cyan-text)' }}
          >
            {t('claimFollow.notOnRoster')}
          </button>
        </div>
      </div>

      <OnboardDock>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="lg-btn-primary lg-shine lg-aura squircle-md py-4 w-full sf text-[14.5px] font-semibold"
        >
          {canContinue
            ? t('claimFollow.continueEnabled')
            : t('claimFollow.continueDisabled')}
        </button>
      </OnboardDock>

      {/* Coach-notify bottom sheet (UX stub — no real send) */}
      {notifyOpen && (
        <CoachNotifyModal
          coachName={coachName}
          notifySent={notifySent}
          onNotify={() => {
            setNotifySent(true);
            setTimeout(() => {
              setNotifyOpen(false);
              setNotifySent(false);
              onNext();
            }, 1200);
          }}
          onClose={() => setNotifyOpen(false)}
        />
      )}
    </>
  );
};

/* JerseyBadge — three sizes used in this screen:
   - sm  → 36×36 compact teammate rows (post-claim)
   - md  → 44×44 standard list rows (pre-claim)
   - lg  → 56×56 hero row for the claimed-self
   Each variant uses the same glass squircle treatment so the visual
   language stays consistent across states. */
const JERSEY_DIMS = {
  sm: { box: 36, caption: 8, number: 14 },
  md: { box: 44, caption: 9, number: 17 },
  lg: { box: 56, caption: 10, number: 22 },
} as const;

const JerseyBadge = ({
  number,
  size,
}: {
  number: number;
  size: 'sm' | 'md' | 'lg';
}) => {
  const { t } = useTranslation();
  const dims = JERSEY_DIMS[size];
  return (
    <div
      className="squircle-sm lg-glass-strong flex flex-col items-center justify-center shrink-0"
      style={{
        width: dims.box,
        height: dims.box,
        lineHeight: 1,
      }}
      aria-label={`${t('roster.no')} ${number}`}
    >
      <span
        className="sf font-semibold"
        style={{
          fontSize: dims.caption,
          letterSpacing: '0.10em',
          color: 'var(--text-tertiary)',
          marginBlockEnd: 1,
        }}
      >
        {t('roster.no')}
      </span>
      <span
        className="sf-display font-bold"
        style={{
          fontSize: dims.number,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}
      >
        {number}
      </span>
    </div>
  );
};

const CoachNotifyModal = ({
  coachName,
  notifySent,
  onNotify,
  onClose,
}: {
  coachName: string;
  notifySent: boolean;
  onNotify: () => void;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="absolute inset-0 z-50 anim-fade">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 anim-slide-up squircle-lg p-5"
        style={{
          background: 'var(--canvas-bg-soft)',
          borderInlineStart: '1px solid var(--brand-cyan-border)',
          borderInlineEnd: '1px solid var(--brand-cyan-border)',
          borderBlockStart: '1px solid var(--brand-cyan-border)',
          borderEndStartRadius: 0,
          borderEndEndRadius: 0,
          paddingBlockEnd: 32,
        }}
      >
        <div className="flex items-start gap-3 mb-5">
          <div
            className="w-12 h-12 squircle-sm flex items-center justify-center shrink-0"
            style={{
              background: 'var(--brand-cyan-soft)',
              border: '1px solid var(--brand-cyan-border)',
              color: 'var(--brand-cyan-text)',
            }}
          >
            <svg
              width={22}
              height={22}
              viewBox="0 0 22 22"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: 22, height: 22, display: 'block' }}
            >
              <path d="M3 7 a4 4 0 0 1 8 0 v3 l1.5 2 H1.5 L3 10 Z" />
              <path d="M5.5 13 a1.5 1.5 0 0 0 3 0" />
              <circle cx={16} cy={6} r={3} fill="currentColor" />
            </svg>
          </div>
          <div className="flex-1">
            <div
              className="sf-display text-[17px] font-bold leading-tight tracking-[-0.01em]"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('claimFollow.modalTitle')}
            </div>
            <p
              className="sf text-[12.5px] leading-relaxed mt-1.5"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {t('claimFollow.modalBody', { coach: coachName })}
            </p>
          </div>
        </div>

        {notifySent ? (
          /* Success state */
          <div
            className="squircle-md py-4 px-3 text-center"
            style={{
              background: 'var(--brand-cyan-soft)',
              border: '1px solid var(--brand-cyan-border)',
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <svg
                width={16}
                height={16}
                viewBox="0 0 14 14"
                fill="none"
                stroke="var(--brand-cyan-text)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: 16, height: 16, display: 'block' }}
              >
                <path d="M3 7 L6 10 L11 4" />
              </svg>
              <span
                className="sf text-[13px] font-semibold"
                style={{ color: 'var(--brand-cyan-text)' }}
              >
                {t('claimFollow.modalSent')}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={onNotify}
              className="lg-btn-primary lg-shine lg-aura squircle-md py-3.5 w-full sf text-[14px] font-semibold"
            >
              {t('claimFollow.modalCta')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sf text-[12.5px] py-2"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {t('claimFollow.modalSkip')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
