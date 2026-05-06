/* RightRail — slot column on the inline-end edge of the AppShell at
   lg+. Pages opt-in by passing the RightRail slot to AppShell.
   Width: 320 at lg, 360 at xl.

   Sticky to the viewport so widgets remain visible as the main feed
   scrolls. RTL-aware via inline-start/inline-end. */

export interface RightRailProps {
  children: React.ReactNode;
  /** Optional ARIA label for the rail container. */
  label?: string;
}

export const RightRail = ({ children, label }: RightRailProps) => (
  <aside
    aria-label={label}
    className="hidden lg:block shrink-0 sticky top-[64px] self-start"
    style={{
      width: 320,
      maxHeight: 'calc(100vh - 64px)',
      overflowY: 'auto',
      paddingBlock: 24,
      paddingInlineEnd: 24,
      paddingInlineStart: 8,
    }}
  >
    {children}
  </aside>
);
