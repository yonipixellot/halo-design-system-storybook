import { useTranslation } from 'react-i18next';

/* AppHeader — top bar that appears at lg+ alongside the SideNav.
   Below lg, this component renders nothing (page-local headers like
   HomeHeader handle phone chrome).

   Composition slots:
     - title    : page title rendered at the start edge
     - search   : optional searchbar slot (centered)
     - actions  : trailing actions (notifications, user avatar, etc.)
   All three are optional — pages opt into whichever they need. */

export interface AppHeaderProps {
  title?: React.ReactNode;
  search?: React.ReactNode;
  actions?: React.ReactNode;
}

export const AppHeader = ({ title, search, actions }: AppHeaderProps) => {
  const { t } = useTranslation();

  return (
    <header
      className="hidden lg:flex items-center gap-6 sticky top-0 z-20"
      style={{
        height: 64,
        paddingInline: 24,
        background: 'var(--canvas-bg)',
        borderBlockEnd: '1px solid var(--hairline)',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
      }}
    >
      {/* Title */}
      {title && (
        <div
          className="sf-display font-bold text-white text-[15px] tracking-[-0.01em] truncate shrink-0"
          style={{ minWidth: 0 }}
        >
          {title}
        </div>
      )}

      {/* Search slot */}
      <div className="flex-1 flex justify-center">
        {search ?? (
          <div
            className="w-full max-w-[420px] squircle-md flex items-center gap-2 px-3"
            style={{
              height: 36,
              background: 'var(--glass-card-bg)',
              border: '1px solid var(--glass-card-border)',
              color: 'var(--text-tertiary)',
            }}
            aria-hidden="true"
          >
            <svg
              width={14}
              height={14}
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: 14, height: 14, display: 'block' }}
            >
              <circle cx={6} cy={6} r={4} />
              <path d="M9.5 9.5 L12 12" />
            </svg>
            <span className="sf text-[12.5px]">{t('nav.searchPlaceholder')}</span>
          </div>
        )}
      </div>

      {/* Trailing actions */}
      <div className="flex items-center gap-2 shrink-0">{actions}</div>
    </header>
  );
};
