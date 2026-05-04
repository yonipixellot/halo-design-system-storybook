import { useState } from 'react';
import type { Preview, Decorator } from '@storybook/react';
import '../src/index.css';

/* One global theme toggle for every story. The pill is pinned to the
   top-right of the canvas and flips data-theme on the .glass-app wrapper.
   Stories opt out of the phone-column wrap by setting:
     parameters: { wrapper: 'docs' }
   Docs pages render at full canvas width with the same toggle. */

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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  if (variant === 'docs') {
    return (
      <div
        className="glass-app"
        data-theme={theme}
        style={{
          background: 'var(--canvas-bg)',
          color: 'var(--text-primary)',
          minHeight: '100vh',
          padding: '24px 40px 80px',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", system-ui, sans-serif',
        }}
      >
        <ThemeToggle theme={theme} setTheme={setTheme} pinned="sticky" />
        <Story />
      </div>
    );
  }

  return (
    <div
      style={{
        background: theme === 'dark' ? '#0a0a0a' : '#ECE6DA',
        minHeight: '100vh',
        padding: '24px 0',
        margin: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        position: 'relative',
        transition: 'background 200ms',
      }}
    >
      <ThemeToggle theme={theme} setTheme={setTheme} pinned="absolute" />
      <div
        className="glass-app"
        data-theme={theme}
        style={{
          width: 393,
          flex: '0 0 393px',
          background: 'var(--canvas-bg)',
          color: 'var(--text-primary)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 32,
          boxShadow:
            theme === 'dark'
              ? '0 24px 60px -12px rgba(0,0,0,0.6)'
              : '0 24px 60px -12px rgba(60,40,20,0.18)',
          minHeight: 852,
          transition: 'box-shadow 200ms',
        }}
      >
        <Story />
      </div>
    </div>
  );
};

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
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
