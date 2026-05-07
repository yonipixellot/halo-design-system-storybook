import type { ReactNode } from 'react';
import { SideNav, type SideNavProps } from './SideNav';
import { AppHeader, type AppHeaderProps } from './AppHeader';

/* HomeShell — post-login layout for Home and other in-app pages.
   Two-column at lg+: SideNav (240/280) + Main (max 720, centered).
   No right rail by design — the feed is the hero, widgets would
   compete with it.

   Below lg: passthrough. The page's phone chrome (HomeHeader, bottom
   dock when it lands) handles small viewports. */

export interface HomeShellProps {
  children: ReactNode;
  sideNav?: SideNavProps;
  header?: AppHeaderProps;
  /** Constrains the main column max-width at lg+. Pass a number for a
      hard cap, or 'full' to let the feed use whatever width is left
      after SideNav. Default: 1200 — the whole feed (rails + cards)
      lives inside this wrapper so every section's start gutter auto-
      aligns. Pass 'full' if a page wants to opt out. */
  mainMaxWidth?: number | 'full';
}

export const HomeShell = ({
  children,
  sideNav,
  header,
  mainMaxWidth = 1200,
}: HomeShellProps) => (
  <div className="lg:flex lg:min-h-screen w-full">
    <SideNav {...(sideNav ?? {})} />
    <div className="flex-1 min-w-0 lg:flex lg:flex-col">
      <AppHeader {...(header ?? {})} />
      <main className="flex-1 min-w-0 lg:py-6">
        <div
          className="mx-auto w-full"
          style={{
            maxWidth: mainMaxWidth === 'full' ? undefined : mainMaxWidth,
          }}
        >
          {children}
        </div>
      </main>
    </div>
  </div>
);
