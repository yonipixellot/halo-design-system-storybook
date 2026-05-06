import { IdentityCircle, type IdentityCircleProps } from './IdentityCircle';
import { SEED_GAMES, useT, useLocalized, type FollowState } from './_data';
import { TEAM_LOGOS, SAMPLE_PORTRAITS } from './_avatars';

/* TEAMS_DB and ROSTER subsets needed for circle rendering — keep local to
   match prototype behaviour without importing onboarding's full data.

   `logoUrl` and `profilePicUrl` are inline-SVG data URIs in storybook;
   in production, swap to real CMS / user-upload URLs. */
const TEAMS_DB = [
  { id: 't1', name: 'Varsity', name_he: 'ורסיטי', initial: 'EP', logoUrl: TEAM_LOGOS.EP },
  { id: 't3', name: 'Tigers',  name_he: 'הנמרים', initial: 'LH', logoUrl: undefined },
  { id: 't4', name: 'Wolves',  name_he: 'הזאבים', initial: 'NA', logoUrl: TEAM_LOGOS.NA },
];

const ROSTER = [
  { id: 'r1', name: 'Tal Weiss',     name_he: 'טל וייס',     number: 7,  teamId: 't1', claimed: false, profilePicUrl: undefined },
  { id: 'r2', name: 'Sarah Kim',     name_he: 'שרה קים',     number: 12, teamId: 't1', claimed: true,  profilePicUrl: SAMPLE_PORTRAITS.sarah },
  { id: 'r3', name: 'Dylan Torres',  name_he: 'דילן טורס',   number: 23, teamId: 't1', claimed: true,  profilePicUrl: undefined },
];

/* Verbatim port: halo-v3.2-glass.html line 8171.
   Sort order:  YOU → followed teams (live first) → followed players (claimed first). */
export const HighlightCircles = ({ s }: { s: FollowState }) => {
  const t = useT();
  const localized = useLocalized();
  const isPlayer = s.persona === 'player';
  const newSet = new Set(['t1', 'sarah', 'self']);
  const liveGames = SEED_GAMES.filter((g) => g.status === 'live');
  const teamLiveMap = new Map(liveGames.map((g) => [g.teamId, g.id]));

  const circles: IdentityCircleProps[] = [];

  /* 1. YOU — always position 1 when persona === player */
  if (isPlayer) {
    circles.push({
      kind: 'self',
      /* Self gets the user's own profile pic if uploaded; demo uses Tal's. */
      avatar: { src: SAMPLE_PORTRAITS.tal, initial: 'T' },
      label: t('home.youLabel'),
      isNew: newSet.has('self'),
    });
  }

  /* 2. Followed teams — live floats to top */
  const teamCircles: IdentityCircleProps[] = s.followedTeams
    .map((tid) => TEAMS_DB.find((t) => t.id === tid))
    .filter((t): t is (typeof TEAMS_DB)[number] => Boolean(t))
    .map((team) => {
      const liveGameId = teamLiveMap.get(team.id);
      return {
        kind: 'team' as const,
        /* Logo if the team's CMS supplied one, else 2-letter initial. */
        avatar: { src: team.logoUrl, initial: team.initial },
        label: localized(team, 'name'),
        isNew: newSet.has(team.id),
        liveGame: liveGameId ? { gameId: liveGameId } : undefined,
      };
    })
    .sort((a, b) => (b.liveGame ? 1 : 0) - (a.liveGame ? 1 : 0));
  circles.push(...teamCircles);

  /* 3. Followed players — claimed first, unclaimed last */
  const playerCircles: IdentityCircleProps[] = s.followedPlayers
    .filter((pid) => !(pid === 'r1' && isPlayer))
    .map((pid) => {
      const p = ROSTER.find((x) => x.id === pid);
      if (!p) return null;
      const fullName = localized(p, 'name');
      const first = fullName.split(' ')[0];
      const isClaimedHere = !!p.claimed;
      const isUnclaimed = !isClaimedHere;
      const team = TEAMS_DB.find((t) => t.id === p.teamId);
      /* Avatar resolution per kind:
           Unclaimed → jersey number
           Claimed   → uploaded profile pic if any (else IdentityCircle
                       falls back to the gray silhouette automatically) */
      const avatar = isUnclaimed
        ? { jersey: p.number }
        : { src: p.profilePicUrl, initial: first[0] };
      return {
        kind: 'player' as const,
        avatar,
        team: team ? { src: team.logoUrl, initial: team.initial } : undefined,
        label: isUnclaimed ? t('home.playerN', { n: p.number }) : first,
        isClaimed: !isUnclaimed,
        isNew: newSet.has(first.toLowerCase()),
      };
    })
    .filter((c): c is IdentityCircleProps => Boolean(c))
    .sort((a, b) => (a.isClaimed === false ? 1 : 0) - (b.isClaimed === false ? 1 : 0));
  circles.push(...playerCircles);

  if (circles.length === 0) {
    /* Day-one empty state — non-player persona with no follows yet.
       NOT in the prototype; invented to match the visual language.
       Friendly cyan-accented invite card pointing to the Follow flow. */
    return (
      <div className="px-5 pt-2 pb-5">
        <button
          className="w-full squircle-md p-3.5 flex items-center gap-3 lg-aura"
          style={{
            background: 'var(--glass-card-bg)',
            backdropFilter: 'blur(36px) saturate(180%)',
            WebkitBackdropFilter: 'blur(36px) saturate(180%)',
            border: '1.5px dashed var(--brand-cyan-border)',
            boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top)',
          }}
        >
          <div
            className="w-10 h-10 squircle-sm flex items-center justify-center shrink-0"
            style={{
              background: 'var(--brand-cyan-soft)',
              border: '1px solid var(--brand-cyan-border)',
              color: 'var(--brand-cyan-text)',
            }}
          >
            <svg
              width={16}
              height={16}
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              style={{ width: 16, height: 16, display: 'block' }}
            >
              <path d="M7 2 V12 M2 7 H12" />
            </svg>
          </div>
          <div className="flex-1 min-w-0 text-start">
            <div className="sf text-[13.5px] font-semibold text-white leading-tight">
              {t('home.followYourTeamPlayers')}
            </div>
            <div className="sf text-[11.5px] text-white/65 mt-0.5">
              {t('home.followYourTeamPlayersSub')}
            </div>
          </div>
          <svg
            width={14}
            height={14}
            viewBox="0 0 14 14"
            fill="none"
            stroke="var(--brand-cyan-text)"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: 14, height: 14, display: 'block' }}
          >
            <path d="M5.5 2.5 L10 7 L5.5 11.5" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 px-5 pt-2 pb-5 overflow-x-auto no-scrollbar">
      {circles.map((c, i) => (
        <IdentityCircle key={i} {...c} />
      ))}
    </div>
  );
};
