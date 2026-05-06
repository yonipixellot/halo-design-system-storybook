import { EditorialDropThumb } from './EditorialDropThumb';
import { SEED_MOMENTS, useT, type Moment } from './_data';

/* Verbatim port: halo-v3.2-glass.html line 9502.
   Empty state added (not in prototype) for the day-one case where the
   user has no drops yet. */
export const DropsSection = ({
  onPick,
  moments,
}: {
  onPick?: (id: string, index: number) => void;
  /** Override the seed list — useful for stories. Defaults to the player's
      first 6 moments in SEED_MOMENTS. */
  moments?: Moment[];
}) => {
  const t = useT();
  const recent = moments ?? SEED_MOMENTS.filter((m) => m.personId === 'self').slice(0, 6);
  const isEmpty = recent.length === 0;
  return (
    <div className="mb-7">
      <div className="px-5 flex items-end justify-between mb-3">
        <div>
          <h2 className="sf-display text-[17px] font-bold tracking-[-0.015em] text-white leading-tight">
            <span className="lg-brand-dot" />
            {t('dropsThisWeek')}
          </h2>
          <p className="sf text-[12px] text-white/55 mt-0.5 ms-[14px]">
            {t('home.dropsThisWeekSubtitle')}
          </p>
        </div>
        {!isEmpty && (
          <button className="sf text-[11px] font-semibold text-halo-cyan tracking-tight">
            {t('common.all')} <span className="icon-flip-rtl">›</span>
          </button>
        )}
      </div>

      {isEmpty ? (
        /* Day-one empty state — friendly placeholder card. NOT in prototype. */
        <div className="px-5">
          <div
            className="squircle-md p-5 text-center"
            style={{
              background: 'var(--glass-card-bg)',
              backdropFilter: 'blur(36px) saturate(180%)',
              WebkitBackdropFilter: 'blur(36px) saturate(180%)',
              border: '1px solid var(--glass-card-border)',
              boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), var(--glass-card-shadow)',
            }}
          >
            <div
              className="w-12 h-12 squircle-sm mx-auto mb-3 flex items-center justify-center"
              style={{
                background: 'var(--brand-cyan-soft)',
                border: '1px solid var(--brand-cyan-border)',
                color: 'var(--brand-cyan-text)',
              }}
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: 20, height: 20, display: 'block' }}
              >
                <path d="M12 2 v20 M2 12 h20" />
                <circle cx={12} cy={12} r={9} strokeOpacity={0.45} />
              </svg>
            </div>
            <div className="sf-display text-[15px] font-bold text-white leading-tight mb-1">
              No drops yet
            </div>
            <p className="sf text-[12.5px] text-white/65 leading-relaxed max-w-[260px] mx-auto">
              Your highlights will land here after your next game.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 px-5 overflow-x-auto pb-1 no-scrollbar">
          {recent.map((m, i) => (
            <EditorialDropThumb key={m.id} moment={m} onClick={() => onPick?.(m.id, i)} />
          ))}
        </div>
      )}
    </div>
  );
};
