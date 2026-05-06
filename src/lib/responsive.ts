import { useEffect, useState } from 'react';

/* Halo's responsive contract — Tailwind default breakpoints.
   These are the SINGLE source of truth: do NOT define the same
   numbers in component files. Use the hooks below, or @media queries
   keyed off the same numbers via Tailwind's `md:` / `lg:` / `xl:`
   utilities. */

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

/* Halo's logical viewport buckets — distinct from raw breakpoints
   because layout primitives (AppShell, SplitHero) flip behaviour at
   specific cuts, not at every Tailwind breakpoint. */
export type Viewport = 'phone' | 'tablet' | 'desktop' | 'desktop-xl';

const bucketize = (width: number): Viewport => {
  if (width >= BREAKPOINTS.xl) return 'desktop-xl';
  if (width >= BREAKPOINTS.lg) return 'desktop';
  if (width >= BREAKPOINTS.md) return 'tablet';
  return 'phone';
};

/* SSR-safe subscriber to window resize. Returns the current logical
   viewport, recomputing on resize. Defaults to 'phone' when no window
   is available (SSR / Storybook autodocs). */
export const useViewport = (): Viewport => {
  const [vp, setVp] = useState<Viewport>(() => {
    if (typeof window === 'undefined') return 'phone';
    return bucketize(window.innerWidth);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setVp(bucketize(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return vp;
};

/* Common predicates — saves consumers from repeating the comparison. */
export const useIsDesktop = (): boolean => {
  const vp = useViewport();
  return vp === 'desktop' || vp === 'desktop-xl';
};

export const useIsAtLeast = (key: BreakpointKey): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= BREAKPOINTS[key];
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(`(min-width: ${BREAKPOINTS[key]}px)`);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [key]);

  return matches;
};
