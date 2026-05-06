import { useTranslation } from 'react-i18next';

/* SideNav — vertical primary navigation rail rendered at lg+ in the
   app shell. Sits at the inline-start edge so RTL flips it correctly.
   Width: 240 at lg, 280 at xl.

   Destinations are persona-aware (Phase 1 ships the player set; coach
   destinations land when the coach side ships). The active item is
   driven from the parent — this component is presentational. */

export type SideNavDestKey = 'home' | 'drops' | 'following' | 'notifications';

export interface SideNavDestination {
  key: SideNavDestKey;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badgeCount?: number;
}

export interface SideNavProps {
  /** Currently active destination — drives the cyan tint. */
  active?: SideNavDestKey;
  /** Optional override list. Defaults to the player set. */
  destinations?: SideNavDestination[];
  /** User-chip slot at the bottom (avatar + name + menu trigger). */
  userChip?: React.ReactNode;
}

/* Inline SVG icons matching the codebase's stroke style. 20×20 viewBox,
   1.6 stroke width, currentColor stroke. Kept inline for visual control;
   if we later need 50+ icons we can switch to lucide-react (already a
   dependency) without changing this component's API. */
const ICONS = {
  home: (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 20, height: 20, display: 'block' }}
      aria-hidden="true"
    >
      <path d="M3 9 L10 3 L17 9 V16 a1 1 0 0 1 -1 1 H4 a1 1 0 0 1 -1 -1 Z" />
      <path d="M8 17 V12 h4 v5" />
    </svg>
  ),
  drops: (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 20, height: 20, display: 'block' }}
      aria-hidden="true"
    >
      <path d="M10 3 c -3 4 -5 7 -5 10 a5 5 0 0 0 10 0 c 0 -3 -2 -6 -5 -10 Z" />
    </svg>
  ),
  following: (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 20, height: 20, display: 'block' }}
      aria-hidden="true"
    >
      <circle cx={8} cy={7.5} r={3} />
      <path d="M2.5 17 a5.5 5.5 0 0 1 11 0" />
      <circle cx={14.5} cy={6} r={2} />
      <path d="M13 14 a4 4 0 0 1 5 1.5" />
    </svg>
  ),
  notifications: (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 20, height: 20, display: 'block' }}
      aria-hidden="true"
    >
      <path d="M5 9 a5 5 0 0 1 10 0 v3 l1.5 2 H3.5 L5 12 Z" />
      <path d="M8 16 a2 2 0 0 0 4 0" />
    </svg>
  ),
};

const DEFAULT_DESTINATIONS = (t: (k: string) => string): SideNavDestination[] => [
  { key: 'home', label: t('nav.home'), icon: ICONS.home },
  { key: 'drops', label: t('nav.drops'), icon: ICONS.drops },
  { key: 'following', label: t('nav.following'), icon: ICONS.following },
  { key: 'notifications', label: t('nav.notifications'), icon: ICONS.notifications },
];

export const SideNav = ({ active, destinations, userChip }: SideNavProps) => {
  const { t } = useTranslation();
  const items = destinations ?? DEFAULT_DESTINATIONS(t);

  return (
    <nav
      aria-label={t('nav.primary')}
      className="hidden lg:flex flex-col shrink-0 h-screen sticky top-0"
      style={{
        width: 240,
        paddingBlock: 24,
        paddingInline: 16,
        background: 'var(--canvas-bg-soft)',
        borderInlineEnd: '1px solid var(--hairline)',
      }}
    >
      {/* HALO wordmark */}
      <div className="flex items-baseline gap-2 mb-8 px-2">
        <span className="sf-display font-bold text-[18px] text-white leading-none">HALO</span>
      </div>

      {/* Destinations */}
      <ul className="flex-1 flex flex-col gap-1">
        {items.map((dest) => {
          const isActive = dest.key === active;
          return (
            <li key={dest.key}>
              <button
                type="button"
                onClick={dest.onClick}
                aria-current={isActive ? 'page' : undefined}
                className="w-full flex items-center gap-3 squircle-md px-3 py-2.5 sf text-[13.5px] font-medium transition-colors text-start"
                style={{
                  background: isActive ? 'var(--brand-cyan-soft)' : 'transparent',
                  color: isActive
                    ? 'var(--brand-cyan-text)'
                    : 'var(--text-primary)',
                  border: isActive
                    ? '1px solid var(--brand-cyan-border)'
                    : '1px solid transparent',
                }}
              >
                <span className="shrink-0">{dest.icon}</span>
                <span className="flex-1 truncate">{dest.label}</span>
                {dest.badgeCount && dest.badgeCount > 0 ? (
                  <span
                    className="sf font-semibold px-1.5 squircle-sm shrink-0"
                    style={{
                      background: 'var(--brand-cyan)',
                      color: '#000',
                      fontSize: 10.5,
                      lineHeight: '16px',
                      minWidth: 18,
                      textAlign: 'center',
                    }}
                  >
                    {dest.badgeCount > 99 ? '99+' : dest.badgeCount}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {/* User chip — pinned to bottom */}
      {userChip && <div className="shrink-0 mt-3">{userChip}</div>}
    </nav>
  );
};
