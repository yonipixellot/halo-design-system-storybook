import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cls } from '@/lib/cls';
import { TEAMS_DB, ROSTER } from './_data';
import { useLocalized } from '@/screens/home/_data';

/* TeamRosterAccordion — collapsible team list for the player picker.
   Mirrors the LeagueAccordion pattern (May 2026 product call):
     - Single-open accordion
     - Search auto-expands the first team with a matching player name
     - "Follow all N" CTA on each header (replaces selection wholesale)
     - Roster sorted by jersey number ascending
     - Only the teams in `teamIds` (passed by parent — typically the
       teams the user followed in step 2) appear

   Selection state lives upstream via `chosen` / `togglePlayer` /
   `setChosen` so PlayersStep can keep its existing reducer shape. */

export interface TeamRosterAccordionProps {
  /** IDs of teams to show, in the order they should appear. Typically
      sourced from step 2's followed teams. */
  teamIds: string[];
  /** Map of playerId → followed boolean (PlayersStep already uses this
      shape). Drives the per-row checked state and header counts. */
  chosenPlayers: Record<string, boolean>;
  togglePlayer: (id: string) => void;
  /** Replace the whole `chosenPlayers` map. Used by "Follow all" /
      "Unfollow all" so the accordion can flip many ids at once
      atomically. */
  setChosenPlayers: (next: Record<string, boolean>) => void;
  /** Search query — typed into the parent's input. */
  query?: string;
}

