import type { ReactNode } from 'react';

/* MomentCanvas — desktop layout for "intimate moment" screens
   (PlayerInviteEntry, NotifUpsell, persona picker hero, etc.).

   Below lg: passthrough — children render full-bleed exactly as before
   so the existing phone treatment is preserved.

   At lg+: atmosphere fills the canvas, a glass card (max-w-[560px])
   floats centered, and the moment's content lives inside. The card is
   wider than AuthCanvas because moment screens carry a hero element
   (coach disc, bell, persona avatars) that wants more room than a
   form column.

   The atmosphere is rendered HERE — pages should NOT render their own
   lg-atmosphere when wrapped in MomentCanvas (it would double-up).
   The phone-side atmosphere is left to the page so phone screens that
   already render their own lg-atmosphere still work. The phone path is
   currently a passthrough; if the page didn't render its own
   atmosphere on phone, MomentCanvas does that too via the
   phoneAtmosphere prop. */

export interface MomentCanvasProps {
  children: ReactNode;
  /** Render an lg-atmosphere on phone too (default: false — pages
      typically render their own). */
  phoneAtmosphere?: boolean;
  /** Outer content max-width at lg+. Atmosphere is always full canvas;
      this caps the content frame so the moment card stays anchored
      inside a 1200 box rather than drifting on 1920+ voids. Default
      1200, matches HomeShell. Pass 'full' to opt out. */
  contentMaxWidth?: number | 'full';
}

export const MomentCanvas = ({
  children,
  phoneAtmosphere = false,
  contentMaxWidth = 1200,
}: MomentCanvasProps) => (
  <div
    className="relative w-full lg:min-h-screen"
    style={{ minHeight: '100%' }}
  >
    {/* Atmosphere layer — full canvas at lg+, optionally on phone */}
    <div className={phoneAtmosphere ? 'block' : 'hidden lg:block'}>
      <div className="lg-atmosphere" />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, var(--vignette-corner) 0%, transparent 30%, transparent 70%, var(--vignette-corner-soft) 100%)',
        }}
      />
    </div>

    {/* Content frame — capped at contentMaxWidth and centered. The glass
        card lives inside this frame; the atmosphere outside continues
        edge-to-edge. */}
    <div
      className="relative z-10 lg:mx-auto lg:flex lg:items-center lg:justify-center lg:min-h-screen lg:px-6 lg:py-10"
      style={{
        maxWidth: contentMaxWidth === 'full' ? undefined : contentMaxWidth,
      }}
    >
      <div
        className={[
          'w-full',
          /* Desktop: glass card */
          'lg:lg-glass-card',
          'lg:squircle-lg',
          'lg:max-w-[560px]',
          'lg:py-12',
          'lg:px-10',
          'lg:max-h-[calc(100vh-80px)]',
          'lg:overflow-y-auto',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  </div>
);
