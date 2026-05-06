import { TEAM_RECAPS, useT, useLocalized, type RecapKind } from './_data';
import { Rail } from '@/layouts/Rail';

const fmtDur = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
};

const kindHue: Record<RecapKind, { a: string; b: string; tag: string }> = {
  'full-recap': { a: 'rgba(0,170,220,0.40)',  b: 'rgba(0,214,254,0.30)',  tag: 'RECAP' },
  'top-plays':  { a: 'rgba(255,140,40,0.45)', b: 'rgba(255,90,158,0.30)', tag: 'TOP PLAYS' },
  'comeback':   { a: 'rgba(132,88,255,0.42)', b: 'rgba(0,214,254,0.30)',  tag: 'COMEBACK' },
};

/* Verbatim port: halo-v3.2-glass.html line 9563. */
export const TeamMomentsRail = () => {
  const t = useT();
  const localized = useLocalized();
  return (
    <div className="mb-7">
      <div className="px-5 mb-3 flex items-end justify-between">
        <div>
          <h2 className="sf-display text-[17px] font-bold tracking-[-0.015em] text-white leading-tight">
            {t('teamMoments')}
          </h2>
          <p className="sf text-[12px] text-white/55 mt-0.5">{t('home.teamMomentsSubtitle')}</p>
        </div>
        <button className="sf text-[11px] font-semibold text-halo-cyan tracking-tight">
          {t('common.watch')} <span className="icon-flip-rtl">›</span>
        </button>
      </div>
      <Rail className="px-5 lg:px-8 xl:px-12">
        {TEAM_RECAPS.map((r) => {
          const w = 280;
          const h = Math.round((w * 9) / 16); // ~158
          const hue = kindHue[r.kind] || kindHue['full-recap'];
          return (
            <button
              key={r.id}
              className="relative shrink-0 overflow-hidden text-start squircle-md lg-aura lg-shine"
              style={{
                width: w,
                height: h,
                background:
                  `radial-gradient(ellipse 75% 65% at 25% 25%, ${hue.a} 0%, transparent 60%),` +
                  `radial-gradient(ellipse 75% 65% at 80% 80%, ${hue.b} 0%, transparent 60%),` +
                  'linear-gradient(180deg, var(--card-base-soft-top) 0%, var(--card-base-soft-bot) 100%)',
                border: '1px solid var(--glass-card-border)',
                backdropFilter: 'blur(36px) saturate(180%)',
                WebkitBackdropFilter: 'blur(36px) saturate(180%)',
                boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), var(--glass-card-shadow)',
              }}
            >
              <div className="absolute inset-0 hatch opacity-40" />
              <div className="absolute top-3 start-3 lg-glass-strong squircle-sm px-2 py-0.5 z-10">
                <span className="sf text-[9.5px] font-bold tracking-[0.16em] uppercase text-white leading-none">
                  {hue.tag}
                </span>
              </div>
              {r.duration && (
                <div className="absolute top-3 end-3 lg-glass squircle-sm px-2 py-0.5 z-10">
                  <span className="sf text-[10px] font-semibold text-white/85 leading-none tabular-nums">
                    {fmtDur(r.duration)}
                  </span>
                </div>
              )}
              {/* Centered play glyph */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-12 h-12 rounded-full lg-glass-strong flex items-center justify-center">
                  <svg width={14} height={16} viewBox="0 0 12 14" fill="currentColor" className="text-white ms-0.5" aria-hidden="true">
                    <path d="M0 1.2v11.6c0 .9 1 1.4 1.7 1l9.6-5.8c.7-.4.7-1.5 0-1.9L1.7.2C1 -.2 0 .3 0 1.2z" />
                  </svg>
                </div>
              </div>
              {/* Bottom info */}
              <div
                className="absolute bottom-0 inset-x-0 px-3 pt-10 pb-3 z-10"
                style={{
                  background:
                    'linear-gradient(180deg, var(--bottom-fade-start) 0%, var(--bottom-fade-mid) 60%, var(--bottom-fade-end) 100%)',
                }}
              >
                <div className="sf-display text-white text-[13.5px] font-bold leading-tight tracking-[-0.01em] mb-0.5">
                  {localized(r, 'title')}
                </div>
                <div className="sf text-white/65 text-[10.5px] leading-snug truncate">{localized(r, 'sub')}</div>
              </div>
            </button>
          );
        })}
      </Rail>
    </div>
  );
};
