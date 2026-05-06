import { SideNav, type SideNavProps } from './SideNav';
import { AppHeader, type AppHeaderProps } from './AppHeader';

/* AppShell — post-login layout. Composes SideNav + AppHeader + Main +
   optional RightRail at lg+. Below lg the shell is a passthrough: the
   page's own phone chrome (HomeHeader, BottomDock when it lands) takes
   over. This means a single Home component can render in all three
   viewports without conditional plumbing in the page itself.

   Slot model:
     - `header`     : AppHeader props (title/search/actions). Visible at lg+
     - `sideNav`    : SideNav props (active, destinations, userChip)
     - `rightRail`  : optional content for the trailing rail
     - `children`   : the main content. Always rendered. */

export interface AppShellProps {
  children: React.ReactNode;
  sideNav?: SideNavProps;
  header?: AppHeaderProps;
  rightRail?: React.ReactNode;
  /** Constrains the main column max-width at lg+. Default: 720. */
  mainMaxWidth?: number;
}

export const AppShell = ({
  children,
  sideNav,
  header,
  rightRail,
  mainMaxWidth = 720,
}: AppShellProps) => {
  return (
    <div className="lg:flex lg:min-h-screen" style={{ width: '100%' }}>
      {/* Side nav — hidden at <lg by SideNav itself */}
      <SideNav {...(sideNav ?? {})} />

      {/* Main column wrapper — header sticks at top, content scrolls */}
      <div className="flex-1 min-w-0 lg:flex lg:flex-col">
        <AppHeader {...(header ?? {})} />

        {/* Content row at lg+: main + optional right rail */}
        <div className="lg:flex lg:flex-1 lg:min-h-0">
          <main
            className="flex-1 min-w-0 lg:py-6 lg:px-8 xl:px-12"
            style={{
              maxWidth: rightRail ? undefined : '100%',
            }}
          >
            <div
              className="mx-auto"
              style={{
                width: '100%',
                maxWidth: mainMaxWidth,
              }}
            >
              {children}
            </div>
          </main>
          {rightRail}
        </div>
      </div>
    </div>
  );
};
