import { SEED_GAMES, fmt, useT, type FollowState } from './_data';

/* Verbatim port: halo-v3.2-glass.html line 7575 */

export const FollowingStrip = ({ s }: { s: FollowState }) => {
  const t = useT();
  if (s.followedTeams.length === 0 && s.followedPlayers.length === 0) return null;
  const upcomingFollowed = SEED_GAMES.filter(
    (g) => g.status === 'upcoming' && s.followedTeams.includes(g.teamId),
  ).slice(0, 4);
  if (upcomingFollowed.length === 0) return null;

  return (
    <div className="mb-7">
      <div className="px-5 mb-3 flex items-end justify-between">
        <div>
          <h2 className="sf-display text-[17px] font-bold tracking-[-0.015em] text-white leading-tight">
            {t('followingUpcoming')}
          </h2>
          <p className="sf text-[12px] text-white/55 mt-0.5">Tipoffs from your followed teams</p>
        </div>
        <button className="sf text-[11px] font-semibold text-halo-cyan tracking-tight">
          Manage <span>›</span>
        </button>
      </div>
      <div className="flex gap-3 px-5 overflow-x-auto pb-1 no-scrollbar">
        {upcomingFollowed.map((g) => (
          <button
            key={g.id}
            className="shrink-0 squircle-md overflow-hidden text-left lg-aura lg-shine relative"
            style={{
              width: 240,
              height: 120,
              background: 'linear-gradient(160deg, var(--card-base-soft-top) 0%, var(--card-base-soft-bot) 100%)',
              border: '1px solid var(--glass-card-border)',
              backdropFilter: 'blur(36px) saturate(180%)',
              WebkitBackdropFilter: 'blur(36px) saturate(180%)',
              boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), var(--glass-card-shadow)',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 70% 60% at 30% 25%, rgba(0,214,254,0.15) 0%, transparent 60%),' +
                  'radial-gradient(ellipse 70% 60% at 80% 70%, rgba(132,88,255,0.12) 0%, transparent 60%)',
              }}
            />
            <div className="absolute top-3 left-3 lg-glass squircle-sm px-2 py-0.5">
              <span className="sf text-[9.5px] font-semibold tracking-[0.12em] uppercase text-white/85 leading-none">
                Upcoming
              </span>
            </div>
            <div
              className="absolute inset-x-0 bottom-0 px-3.5 pt-8 pb-3"
              style={{
                background:
                  'linear-gradient(180deg, var(--bottom-fade-start) 0%, var(--bottom-fade-mid) 70%, var(--bottom-fade-end) 100%)',
              }}
            >
              <div className="sf-display text-[14px] font-bold text-white leading-tight tracking-[-0.01em] truncate">
                {g.home} vs {g.away}
              </div>
              <div className="sf text-[11px] text-white/65 mt-0.5">
                Tipoff {fmt.countdown(g.kickoffInSec)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
