import { useEffect, useState } from 'react';
import type { Preview, Decorator } from '@storybook/react';
import { I18nextProvider } from 'react-i18next';
import i18n, { dirFor } from '../src/lib/i18n';
import '../src/index.css';

/* One global theme toggle for every story. The pill is pinned to the
   top-right of the canvas and flips data-theme on the .glass-app wrapper.
   Stories opt out of the phone-column wrap by setting:
     parameters: { wrapper: 'docs' }
   Docs pages render at full canvas width with the same toggle.

   Theme is persisted to localStorage so it survives page-to-page
   navigation in Storybook. A custom DOM event keeps every decorator
   instance in sync when one of them flips the toggle. */

type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'halo-storybook-theme';
const THEME_EVENT = 'halo-storybook-theme-change';

const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';
  try {
    const v = window.localStorage.getItem(THEME_STORAGE_KEY);
    return v === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

const writeStoredTheme = (theme: Theme) => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* private mode / quota — fall back to in-memory state only */
  }
  window.dispatchEvent(
    new CustomEvent<Theme>(THEME_EVENT, { detail: theme }),
  );
};

const ThemeToggle = ({
  theme,
  setTheme,
  pinned = 'absolute',
}: {
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  pinned?: 'absolute' | 'sticky';
}) => (
  <div
    style={{
      position: pinned,
      top: pinned === 'absolute' ? 16 : 0,
      right: pinned === 'absolute' ? 16 : undefined,
      marginLeft: pinned === 'sticky' ? 'auto' : undefined,
      width: 'fit-content',
      marginBottom: pinned === 'sticky' ? 12 : 0,
      display: 'flex',
      gap: 4,
      padding: 4,
      borderRadius: 999,
      border: '1px solid rgba(255,255,255,0.10)',
      background: 'rgba(20,22,30,0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      zIndex: 100,
    }}
  >
    {(['dark', 'light'] as const).map((m) => {
      const active = theme === m;
      return (
        <button
          key={m}
          onClick={() => setTheme(m)}
          className="sf"
          style={{
            padding: '6px 14px',
            borderRadius: 999,
            cursor: 'pointer',
            fontSize: 11.5,
            fontWeight: 600,
            textTransform: 'capitalize',
            background: active ? 'rgba(0,214,254,0.15)' : 'transparent',
            color: active ? '#00D6FE' : 'rgba(255,255,255,0.55)',
            border: active ? '1px solid rgba(0,214,254,0.45)' : '1px solid transparent',
            transition: 'all 200ms',
          }}
        >
          {m}
        </button>
      );
    })}
  </div>
);

const themedDecorator: Decorator = (Story, ctx) => {
  const variant = (ctx.parameters?.wrapper as 'phone' | 'docs' | undefined) ?? 'phone';

  /* Initial value reads from localStorage so navigating between stories
     keeps whatever theme the user picked. */
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme());

  /* Subscribe to theme changes coming from other decorator instances
     (custom event) and from other browser tabs (storage event). */
  useEffect(() => {
    const onCustom = (e: Event) => {
      const t = (e as CustomEvent<Theme>).detail;
      if (t === 'dark' || t === 'light') setThemeState(t);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key !== THEME_STORAGE_KEY) return;
      if (e.newValue === 'dark' || e.newValue === 'light') {
        setThemeState(e.newValue);
      }
    };
    window.addEventListener(THEME_EVENT, onCustom as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(THEME_EVENT, onCustom as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    writeStoredTheme(next);
  };

  /* Track the current i18n language so we can apply dir on the .glass-app
     wrapper. The language itself is changed from the in-app SideMenu
     LanguagePage (not via Storybook chrome) per the May 2026 build plan. */
  const [lang, setLang] = useState<string>(i18n.language || 'en');
  useEffect(() => {
    const handler = (l: string) => setLang(l);
    i18n.on('languageChanged', handler);
    return () => {
      i18n.off('languageChanged', handler);
    };
  }, []);
  const dir = dirFor(lang);

  if (variant === 'docs') {
    return (
      <I18nextProvider i18n={i18n}>
        <div
          className="glass-app"
          data-theme={theme}
          dir={dir}
          style={{
            background: 'var(--canvas-bg)',
            color: 'var(--text-primary)',
            minHeight: '100vh',
            padding: '24px 40px 80px',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Noto Sans Hebrew", system-ui, sans-serif',
          }}
        >
          <ThemeToggle theme={theme} setTheme={setTheme} pinned="sticky" />
          <Story />
        </div>
      </I18nextProvider>
    );
  }

  /* Full-bleed canvas — works at every viewport. The Storybook viewport
     addon resizes the iframe itself (393 / 834 / 1280 / 1920), so the
     story content fills whatever width the iframe is. No fake device
     frame, no cream-on-the-side backdrop — what you see IS the app. */
  return (
    <I18nextProvider i18n={i18n}>
      <div
        className="glass-app"
        data-theme={theme}
        dir={dir}
        style={{
          background: 'var(--canvas-bg)',
          color: 'var(--text-primary)',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Noto Sans Hebrew", system-ui, sans-serif',
        }}
      >
        <ThemeToggle theme={theme} setTheme={setTheme} pinned="absolute" />
        <Story />
      </div>
    </I18nextProvider>
  );
};

/* Viewport presets — Halo's responsive contract.
   The Storybook viewport addon resizes the iframe to these dimensions;
   the decorator above renders full-bleed inside the iframe for ALL
   viewports. There is no fake device frame at any breakpoint. */
const HALO_VIEWPORTS = {
  haloPhone: {
    name: 'Phone (393)',
    type: 'mobile',
    styles: { width: '393px', height: '852px' },
  },
  haloTablet: {
    name: 'Tablet (834)',
    type: 'tablet',
    styles: { width: '834px', height: '1112px' },
  },
  haloDesktop: {
    name: 'Desktop (1280)',
    type: 'desktop',
    styles: { width: '1280px', height: '800px' },
  },
  haloDesktopXL: {
    name: 'Desktop XL (1920)',
    type: 'desktop',
    styles: { width: '1920px', height: '1080px' },
  },
} as const;

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
    viewport: {
      viewports: HALO_VIEWPORTS,
      defaultViewport: 'haloPhone',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [themedDecorator],
};

export default preview;
