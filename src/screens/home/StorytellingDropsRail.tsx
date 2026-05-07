import { STORYTELLING_DROPS, useT, useLocalized, type Audience, type StorytellingDrop } from './_data';
import { Rail } from '@/layouts/Rail';

/* Verbatim port: halo-v3.2-glass.html line 9186 (StorytellingCard) + 9148 (Rail). */

const StorytellingCard = ({
  item,
  onOpen,
}: {
  item: StorytellingDrop;
  onOpen?: (dropId: string) => void;
}) => {
  const localized = useLocalized();
  const count = item.momentIds?.length || 3;
  const w = 240;
  const h = Math.round((w * 7) / 5); // ~336

  const hues = [
    { a: 'rgba(0,214,254,0.40)',  b: 'rgba(132,88,255,0.32)' },
    { a: 'rgba(255,90,158,0.40)', b: 'rgba(255,140,40,0.30)' },
    { a: 'rgba(74,222,128,0.36)', b: 'rgba(0,170,220,0.30)' },
    { a: 'rgba(255,210,80,0.36)', b: 'rgba(255,90,50,0.30)' },
  ];
  const h1 = item.id ? item.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length : 0;
  const hue = hues[h1];

  return (
    <button
      onClick={() => onOpen?.(item.id)}
      className="relative shrink-0 overflow-hidden text-start squircle-md lg-aura lg-shine"
      style={{
        width: w,
        height: h,
        background:
          `radial-gradient(ellipse 80% 60% at 25% 25%, ${hue.a} 0%, transparent 60%),` +
          `radial-gradient(ellipse 80% 60% at 80% 75%, ${hue.b} 0%, transparent 60%),` +
          'linear-gradient(180deg, var(--card-base-strong-top) 0%, var(--card-base-strong-bot) 100%)',
        border: '1px solid var(--glass-card-border)',
        backdropFilter: 'blur(36px) saturate(180%)',
        WebkitBackdropFilter: 'blur(36px) saturate(180%)',
        boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), var(--glass-card-shadow)',
      }}
    >
      <div className="absolute inset-0 hatch opacity-40" />

      {/* Story chip top-left */}
      <div className="absolute top-3 start-3 lg-glass-strong squircle-sm px-2 py-0.5 flex items-center gap-1.5 z-10">
        <span
          className="w-1.5 h-1.5 rounded-full bg-halo-cyan anim-pulse-dot"
          style={{ boxShadow: '0 0 6px rgba(0,214,254,0.8)' }}
        />
        <span className="sf text-[9.5px] font-bold tracking-[0.14em] uppercase text-white leading-none">
          Story
        </span>
      </div>

      {/* Moment count chip top-right */}
      <div className="absolute top-3 end-3 lg-glass squircle-sm px-2 py-0.5 z-10">
        <span className="sf text-[10px] font-semibold text-white/85 leading-none tabular-nums">
          {count} moments
        </span>
      </div>

      {/* Stacked-cards centerpiece */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: 110, height: 130 }}>
          <div
            className="absolute lg-glass squircle-sm"
            style={{ top: 8, insetInlineStart: 28, width: 64, height: 92, transform: 'rotate(8deg)', opacity: 0.55 }}
          />
          <div
            className="absolute lg-glass-card squircle-sm"
            style={{ top: 4, insetInlineStart: 18, width: 64, height: 100, transform: 'rotate(-3deg)', opacity: 0.85 }}
          />
          <div
            className="absolute lg-glass-strong squircle-sm flex flex-col items-center justify-center"
            style={{ top: 0, insetInlineStart: 8, width: 64, height: 110 }}
          >
            <div className="sf-display text-[24px] font-bold text-white leading-none">{count}</div>
            <div className="sf text-[8.5px] tracking-[0.16em] uppercase font-bold text-white/65 mt-1.5">
              Moments
            </div>
          </div>
        </div>
      </div>

      {/* Bottom info block */}
      <div
        className="absolute bottom-0 inset-x-0 px-4 pt-14 pb-4 z-10"
        style={{
          background:
            'linear-gradient(180deg, var(--bottom-fade-start) 0%, var(--bottom-fade-mid) 60%, var(--bottom-fade-end) 100%)',
        }}
      >
        <div className="sf-display text-white text-[14px] font-bold leading-tight tracking-[-0.01em] mb-1.5 clip2">
          {localized(item, 'title')}
        </div>
        <div className="sf text-white/70 text-[11px] leading-snug clip2">{localized(item, 'body')}</div>
      </div>
    </button>
  );
};

export const StorytellingDropsRail = ({
  audience = 'player',
  onOpen,
}: {
  audience?: Audience;
  /** Fired when a card is tapped — Home wires this to open
      StorytellingDropViewer with the drop's id. */
  onOpen?: (dropId: string) => void;
}) => {
  const t = useT();
  const items = STORYTELLING_DROPS[audience] || [];
  if (!items.length) return null;
  return (
    <div className="mb-7">
      <div className="px-5 lg:px-8 xl:px-12 mb-3 flex items-end justify-between">
        <div>
          <h2 className="sf-display text-[17px] font-bold tracking-[-0.015em] text-white leading-tight">
            <span className="lg-brand-dot" />
            {t('storytellingDrops')}
          </h2>
          <p className="sf text-[12px] text-white/55 mt-0.5 ms-[14px]">
            {t('home.storytellingDropsSubtitle')}
          </p>
        </div>
        <button className="sf text-[11px] font-semibold text-halo-cyan tracking-tight">
          {t('common.all')} <span className="icon-flip-rtl">›</span>
        </button>
      </div>
      <Rail className="px-5 lg:px-8 xl:px-12">
        {items.map((item) => (
          <StorytellingCard key={item.id} item={item} onOpen={onOpen} />
        ))}
      </Rail>
    </div>
  );
};
