import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguagePage } from './LanguagePage';

/* SideMenu — slide-in drawer from inline-END.
   Opens from the right in LTR, from the left in RTL — auto-mirrors via
   logical CSS properties.

   May 2026 fixes (post-design-critique):
     1. Drawer side: was inline-start (left in LTR). User asked for the
        right side, which logically maps to inline-end. Auto-flips for
        RTL audiences (Hebrew menu opens from inline-end = visually left).
     2. Surface: was lg-glass-strong (translucent — home content bled
        through). Now an opaque dark panel with a subtle gradient + cyan
        hairline at the visible edge. Reads as a discrete sheet, not a
        haze over the page. Backdrop dim strengthened to seal the canvas.

   Internal page stack:
     - 'root'      — main menu items
     - 'language'  — language picker (RTL toggle lives here)
     - 'appearance', 'notifications', 'privacy', 'help' are stubbed
       chevron items the FE team can wire to real screens later. */

type MenuPage = 'root' | 'language' | 'appearance' | 'notifications' | 'privacy' | 'help';

export interface SideMenuProps {
  onClose: () => void;
}

export const SideMenu = ({ onClose }: SideMenuProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState<MenuPage>('root');

  return (
    <div className="absolute inset-0 z-[60] anim-fade">
      {/* Backdrop — heavier dim + blur so the underlying canvas dies out
          under the menu and the panel reads as the dominant surface. */}
      <button
        onClick={onClose}
        aria-label={t('common.close')}
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(14px) saturate(120%)',
          WebkitBackdropFilter: 'blur(14px) saturate(120%)',
        }}
      />

      {/* Drawer panel — anchored at inline-END (right in LTR, left in RTL).
          Opaque dark surface (NOT lg-glass-strong) so home content can't
          bleed through. Subtle gradient + cyan hairline give it depth. */}
      <div
        className="absolute inset-y-0 overflow-hidden flex flex-col"
        style={{
          insetInlineEnd: 0,
          width: '85%',
          maxWidth: 340,
          background:
            'linear-gradient(180deg, var(--canvas-bg-soft) 0%, var(--canvas-bg) 60%, var(--canvas-bg) 100%)',
          /* Cyan hairline on the visible edge (inline-start, where the
             panel meets the dimmed canvas). Marks the brand seam.
             Direction-aware via logical property. */
          borderInlineStart: '1px solid rgba(0,214,254,0.22)',
          /* Symmetric outer shadow so the panel reads the same in LTR
             and RTL without needing a [dir=rtl] override. */
          boxShadow: '0 0 60px -12px rgba(0,0,0,0.75)',
        }}
      >
        {page === 'root' && (
          <RootPage
            onClose={onClose}
            onNavigate={(p) => setPage(p)}
          />
        )}

        {page === 'language' && (
          <LanguagePage onBack={() => setPage('root')} onClose={onClose} />
        )}

        {page !== 'root' && page !== 'language' && (
          <StubPage
            titleKey={`menu.${page}`}
            onBack={() => setPage('root')}
          />
        )}
      </div>
    </div>
  );
};

