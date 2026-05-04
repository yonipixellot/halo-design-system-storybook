import type { Meta, StoryObj } from '@storybook/react';

const Tile = ({ klass, label, hint }: { klass: string; label: string; hint?: string }) => (
  <div
    style={{
      padding: 18,
      border: '1px solid var(--hairline)',
      borderRadius: 12,
      background: 'var(--glass-card-bg)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}
  >
    <div className="sf" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
    <div className="font-mono" style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>.{klass}</div>
    <div
      className={klass}
      style={{
        height: 44,
        padding: '10px 14px',
        background: 'var(--brand-cyan-soft)',
        border: '1px solid var(--brand-cyan-border)',
        borderRadius: 10,
        color: 'var(--brand-cyan-text)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span className="sf" style={{ fontSize: 12 }}>animated</span>
    </div>
    {hint && <div className="sf" style={{ fontSize: 11, color: 'var(--text-faint)', lineHeight: 1.5 }}>{hint}</div>}
  </div>
);

const meta = {
  title: 'Tokens/Animations',
  parameters: { wrapper: 'docs' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const All: Story = {
  render: () => (
    <div style={{ color: 'var(--text-primary)', maxWidth: 1280 }}>
      <h2 className="sf-display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 6 }}>
        Animations
      </h2>
      <p className="sf" style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 720 }}>
        Refresh this page to replay the entrance animations.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <Tile klass="anim-fade" label="Fade in" hint="Default screen entrance · 360ms" />
        <Tile klass="anim-slide-up" label="Slide up" hint="Cards, modals · 380ms" />
        <Tile klass="anim-slide-down" label="Slide down" hint="Headers, sheets · 320ms" />
        <Tile klass="anim-slide-sheet" label="Slide sheet" hint="Bottom sheets · 320ms" />
        <Tile klass="anim-scale-in" label="Scale in" hint="Toasts, badges · 320ms" />
        <Tile klass="anim-pulse" label="Pulse" hint="Live indicators, loading · 1.5s loop" />
        <Tile klass="anim-pulse-dot" label="Pulse dot" hint="Notification dots · 1.4s loop" />
        <Tile klass="anim-shimmer" label="Shimmer" hint="Skeleton loading · 2.4s loop" />
        <Tile klass="anim-glow" label="Glow" hint="Active states · 2s loop" />
        <Tile klass="anim-float" label="Float" hint="Hero elements · 3.2s loop" />
        <Tile klass="anim-wiggle" label="Wiggle" hint="Notification shake · 0.8s once" />
      </div>
    </div>
  ),
};
