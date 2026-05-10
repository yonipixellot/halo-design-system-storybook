import { VThumb } from './_shared';
import { useT } from './_data';
import type { Moment } from '@/screens/home/_data';

/* PlayerHighlightsRail — vertical (9:16) clip thumbnails.

   Port of halo-v3.2-glass.html line 10755 with two persona modes:
     - 'self'   — title "Player highlights" — moments from the current
                  user (filtered upstream to personId === 'self')
     - 'follows' — title "From players you follow" — moments from
                   followed players. If empty, render an empty-state
                   card instead of the rail (Fan day-one).

   Both modes share the same VThumb-rail layout. */

export interface PlayerHighlightsRailProps {
  moments: Moment[];
  variant?: 'self' | 'follows';
  onPick?: (id: string, index: number) => void;
  onAll?: () => void;
}

export const PlayerHighlightsRail = ({
  moments,
  variant = 'self',
  onPick,
  onAll,
}: PlayerHighlightsRailProps) => {
  const t = useT();
  const title = variant === 'follows' ? t('watch.fromYourFollows') : t('watch.playerHighlights');

  if (moments.length === 0) {
    /* Fan day-one empty state — only rendered when variant='follows' */
    return (
      <div className="px-4 lg:px-8 xl:px-12 mb-7">
        <div className="lg-glass-card squircle-md p-5 text-center lg:max-w-[480px] lg:mx-auto">
          <div className="sf-display text-white text-[14px] font-bold mb-1.5">
            {t('watch.noFollowsTitle')}
          </div>
          <div className="sf text-white/60 text-[12px] leading-relaxed">
            {t('watch.noFollowsSub')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="px-4 lg:px-8 xl:px-12 mb-3 flex items-baseline justify-between">
        <span className="sf-display text-[20px] lg:text-[22px] font-bold text-white tracking-[-0.02em]">
          {title}
        </span>
        <button
          onClick={onAll}
          className="text-[13px] font-semibold sf flex items-center gap-0.5 transition-colors hover:opacity-80"
          style={{ color: '#00D6FE' }}
        >
          {t('watch.all')} <span className="text-[14px]">›</span>
        </button>
      </div>
      <div className="flex gap-2 lg:gap-3 px-4 lg:px-8 xl:px-12 overflow-x-auto no-scrollbar pb-1">
        {moments.map((m, i) => (
          <VThumb
            key={m.id}
            moment={m}
            size="md"
            onClick={() => onPick?.(m.id, i)}
          />
        ))}
      </div>
    </div>
  );
};