/* === Root menu page === */
const RootPage = ({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: (p: MenuPage) => void;
}) => {
  const { t, i18n } = useTranslation();
  const currentLangLabel = i18n.language === 'he' ? 'עברית' : 'English';

  const items: Array<{
    key: MenuPage;
    labelKey: string;
    icon: React.ReactNode;
    trailing?: string;
  }> = [
    {
      key: 'language',
      labelKey: 'menu.language',
      trailing: currentLangLabel,
      icon: <IconGlobe />,
    },
    { key: 'appearance', labelKey: 'menu.appearance', icon: <IconAppearance /> },
    { key: 'notifications', labelKey: 'menu.notifications', icon: <IconBell /> },
    { key: 'privacy', labelKey: 'menu.privacy', icon: <IconShield /> },
    { key: 'help', labelKey: 'menu.help', icon: <IconHelp /> },
  ];

  return (
    <>
      {/* Header */}
      <div
        className="px-5 pt-14 pb-4 flex items-center justify-between shrink-0"
        style={{ borderBottom: '1px solid var(--glass-strong-border)' }}
      >
        <span className="sf-display text-[20px] font-bold text-white tracking-[-0.015em]">
          {t('menu.title')}
        </span>
        <button
          onClick={onClose}
          aria-label={t('common.close')}
          className="w-9 h-9 lg-glass squircle-sm flex items-center justify-center text-white"
        >
          <svg
            width={12}
            height={12}
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            style={{ width: 12, height: 12, display: 'block' }}
          >
            <path d="M3 3 L11 11 M11 3 L3 11" />
          </svg>
        </button>
      </div>

      {/* Menu items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className="w-full squircle-sm px-3 py-3.5 flex items-center gap-3 text-white/90 lg-aura"
            style={{ marginBottom: 4 }}
          >
            <span
              className="w-8 h-8 squircle-sm flex items-center justify-center shrink-0"
              style={{
                background: 'var(--brand-cyan-soft)',
                color: 'var(--brand-cyan-text)',
                border: '1px solid var(--brand-cyan-border)',
              }}
            >
              {item.icon}
            </span>
            <span className="sf text-[14.5px] font-semibold flex-1 text-start">
              {t(item.labelKey)}
            </span>
            {item.trailing && (
              <span className="sf text-[12px] text-white/55">{item.trailing}</span>
            )}
            <ChevronEnd />
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-3 py-3 shrink-0"
        style={{ borderTop: '1px solid var(--glass-strong-border)' }}
      >
        <button className="w-full squircle-sm px-3 py-3 flex items-center gap-3 text-white/75 lg-aura">
          <span
            className="w-8 h-8 squircle-sm flex items-center justify-center shrink-0"
            style={{
              background: 'rgba(220,38,38,0.12)',
              color: '#FCA5A5',
              border: '1px solid rgba(220,38,38,0.32)',
            }}
          >
            <IconSignOut />
          </span>
          <span className="sf text-[14.5px] font-semibold flex-1 text-start">
            {t('menu.signOut')}
          </span>
        </button>
      </div>
    </>
  );
};

/* === Stubbed sub-page (appearance, notifications, etc.) === */
const StubPage = ({ titleKey, onBack }: { titleKey: string; onBack: () => void }) => {
  const { t } = useTranslation();
  return (
    <>
      <div
        className="px-5 pt-14 pb-4 flex items-center gap-3 shrink-0"
        style={{ borderBottom: '1px solid var(--glass-strong-border)' }}
      >
        <button
          onClick={onBack}
          aria-label={t('common.back')}
          className="w-9 h-9 lg-glass squircle-sm flex items-center justify-center text-white"
        >
          <ChevronStart />
        </button>
        <span className="sf-display text-[20px] font-bold text-white tracking-[-0.015em]">
          {t(titleKey)}
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center px-5">
        <span className="sf text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
          {t('common.loading')}…
        </span>
      </div>
    </>
  );
};

/* === Icons — flat + brand-cyan tint, lucide-style === */

const IconGlobe = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    style={{ width: 16, height: 16, display: 'block' }}
  >
    <circle cx="9" cy="9" r="7" />
    <path d="M2 9h14M9 2c2 2.5 3 5.5 3 7s-1 4.5-3 7M9 2c-2 2.5-3 5.5-3 7s1 4.5 3 7" />
  </svg>
);
const IconAppearance = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    style={{ width: 16, height: 16, display: 'block' }}
  >
    <circle cx="9" cy="9" r="7" />
    <path d="M9 2v14M2 9h14" />
  </svg>
);
const IconBell = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 16, height: 16, display: 'block' }}
  >
    <path d="M3.5 13.5h11V11l-.7-.7V8a4.8 4.8 0 0 0-9.6 0v2.3l-.7.7v2.5Z" />
    <path d="M7.5 13.5a1.5 1.5 0 0 0 3 0" />
  </svg>
);
const IconShield = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 16, height: 16, display: 'block' }}
  >
    <path d="M9 2 3 4v5c0 4 2.5 6.4 6 7 3.5-.6 6-3 6-7V4L9 2Z" />
  </svg>
);
const IconHelp = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    style={{ width: 16, height: 16, display: 'block' }}
  >
    <circle cx="9" cy="9" r="7" />
    <path d="M7 7a2 2 0 1 1 3 1.7c-.6.4-1 .8-1 1.5M9 13.5h.01" />
  </svg>
);
const IconSignOut = () => (
  <svg
    width={15}
    height={15}
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 15, height: 15, display: 'block' }}
  >
    <path d="M11 4V2.5H3v13h8V14M7 9h10M14 6l3 3-3 3" />
  </svg>
);

/* Chevrons that follow the inline direction.
   ChevronEnd points toward inline-end (right in LTR, left in RTL).
   ChevronStart points toward inline-start. We use scaleX(-1) on the
   element when dir=rtl via CSS, but the SVG below renders the LTR
   shape and we let the parent's [dir] flip it via `.icon-flip`. */
const ChevronEnd = () => (
  <svg
    width={10}
    height={12}
    viewBox="0 0 8 12"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon-flip-rtl"
    style={{ width: 10, height: 12, display: 'block', color: 'var(--text-faint)' }}
  >
    <path d="M2 1 L7 6 L2 11" />
  </svg>
);
const ChevronStart = () => (
  <svg
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon-flip-rtl"
    style={{ width: 12, height: 12, display: 'block' }}
  >
    <path d="M8 2 L3 6 L8 10" />
  </svg>
);
