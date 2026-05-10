import { cls } from '@/lib/cls';
import { CLIENT_EASTSIDE, useT } from './_data';

/* DivisionTileGrid — glassified replacement for halo-v3.2-glass.html
   line 10662.

   v3.2 was raw paper aesthetic: each tile was `border-[1.5px] border-black
   bg-white hatch` — the wireframe vocabulary that the rest of the Watch
   tab has already moved past. This keeps the same data shape and same
   layout (horizontally scrollable row of 6 division pills) but converts
   the chip surface to glass.

   Active state:
     - At rest: `lg-glass` (subtle translucent surface)
     - On active: filled cyan bg + `lg-aura` glow + cyan border. Inactive
       chips dim to opacity-40.
     - Live divisions: small red ember dot in the top-end corner, same
       behavior as v3.2 but on a glass surface.

   Sizing: 96-tall pills (was 88×66 paper tiles), narrower aspect to fit
   more chips on phone without overflow. Horizontal scroll preserved. */

export interface DivisionTileGridProps {
  active: string | null;
  setActive: (id: string | null) => void;
}

export const DivisionTileGrid = ({ active, setActive }: DivisionTileGridProps) => {
  const t = useT();
  const client = CLIENT_EASTSIDE;
  return (
    <div className="px-4 lg:px-8 xl:px-12 pt-0 lg:pt-2 pb-3">
      {/* Header: client label + division count.
          Switched from `Label`/`Caption` (font-mono wireframe primitives)
          to `sf` with proper letter-spacing so the section header reads
          as a polished UI eyebrow, not a wireframe tag. Tighter mb on
          phone (mb-2) so the pills sit closer to the hero CTA above. */}
      <div className="flex items-baseline justify-between mb-2 lg:mb-3">
        <span className="sf text-[10.5px] tracking-[0.14em] uppercase font-semibold text-white/55">
          {client.label.toUpperCase()} · {t('watch.divisionsKicker')}
        </span>
        <span className="sf text-[10.5px] tracking-[0.10em] uppercase font-semibold text-white/45 tabular-nums">
          {client.divisions.length}
        </span>
      </div>

      {/* Horizontally scrollable pill row — extends to the start gutter
          edge on phone (-mx-4 + px-4); on desktop the negative-margin
          + padding pair flips to the lg gutter so the row aligns with
          the section header instead of breaking out. */}
      <div className="flex gap-2 overflow-x-auto -mx-4 lg:-mx-8 xl:-mx-12 px-4 lg:px-8 xl:px-12 pb-1 no-scrollbar">
        {client.divisions.map((d) => {
          const isOn = active === d.id;
          const isDimmed = !!active && !isOn;
          return (
            <button
              key={d.id}
              onClick={() => setActive(isOn ? null : d.id)}
              className={cls(
                'relative shrink-0 squircle-md flex flex-col items-center justify-center text-center transition-all',
                isOn ? 'lg-aura' : 'lg-glass',
                isDimmed ? 'opacity-40' : '',
              )}
              style={{
                minWidth: 96,
                height: 64,
                paddingInline: 14,
                ...(isOn
                  ? {
                      background:
                        'radial-gradient(ellipse 80% 60% at 30% 30%, rgba(0,214,254,0.32) 0%, transparent 65%),' +
                        'linear-gradient(180deg, rgba(0,214,254,0.18) 0%, rgba(0,214,254,0.10) 100%)',
                      border: '1px solid rgba(0,214,254,0.55)',
                      boxShadow:
                        '0 0 24px -4px rgba(0,214,254,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
                    }
                  : {}),
              }}
            >
              {/* Live ember — top-end (RTL-safe) */}
              {d.live && (
                <div className="absolute top-1.5 end-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 anim-pulse" />
                </div>
              )}
              {/* Polished sans-serif treatment — was font-mono (wireframe).
                  Name uses sf-display with tight tracking; sub uses sf
                  with subtle letter-spacing for hierarchy. */}
              <span
                className={cls(
                  'sf-display text-[12.5px] font-bold tracking-tight block leading-none',
                  isOn ? 'text-white' : 'text-white/95',
                )}
              >
                {d.name}
              </span>
              <span
                className={cls(
                  'sf text-[8.5px] tracking-[0.10em] uppercase font-semibold mt-1 block leading-none',
                  isOn ? 'text-white/80' : 'text-white/50',
                )}
              >
                {d.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
