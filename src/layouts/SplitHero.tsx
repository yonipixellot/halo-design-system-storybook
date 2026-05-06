/* SplitHero — pre-login template used by Auth and both Onboarding
   orchestrators on desktop. Below lg, the brand panel is hidden and
   only the content panel renders (so phone screens are unaffected).
   At lg+ the layout becomes side-by-side: brand panel on the inline-
   start edge, content panel on the inline-end edge.

   Default split: 55/45 (brand/content). Tunable via `brandWidth`.

   Slot model:
     - `brand`    : illustration / hero copy / atmosphere (start edge)
     - `children` : the content panel (end edge — form, funnel step) */

export interface SplitHeroProps {
  brand: React.ReactNode;
  children: React.ReactNode;
  /** Brand panel width percentage at lg+. Default: 55. */
  brandWidth?: number;
  /** Constrain the content column max-width inside its panel. Default: 480. */
  contentMaxWidth?: number;
}

export const SplitHero = ({
  brand,
  children,
  brandWidth = 55,
  contentMaxWidth = 480,
}: SplitHeroProps) => {
  return (
    <div className="lg:flex lg:min-h-screen" style={{ width: '100%' }}>
      {/* Brand panel — hidden below lg */}
      <div
        className="hidden lg:flex lg:flex-col relative"
        style={{
          flexBasis: `${brandWidth}%`,
          flexShrink: 0,
          flexGrow: 0,
          background: 'var(--canvas-bg-soft)',
          borderInlineEnd: '1px solid var(--hairline)',
          overflow: 'hidden',
        }}
      >
        {brand}
      </div>

      {/* Content panel — always rendered. On phone/tablet it fills the
          viewport; on desktop it takes the remaining inline-end space. */}
      <div
        className="flex-1 min-w-0 flex flex-col"
        style={{ flexBasis: `${100 - brandWidth}%` }}
      >
        <div
          className="flex-1 flex flex-col w-full mx-auto lg:px-8 xl:px-12"
          style={{
            maxWidth: contentMaxWidth + 96, /* +96 for paddings on lg/xl */
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
