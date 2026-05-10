import { useMemo } from 'react';
import { cls } from '@/lib/cls';
import { SEED_WATCH_GAMES, useT, type WatchGame } from './_data';

/* WatchSearchInput — glass search field + autocomplete dropdown.

   Extracted from WatchScreen so phone (in-flow under sticky header)
   and desktop (centered in WatchShell top bar) share the same input
   markup, autocomplete rules, and result-card design. State (the
   query string) is owned by WatchScreen and passed down so both
   instances stay in sync. */

export interface WatchSearchInputProps {
  query: string;
  setQuery: (q: string) => void;
  onPick?: (gameId: string, status: WatchGame['status']) => void;
  /** Visual variant — `phone` uses the original full-width input;
      `desktop` uses a centered, capped-width treatment for the top bar. */
  variant?: 'phone' | 'desktop';
}

export const WatchSearchInput = ({
  query,
  setQuery,
  onPick,
  variant = 'phone',
}: WatchSearchInputProps) => {
  const t = useT();
  const isSearching = query.length > 0;
  const suggestions = useMemo(() => {
    if (!isSearching) return [];
    const q = query.toLowerCase();
    return SEED_WATCH_GAMES.filter((g) =>
      `${g.home} ${g.away}`.toLowerCase().includes(q),
    ).slice(0, 6);
  }, [query, isSearching]);

  const inputClass =
    variant === 'desktop'
      ? 'w-full ps-10 pe-10 py-2 squircle-md text-[14px] outline-none text-white placeholder:text-white/55 lg-glass sf'
      : 'w-full ps-10 pe-10 py-3 squircle-md text-[15px] outline-none text-white placeholder:text-white/45 lg-glass sf';

  return (
    <div className={cls('relative', variant === 'desktop' && 'mx-auto max-w-[440px]')}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('watch.searchPlaceholder')}
        className={inputClass}
      />
      <span className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[16px] text-white/70 pointer-events-none">
        ⌕
      </span>
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute end-3 top-1/2 -translate-y-1/2 text-[13px] text-white/70 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Clear"
        >
          ✕
        </button>
      )}

      {/* Autocomplete dropdown */}
      {isSearching && (
        <div className="absolute start-0 end-0 top-[calc(100%+8px)] z-30 lg-glass-card squircle-md overflow-hidden anim-fade">
          {suggestions.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <span className="sf text-[10.5px] tracking-[0.14em] uppercase font-semibold text-white/55">
                {t('watch.noMatches')}
              </span>
            </div>
          ) : (
            suggestions.map((g, i) => (
              <button
                key={g.id}
                onClick={() => {
                  setQuery('');
                  onPick?.(g.id, g.status);
                }}
                className={cls(
                  'w-full px-3 py-2.5 flex items-center gap-3 text-start hover:bg-white/5',
                  i < suggestions.length - 1 ? 'border-b border-white/10' : '',
                )}
              >
                <div
                  className={cls(
                    'w-1.5 h-1.5 rounded-full shrink-0',
                    g.status === 'live'
                      ? 'bg-red-500 anim-pulse'
                      : g.status === 'upcoming'
                        ? 'bg-white/40'
                        : 'bg-white/20',
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="sf text-[13px] font-semibold text-white truncate text-start">
                    {g.home} vs {g.away}
                  </div>
                  <span className="sf text-[10px] tracking-[0.12em] uppercase font-semibold text-white/55">
                    {g.status === 'live'
                      ? `LIVE · ${g.period} · ${g.scoreHome}–${g.scoreAway}`
                      : g.status === 'upcoming'
                        ? 'UPCOMING'
                        : `FINAL · ${g.scoreHome}–${g.scoreAway}`}
                  </span>
                </div>
                <span className="text-[12px] text-white/40">›</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