export const TeamRosterAccordion = ({
  teamIds,
  chosenPlayers,
  togglePlayer,
  setChosenPlayers,
  query = '',
}: TeamRosterAccordionProps) => {
  const { t } = useTranslation();
  const localized = useLocalized();
  const [openId, setOpenId] = useState<string | null>(null);

  /* Resolve { team, allRoster, filteredRoster } per team, alphabetical
     by jersey number. Recomputed when query / teamIds change. */
  const resolved = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teamIds
      .map((tid) => {
        const team = TEAMS_DB.find((t) => t.id === tid);
        if (!team) return null;
        const allRoster = ROSTER.filter((p) => p.teamId === tid);
        const matches = q
          ? allRoster.filter((p) => {
              const name = (localized(p, 'name') || p.name || '').toLowerCase();
              const pos = (p.position || '').toLowerCase();
              const num = String(p.number);
              return name.includes(q) || pos.includes(q) || num.includes(q);
            })
          : allRoster;
        const sorted = [...matches].sort((a, b) => a.number - b.number);
        return { team, allRoster, roster: sorted };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [teamIds, query, localized]);

  /* Auto-expand the first team that contains a matching player while
     searching. Same minimal-deps pattern as LeagueAccordion. */
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const firstMatch = teamIds.find((tid) => {
      const allRoster = ROSTER.filter((p) => p.teamId === tid);
      return allRoster.some((p) => {
        const name = (p.name || '').toLowerCase();
        const nameHe = (p.name_he || '').toLowerCase();
        const pos = (p.position || '').toLowerCase();
        const num = String(p.number);
        return (
          name.includes(q) ||
          nameHe.includes(q) ||
          pos.includes(q) ||
          num.includes(q)
        );
      });
    });
    if (firstMatch) setOpenId(firstMatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, teamIds]);

  if (teamIds.length === 0) {
    return (
      <div
        className="squircle-md p-5 text-center"
        style={{
          background: 'var(--glass-card-bg)',
          backdropFilter: 'blur(36px) saturate(180%)',
          WebkitBackdropFilter: 'blur(36px) saturate(180%)',
          border: '1px solid var(--glass-card-border)',
        }}
      >
        <div className="sf text-[12.5px]" style={{ color: 'var(--text-tertiary)' }}>
          {t('roster.noTeamsYet')}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {resolved.map(({ team, allRoster, roster }) => {
        const isOpen = openId === team.id;
        const allRosterIds = allRoster.map((p) => p.id);
        const followedFromTeam = allRosterIds.filter((id) => chosenPlayers[id]).length;
        const allFollowed = allRoster.length > 0 && followedFromTeam === allRoster.length;
        const someFollowed = followedFromTeam > 0;
        const matchCount = roster.length;
        const isFiltered = query.trim().length > 0;
        if (isFiltered && matchCount === 0) return null;

        const onToggleHeader = () => {
          setOpenId(isOpen ? null : team.id);
        };

        const onFollowAll = () => {
          const next = { ...chosenPlayers };
          if (allFollowed) {
            allRosterIds.forEach((id) => {
              next[id] = false;
            });
          } else {
            allRosterIds.forEach((id) => {
              next[id] = true;
            });
          }
          setChosenPlayers(next);
        };

        return (
          <div key={team.id} className="overflow-hidden squircle-md">
            {/* Header */}
            <button
              type="button"
              onClick={onToggleHeader}
              aria-expanded={isOpen}
              aria-controls={`team-roster-${team.id}`}
              className={cls(
                'w-full text-start px-3.5 py-3.5 flex items-center gap-3 lg-aura',
                isOpen ? '' : 'lg-shine',
              )}
              style={{
                background: someFollowed
                  ? 'rgba(0,214,254,0.07)'
                  : 'var(--glass-card-bg)',
                backdropFilter: 'blur(36px) saturate(180%)',
                WebkitBackdropFilter: 'blur(36px) saturate(180%)',
                border: someFollowed
                  ? '1px solid rgba(0,214,254,0.40)'
                  : '1px solid var(--glass-card-border)',
                borderEndStartRadius: isOpen ? 0 : undefined,
                borderEndEndRadius: isOpen ? 0 : undefined,
              }}
            >
              {/* Team initials well */}
              <div className="w-11 h-11 squircle-sm lg-glass-strong flex items-center justify-center shrink-0">
                <span className="sf-display text-[13px] font-bold text-white">
                  {team.initial}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="sf-display text-[14.5px] font-bold leading-tight tracking-[-0.01em] truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {localized(team, 'name')}
                </div>
                <div
                  className="sf text-[11.5px] mt-0.5 truncate"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {localized(team, 'org')} ·{' '}
                  {t('roster.playersCount', { count: allRoster.length })}
                  {someFollowed && !isFiltered
                    ? ` · ${followedFromTeam} ${t('leagues.followed')}`
                    : ''}
                  {isFiltered ? ` · ${matchCount} ${t('leagues.matches')}` : ''}
                </div>
              </div>
              <svg
                width={14}
                height={14}
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 transition-transform duration-200"
                style={{
                  width: 14,
                  height: 14,
                  display: 'block',
                  color: 'var(--text-tertiary)',
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              >
                <path d="M5 3 L10 7 L5 11" />
              </svg>
            </button>

            {/* Body */}
            {isOpen && (
              <div
                id={`team-roster-${team.id}`}
                className="anim-fade"
                style={{
                  background: 'var(--canvas-bg-soft)',
                  borderInlineStart: '1px solid var(--glass-card-border)',
                  borderInlineEnd: '1px solid var(--glass-card-border)',
                  borderBlockEnd: '1px solid var(--glass-card-border)',
                  borderEndStartRadius: 'var(--squircle-md, 18px)',
                  borderEndEndRadius: 'var(--squircle-md, 18px)',
                }}
              >
                {/* Bulk follow CTA */}
                {allRoster.length > 1 && (
                  <div className="px-3.5 pt-3 pb-2 flex items-center justify-between">
                    <span
                      className="sf text-[11px] tracking-[0.10em] uppercase font-bold"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {t('roster.allPlayers')}
                    </span>
                    <button
                      type="button"
                      onClick={onFollowAll}
                      className="squircle-sm px-3 py-1.5 sf text-[11.5px] font-semibold lg-aura"
                      style={{
                        background: allFollowed
                          ? 'var(--brand-cyan)'
                          : 'var(--brand-cyan-soft)',
                        color: allFollowed ? '#000' : 'var(--brand-cyan-text)',
                        border: '1px solid var(--brand-cyan-border)',
                      }}
                    >
                      {allFollowed
                        ? t('leagues.unfollowAll')
                        : t('leagues.followAll', { count: allRoster.length })}
                    </button>
                  </div>
                )}

                {/* Empty roster state */}
                {allRoster.length === 0 && (
                  <div className="px-4 py-5 text-center">
                    <div
                      className="sf text-[12px]"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {t('roster.empty')}
                    </div>
                  </div>
                )}

                {/* Player rows — sorted by jersey # ascending */}
                <div className="px-2 pb-2">
                  {roster.map((p) => {
                    const active = !!chosenPlayers[p.id];
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePlayer(p.id)}
                        aria-pressed={active}
                        className="w-full text-start squircle-sm p-2.5 flex items-center gap-3 lg-aura"
                        style={{
                          background: active ? 'rgba(0,214,254,0.10)' : 'transparent',
                          border: active
                            ? '1px solid rgba(0,214,254,0.40)'
                            : '1px solid transparent',
                          marginBlockEnd: 4,
                        }}
                      >
                        {/* Jersey badge — number stays the visual anchor */}
                        <div className="w-10 h-10 squircle-sm lg-glass-strong flex flex-col items-center justify-center shrink-0">
                          <span
                            className="sf text-[7.5px] tracking-[0.16em] uppercase font-bold leading-none"
                            style={{ color: 'var(--text-tertiary)' }}
                          >
                            {t('roster.no')}
                          </span>
                          <span className="sf-display text-[13px] font-bold tabular-nums text-white leading-none mt-0.5">
                            {p.number}
                          </span>
                        </div>
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
                            {p.claimed && (
                              <>
                                {' · '}
                                <span style={{ color: 'var(--brand-cyan-text)' }}>
                                  {t('roster.claimed')}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={
                            active
                              ? { background: 'var(--brand-cyan)' }
                              : {
                                  background: 'var(--hatch-grain)',
                                  border: '1px solid var(--hairline-strong)',
                                }
                          }
                        >
                          {active && (
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
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
