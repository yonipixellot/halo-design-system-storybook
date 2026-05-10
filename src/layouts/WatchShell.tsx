import type { ReactNode } from 'react';

/* WatchShell — desktop layout primitive for the Watch tab.

   Netflix-homepage pattern (the user-selected option from the Watch
   plan): minimal sticky top bar + cinematic full-bleed hero + vertical
   stack of horizontally-scrollable rails.

   Why a separate primitive (vs reusing HomeShell):
     - HomeShell has a left SideNav (post-login app shell). Watch
       deliberately doesn't — Netflix homepages don't carry persistent
       navigation; the canvas IS the navigation, anchored by the hero.
     - The rails want edge-to-edge horizontal overflow (cards bleed off
       the right viewport edge so users discover scrollability). HomeShell
       caps content at 1200 with mx-auto, which would clip the rails.
     - Watch is always-dark (Netflix doesn't do light mode); the wrapper
       sets data-theme="dark" so the global Light toggle never reaches
       the screen.

   Layout:
     - Outer wrapper: `min-h-screen relative` so the atmosphere absolute
       layer fills the entire viewport.
     - Atmosphere: `lg-atmosphere` + vignette overlay, full-bleed.
     - Top bar: sticky, glass blur, max-w 1400 inner. Wordmark left,
       optional `topBarRight` slot.
     - Hero: full-bleed slot (the hero component owns its own
       content-cap and gradient scrim).
     - Rails: stacked vertically with `lg:gap-10`. Each rail is passed
       in as a child and is responsible for its own horizontal padding
       (typically `px-12`) and overflow behavior so cards bleed
       edge-to-edge.

   Phone treatment:
     This primitive is desktop-only by design. Phone uses the existing
     in-screen chrome (sticky HALO TV header + body sequence) — see
     WatchScreen.tsx for the lg: branch. */

export interface WatchShellProps {
  /** Cinematic hero — typically `<WatchHeroDesktop />`. Renders full-bleed
      below the top bar. The hero owns its own gradient scrim and content
      anchoring. */
  hero: ReactNode;
  /** Stacked rails. Each child should be a horizontal rail (e.g.
      `<WatchLane>`) that handles its own padding + overflow. */
  children: ReactNode;
  /** Optional center-of-top-bar slot — typically a search input or
      command-K trigger. Centered between the brand (start) and the
      `topBarRight` slot (end). */
  topBarCenter?: ReactNode;
  /** Optional right-side slot in the top bar (avatar, sign-out, etc.).
      Default is a small "All Access" pill placeholder. */
  topBarRight?: ReactNode;
  /** Override the brand wordmark. Default: HALO TV with cyan TV. */
  brandLabel?: ReactNode;
}

const DefaultBrand = () => (
  <span className="sf-display font-bold text-[20px] text-white">
    HALO <span className="text-halo-cyan">TV</span>
  </span>
);

export const WatchShell = ({
  hero,
  children,
  topBarCenter,
  topBarRight,
  brandLabel,
}: WatchShellProps) => (
  <div
    data-theme="dark"
    className="relative min-h-screen text-white sf overflow-x-hidden"
  >
    {/* Atmosphere — same recipe as the rest of the app */}
    <div className="lg-atmosphere" />
    <div
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{
        background:
          'linear-gradient(180deg, var(--vignette-corner) 0%, transparent 30%, transparent 70%, var(--vignette-corner-soft) 100%)',
      }}
    />

    {/* Sticky top bar — minimal, glass blur, doesn't compete with hero */}
    <header
      className="relative z-30 sticky top-0"
      style={{
        background:
          'linear-gradient(180deg, rgba(8,10,18,0.85) 0%, rgba(8,10,18,0.55) 70%, transparent 100%)',
        backdropFilter: 'blur(12px) saturate(160%)',
        WebkitBackdropFilter: 'blur(12px) saturate(160%)',
      }}
    >
      <div className="mx-auto max-w-[1200px] px-8 xl:px-12 py-4 flex items-center gap-6">
        <div className="shrink-0">{brandLabel ?? <DefaultBrand />}</div>
        {/* Center slot — flex-1 so it expands to take the space between
            brand and right slot, but capped internally by whatever is
            passed in (typically a 440px-max-w search input). */}
        <div className="flex-1 min-w-0">{topBarCenter}</div>
        <div className="flex items-center gap-3 shrink-0">
          {topBarRight ?? (
            <span className="lg-glass squircle-sm px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase font-semibold text-white/80">
              All Access
            </span>
          )}
        </div>
      </div>
    </header>

    {/* Hero — full-bleed slot. The hero owns its own scrim + content anchoring. */}
    <section className="relative z-10">{hero}</section>

    {/* Rails column — vertical stack capped at the design-system 1200
        rule. Children handle their own horizontal padding via the
        gutter rule (px-4 lg:px-8 xl:px-12) so titles align with the
        hero text. The cap keeps cards from sprawling on 1920+ viewports. */}
    <section className="relative z-10 mx-auto w-full max-w-[1200px] flex flex-col gap-10 pt-8 pb-20">
      {children}
    </section>
  </div>
);
