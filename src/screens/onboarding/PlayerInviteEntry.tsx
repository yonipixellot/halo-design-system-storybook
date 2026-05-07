import { useTranslation } from 'react-i18next';
import { TEAMS_DB } from './_data';
import { useLocalized } from '@/screens/home/_data';
import { TEAM_LOGOS } from '@/screens/home/_avatars';
import { MomentCanvas } from '@/layouts/MomentCanvas';

/* PlayerInviteEntry — first screen a player sees after tapping a coach
   invite link. May 2026 build, coach side parked: invite context
   (teamId + coachName) is hardcoded by the orchestrator and passed in.

   Goal: make the player feel personally invited — coach's name, the
   team they're being added to, the moment matters. Two outcomes:
     - Sign up   — they're new
     - Sign in   — they already have a Halo account

   No photos: first-time players don't have one of their own, and to
   keep the visual language consistent across the whole player flow,
   the coach's "avatar" hero is rendered as an initials letterform on
   the same cyan-halo glass disc. The whistle chip pinned at the bottom
   carries the "this is your coach" semantics. */

/** Compute display initials for a coach name, stripping common
    honorifics. "Coach Sarah" → "S". "Coach Mike Davis" → "MD". */
const coachInitials = (name: string): string => {
  const cleaned = name.replace(/^(coach|mr|ms|mrs|dr)\.?\s+/i, '').trim();
  if (!cleaned) return '?';
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) return (parts[0][0] ?? '?').toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export interface PlayerInviteEntryProps {
  /** Team the player is being invited to. Comes from the invite link. */
  teamId: string;
  /** Coach's display name. Hardcoded for the demo; production fetches
      from the invite record. */
  coachName: string;
  onSignUp: () => void;
  onSignIn: () => void;
}

export const PlayerInviteEntry = ({
  teamId,
  coachName,
  onSignUp,
  onSignIn,
}: PlayerInviteEntryProps) => {
  const { t } = useTranslation();
  const localized = useLocalized();
  const team = TEAMS_DB.find((tm) => tm.id === teamId);
  const teamName = team ? localized(team, 'name') : teamId;
  const teamOrg = team ? localized(team, 'org') : '';
  /* Pull a logo for the team if we have one in the bundled set,
     otherwise fall back to the team's initials letterform. */
  const teamLogoUrl =
    team && (TEAM_LOGOS as Record<string, string>)[team.initial];

  return (
    <MomentCanvas>
      <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-14 pb-[120px] anim-fade flex flex-col lg:flex-none lg:min-h-0 lg:overflow-visible lg:px-0 lg:pt-0 lg:pb-0">
      {/* Hero — coach avatar with cyan halo.
          (Removed top-of-screen "HALO · FROM YOUR COACH" wordmark — the
          coach avatar + "ADDED BY COACH SARAH" caption already establish
          the source, and the second wordmark read as redundant noise on
          desktop. Phone treatment is the same since the wordmark
          appeared on both viewports.) */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div
          className="relative mb-6"
          style={{ width: 120, height: 120 }}
        >
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0,214,254,0.45) 0%, transparent 65%)',
              filter: 'blur(16px)',
            }}
          />
          {/* Avatar disc — initials letterform, no photo */}
          <div
            className="relative rounded-full lg-glass-card flex items-center justify-center"
            style={{
              width: 120,
              height: 120,
              border: '2.5px solid var(--brand-cyan)',
              boxShadow:
                '0 0 40px -8px rgba(0,214,254,0.55), 0 12px 40px -12px rgba(0,0,0,0.55)',
              color: 'var(--brand-cyan-text)',
            }}
            aria-label={coachName}
          >
            <span
              className="sf-display font-bold"
              style={{
                fontSize: 44,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {coachInitials(coachName)}
            </span>
          </div>
          {/* Whistle / coach badge — small chip pinned bottom-end */}
          <div
            className="absolute rounded-full lg-glass-strong flex items-center justify-center"
            style={{
              bottom: 0,
              insetInlineEnd: 0,
              width: 36,
              height: 36,
              border: '2px solid var(--canvas-bg)',
              color: 'var(--brand-cyan-text)',
            }}
            aria-hidden="true"
          >
            <svg
              width={18}
              height={18}
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: 18, height: 18, display: 'block' }}
            >
              <path d="M3 8 a5 5 0 0 1 10 0 v0.5 l3 -1 v3 l-3 -1 v0.5 a5 5 0 0 1 -10 0 Z M8 8 v0" />
            </svg>
          </div>
        </div>

        {/* "Added by" line */}
        <p
          className="sf text-[11px] tracking-[0.18em] uppercase font-bold mb-2"
          style={{ color: 'var(--brand-cyan-text)' }}
        >
          {t('invite.addedBy', { coach: coachName })}
        </p>

        {/* Headline */}
        <h1
          className="sf-display font-bold text-white leading-[1.05] tracking-[-0.025em] mb-3"
          style={{ fontSize: 30 }}
        >
          {t('invite.welcomeTitle')}
        </h1>

        {/* Team chip — shows what team they're joining.
            Sized 2× the original chip so the team identity reads as a
            real anchor next to the coach hero, not a passing label.
            Logo: 28→56, padding: 12/8→24/16, gap: 10→20,
            team-name type: 14→22, org type: 11→14. */}
        {team && (
          <div
            className="inline-flex items-center gap-5 squircle-md px-6 py-4 mb-5"
            style={{
              background: 'var(--glass-card-bg)',
              backdropFilter: 'blur(36px) saturate(180%)',
              WebkitBackdropFilter: 'blur(36px) saturate(180%)',
              border: '1px solid var(--glass-card-border)',
            }}
          >
            {teamLogoUrl ? (
              <img
                src={teamLogoUrl}
                alt=""
                className="rounded-full"
                style={{ width: 56, height: 56, display: 'block', objectFit: 'cover' }}
              />
            ) : (
              <div
                className="squircle-sm lg-glass-strong flex items-center justify-center"
                style={{ width: 56, height: 56 }}
              >
                <span className="sf-display text-[20px] font-bold text-white">
                  {team.initial}
                </span>
              </div>
            )}
            <div className="text-start min-w-0">
              <div className="sf-display text-[22px] font-bold text-white leading-tight truncate">
                {teamName}
              </div>
              {teamOrg && (
                <div
                  className="sf text-[14px] truncate leading-tight mt-1"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {teamOrg}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subhead */}
        <p
          className="sf text-[13.5px] leading-relaxed max-w-[280px]"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {t('invite.welcomeSub')}
        </p>
      </div>

      {/* Bottom CTAs — primary CTA capped at 360px on desktop */}
      <div className="shrink-0 mt-6 space-y-3">
        <button
          onClick={onSignUp}
          className="lg-btn-primary lg-shine lg-aura squircle-md py-4 w-full sf text-[14.5px] font-semibold cta-constrained lg:block"
        >
          {t('invite.signUpCta')}
        </button>
        <button
          onClick={onSignIn}
          className="w-full sf text-[12.5px] text-center"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {t('invite.signInPrompt')}{' '}
          <span
            className="font-semibold"
            style={{ color: 'var(--brand-cyan-text)' }}
          >
            {t('invite.signInCta')}
          </span>
        </button>
      </div>
      </div>
    </MomentCanvas>
  );
};
