import type { Meta, StoryObj } from '@storybook/react';

const Tile = ({ klass, label, px, usage }: { klass: string; label: string; px: number; usage: string }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
      padding: 24,
      border: '1px solid var(--hairline)',
      borderRadius: 12,
      background: 'var(--glass-card-bg)',
    }}
  >
    <div
      className={klass}
      style={{
        width: 140,
        height: 140,
        background: 'var(--glass-strong-bg)',
        border: '1px solid var(--glass-strong-border)',
      }}
    />
    <div style={{ textAlign: 'center' }}>
      <div className="sf" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
        {label}
      </div>
      <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
        .{klass} · {px}px
      </div>
      <div className="sf" style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 6, lineHeight: 1.5 }}>
        {usage}
      </div>
    </div>
  </div>
);

const meta = {
  title: 'Tokens/Radius',
  parameters: { wrapper: 'docs' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const All: Story = {
  render: () => (
    <div style={{ color: 'var(--text-primary)', maxWidth: 1280 }}>
      <h2 className="sf-display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 6 }}>
        Squircles
      </h2>
      <p className="sf" style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 720 }}>
        Three corner radii. Match the proportion of the surface, not the aesthetic preference.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        <Tile klass="squircle-sm" label="Small" px={14} usage="Chips, small icons, badge pills" />
        <Tile klass="squircle-md" label="Medium" px={18} usage="CTAs, glass cards, inputs (most common)" />
        <Tile klass="squircle-lg" label="Large" px={26} usage="Sheets, hero containers, modal frames" />
      </div>
    </div>
  ),
};
