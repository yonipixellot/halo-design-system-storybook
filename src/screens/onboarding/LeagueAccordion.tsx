import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cls } from '@/lib/cls';
import { TEAMS_DB, LEAGUES, type League } from './_data';
import { useLocalized } from '@/screens/home/_data';

/* LeagueAccordion — collapsible list of leagues for TeamsStep.
   May 2026 product call:
     - Single-open accordion (tapping a header collapses the previous).
     - Search filter auto-expands every league with a matching team.
     - Each header has a "Follow all" quick-action that toggles every team
       in the league at once.
     - Body lists teams alphabetically (by localized name).
     - Selection state lives upstream — this component is controlled. */

export interface LeagueAccordionProps {
  /** Currently-selected team ids. */
  chosen: string[];
  /** Toggle a single team id. */
  toggle: (id: string) => void;
  /** Replace the entire selection with these ids. Used by "follow all" /
      "unfollow all" so the accordion doesn't have to call toggle in a
      loop. */
  setChosen: (ids: string[]) => void;
  /** Search query — passed in by parent so the search input lives in the
      step header (consistent with other onboarding screens). */
  query?: string;
  /** Override LEAGUES for stories/tests. Defaults to the seed data. */
  leagues?: League[];
}

export const LeagueAccordion = ({
  chosen,
  toggle,
  setChosen,
  query = '',
  leagues = LEAGUES,
}: LeagueAccordionProps) => {
  const { t } = useTranslation();
  const localized = useLocalized();
  /* Single open league — null = all collapsed. */
  const [openId, setOpenId] = useState<string | null>(null);

  /* Resolve league teams once per query change. Sort alphabetically by
     localized name for stable order across languages. */
  const resolved = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leagues.map((league) => {
      const allTeams = league.teamIds
        .map((id) => TEAMS_DB.find((t) => t.id === id))
        .filter((t): t is (typeof TEAMS_DB)[number] => Boolean(t));
      const matches = q
        ? allTeams.filter((team) => {
            const name = (localized(team, 'name') || team.name || '').toLowerCase();
            const org = (localized(team, 'org') || team.org || '').toLowerCase();
            return name.includes(q) || org.includes(q);
          })
        : allTeams;
      const sorted = [...matches].sort((a, b) =>
        localized(a, 'name').localeCompare(localized(b, 'name'), undefined, { sensitivity: 'base' }),
      );
      return { league, allTeams, teams: sorted };
    });
  }, [leagues, query, localized]);

  /* Auto-expand the first league that contains a matching team while
     searching. Only re-runs when `query` changes — depending on
     `resolved` would cause an infinite reset loop because `localized`
     returns a fresh function reference every render, which makes
     `resolved` look "new" to React. */
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    /* Compute the first matching league inline so we can keep the
       dep array minimal (`query` + `leagues` only). */
    const firstMatch = leagues.find((league) =>
      league.teamIds.some((id) => {
        const team = TEAMS_DB.find((tm) => tm.id === id);
        if (!team) return false;
        const name = (team.name || '').toLowerCase();
        const org = (team.org || '').toLowerCase();
        const nameHe = (team.name_he || '').toLowerCase();
        const orgHe = (team.org_he || '').toLowerCase();
        return name.includes(q) || org.includes(q) || nameHe.includes(q) || orgHe.includes(q);
      }),
    );
    if (firstMatch) setOpenId(firstMatch.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, leagues]);

  return (
    <div className="space-y-2">
      {resolved.map(({ league, allTeams, teams }) => {
        const isOpen = openId === league.id;
        const allSelected =
          allTeams.length > 0 && allTeams.every((tm) => chosen.includes(tm.id));
        const someSelected = allTeams.some((tm) => chosen.includes(tm.id));
        const matchCount = teams.length;
        const isFiltered = query.trim().length > 0;
        /* Hide leagues with zero matches when filtering. */
        if (isFiltered && matchCount === 0) return null;

        const onToggleHeader = () => {
          setOpenId(isOpen ? null : league.id);
        };

        const onFollowAll = () => {
          if (allSelected) {
            /* Currently fully selected → unfollow all in this league. */
            const remaining = chosen.filter(
              (id) => !league.teamIds.includes(id),
            );
            setChosen(remaining);
          } else {
            /* Add any of this league's teams not already chosen. */
            const merged = Array.from(new Set([...chosen, ...league.teamIds]));
            setChosen(merged);
          }
        };

        return (
          <div key={league.id} className="overflow-hidden squircle-md">
            {/* Header */}
            <button
              type="button"
              onClick={onToggleHeader}
              aria-expanded={isOpen}
              aria-controls={`league-body-${league.id}`}
              className={cls(
                'w-full text-start px-3.5 py-3.5 flex items-center gap-3 lg-aura',
                isOpen ? '' : 'lg-shine',
              )}
              style={{
                background: someSelected
                  ? 'rgba(0,214,254,0.07)'
                  : 'var(--glass-card-bg)',
                backdropFilter: 'blur(36px) saturate(180%)',
                WebkitBackdropFilter: 'blur(36px) saturate(180%)',
                border: someSelected
                  ? '1px solid rgba(0,214,254,0.40)'
                  : '1px solid var(--glass-card-border)',
                borderEndStartRadius: isOpen ? 0 : undefined,
                borderEndEndRadius: isOpen ? 0 : undefined,
              }}
            >
              {/* League "icon well" — uses initials of the league name */}
              <div
                className="w-11 h-11 squircle-sm flex items-center justify-center shrink-0"
                style={{
                  background: 'var(--brand-cyan-soft)',
                  border: '1px solid var(--brand-cyan-border)',
                  color: 'var(--brand-cyan-text)',
                }}
              >
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: 20, height: 20, display: 'block' }}
                >
                  {/* Small trophy / shield silhouette — generic league mark */}
                  <path d="M5 3 h10 v4 a5 5 0 0 1 -10 0 Z M8 13 h4 M9 13 v3 M11 13 v3 M7 17 h6" />
                </svg>
              </div>

              {/* Title block */}
              <div className="flex-1 min-w-0">
                <div className="sf-display text-[14.5px] font-bold leading-tight tracking-[-0.01em] truncate" style={{ color: 'var(--text-primary)' }}>
                  {localized(league, 'name')}
                </div>
                <div className="sf text-[11.5px] mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>
                  {league.sub ? localized(league, 'sub') + ' · ' : ''}
                  {t('leagues.teamsCount', { count: allTeams.length })}
                  {someSelected && !isFiltered ? ` · ${chosen.filter((id) => league.teamIds.includes(id)).length} ${t('leagues.followed')}` : ''}
                  {isFiltered ? ` · ${matchCount} ${t('leagues.matches')}` : ''}
                </div>
              </div>

              {/* Chevron — rotates when open */}
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

            {/* Body — only mounted when open. */}
            {isOpen && (
              <div
                id={`league-body-${league.id}`}
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
                {allTeams.length > 1 && (
                  <div className="px-3.5 pt-3 pb-2 flex items-center justify-between">
                    <span
                      className="sf text-[11px] tracking-[0.10em] uppercase font-bold"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {t('leagues.allTeams')}
                    </span>
                    <button
                      type="button"
                      onClick={onFollowAll}
                      className="squircle-sm px-3 py-1.5 sf text-[11.5px] font-semibold lg-aura"
                      style={{
                        background: allSelected
                          ? 'var(--brand-cyan)'
                          : 'var(--brand-cyan-soft)',
                        color: allSelected ? '#000' : 'var(--brand-cyan-text)',
                        border: '1px solid var(--brand-cyan-border)',
                      }}
                    >
                      {allSelected
                        ? t('leagues.unfollowAll')
                        : t('leagues.followAll', { count: allTeams.length })}
                    </button>
                  </div>
                )}

                {/* Team rows */}
                <div className="px-2 pb-2">
                  {teams.map((team) => {
                    const active = chosen.includes(team.id);
                    return (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => toggle(team.id)}
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
                        <div className="w-9 h-9 squircle-sm lg-glass-strong flex items-center justify-center shrink-0">
                          <span className="sf-display text-[11px] font-bold text-white">
                            {team.initial}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="sf-display text-[13.5px] font-bold leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
                            {localized(team, 'name')}
                          </div>
                          <div
                            className="sf text-[10.5px] mt-0.5 truncate"
                            style={{ color: 'var(--text-tertiary)' }}
                          >
                            {localized(team, 'org')} · {team.division}
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
