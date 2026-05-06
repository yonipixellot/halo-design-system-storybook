import { useState } from 'react';
import { useT } from './_data';

/* Verbatim port: halo-v3.2-glass.html line 7756.
   ThemeToggle and NotificationsSheet are intentionally inlined as light
   placeholders — the full prototype variants port separately. */

const ThemeToggleInline = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  return (
    <button
      onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
      className="relative w-9 h-9 lg-glass squircle-sm flex items-center justify-center text-white/85"
      aria-label={`Theme: ${mode}`}
    >
      {mode === 'dark' ? (
        <svg width={15} height={15} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M11.6 8.7A4.6 4.6 0 0 1 5.3 2.4a5 5 0 1 0 6.3 6.3Z" />
        </svg>
      ) : (
        <svg width={15} height={15} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="7" r="2.4" />
          <path d="M7 1.4v1.5M7 11.1v1.5M1.4 7h1.5M11.1 7h1.5M3 3l1.05 1.05M9.95 9.95L11 11M3 11l1.05-1.05M9.95 4.05L11 3" />
        </svg>
      )}
    </button>
  );
};

export const HomeHeader = ({
  greeting,
  onMenuOpen,
}: {
  /** Override the default greeting. If omitted, falls back to t('home.gameDay'). */
  greeting?: string;
  /** Fired when the hamburger is tapped — Home wires this to open
      the SideMenu drawer. */
  onMenuOpen?: () => void;
}) => {
  const t = useT();
  const label = greeting ?? t('home.gameDay');
  return (
  <div
    className="relative z-20 px-5 pt-14 pb-3 sticky top-0 flex items-center justify-between"
    style={{
      background:
        'linear-gradient(180deg, var(--header-fade-start) 0%, var(--header-fade-mid) 70%, transparent 100%)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }}
  >
    <div className="flex items-baseline gap-2">
      <span className="sf-display font-bold text-[22px] text-white leading-none">HALO</span>
      <span className="sf text-[10px] tracking-[0.18em] uppercase text-halo-cyan font-bold">
        {label}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <ThemeToggleInline />
      <button
        className="relative w-9 h-9 lg-glass squircle-sm flex items-center justify-center text-white/85"
        aria-label="Notifications"
      >
        <svg width={15} height={15} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.7 10.3h8.6V8.6c0-.4-.16-.78-.44-1.06l-.56-.56V5.5a3.3 3.3 0 1 0-6.6 0v1.48l-.56.56c-.28.28-.44.66-.44 1.06v1.7Z" />
          <path d="M5.5 10.3a1.5 1.5 0 0 0 3 0" />
        </svg>
        <span
          className="absolute -top-0.5 -end-0.5 min-w-[15px] h-[15px] live-red rounded-full sf text-[8.5px] font-bold flex items-center justify-center px-1 leading-none border border-black"
        >
          3
        </span>
      </button>
      <button
        onClick={onMenuOpen}
        className="w-9 h-9 lg-glass squircle-sm flex items-center justify-center text-white/85"
        aria-label="Menu"
      >
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <line x1="0" y1="1" x2="14" y2="1" />
          <line x1="0" y1="5" x2="14" y2="5" />
          <line x1="0" y1="9" x2="14" y2="9" />
        </svg>
      </button>
    </div>
  </div>
  );
};
