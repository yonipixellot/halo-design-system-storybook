import { CLIENT_EASTSIDE, useT } from './_data';

/* DivisionFilterChip — glassified replacement for halo-v3.2-glass.html
   line 10696.

   v3.2 was raw paper: `border-[1.5px] border-black bg-zinc-100 hatch`
   with a paper × button on the end. This converts it to a glass chip
   that matches the rest of the Watch surface, with a glass × dismiss
   button. Same data shape (active division + dispatch).

   Behavior preserved:
     - Renders only when `active` resolves to a division
     - "Filtered · DIVISION FULL NAME" label + sub on the end
     - × button clears the filter

   Layout: single full-width chip below the DivisionTileGrid, anim-fade in. */

export interface DivisionFilterChipProps {
  active: string | null;
  onClear: () => void;
}

export const DivisionFilterChip = ({ active, onClear }: DivisionFilterChipProps) => {
  const t = useT();
  const div = CLIENT_EASTSIDE.divisions.find((d) => d.id === active);
  if (!div) return null;
  return (
    <div className="px-4 lg:px-8 xl:px-12 pb-3 anim-fade">
      <div className="lg-glass-card squircle-sm p-2.5 flex items-center gap-2">
        <span className="sf text-[11px] tracking-[0.12em] uppercase font-bold text-white/85">
          {t('watch.filtered')} · {div.full}
        </span>
        <span className="sf ms-auto text-[10.5px] tracking-[0.10em] uppercase font-semibold text-white/55">
          {div.sub}
        </span>
        <button
          onClick={onClear}
          className="ms-1 w-6 h-6 squircle-sm lg-glass flex items-center justify-center text-white/85 text-[11px] hover:text-white"
          aria-label={t('common.dismiss', { defaultValue: 'Dismiss' })}
        >
          ✕
        </button>
      </div>
    </div>
  );
};
