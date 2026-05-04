import type { Meta, StoryObj } from '@storybook/react';

const Swatch = ({ name, value, label }: { name: string; value: string; label?: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 14px',
      borderRadius: 12,
      border: '1px solid var(--hairline)',
      background: 'var(--glass-card-bg)',
      minWidth: 0,
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: value,
        border: '1px solid var(--hairline-strong)',
        flex: '0 0 auto',
      }}
    />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="sf" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>
        {name}
      </div>
      <div
        className="font-mono"
        style={{
          fontSize: 10.5,
          color: 'var(--text-muted)',
          marginTop: 2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
      {label && (
        <div
          className="sf"
          style={{ fontSize: 10.5, color: 'var(--text-faint)', marginTop: 3, lineHeight: 1.4 }}
        >
          {label}
        </div>
      )}
    </div>
  </div>
);

const Section = ({ title, children, cols = 3 }: { title: string; children: React.ReactNode; cols?: number }) => (
  <section style={{ marginBottom: 40 }}>
    <h3
      className="sf-display"
      style={{
        fontSize: 18,
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 14,
        letterSpacing: '-0.015em',
      }}
    >
      {title}
    </h3>
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 10 }}>
      {children}
    </div>
  </section>
);

const meta = {
  title: 'Tokens/Colors',
  parameters: { wrapper: 'docs' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const All: Story = {
  render: () => (
    <div className="sf" style={{ color: 'var(--text-primary)', maxWidth: 1280 }}>
      <h2 className="sf-display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 6 }}>
        Colors
      </h2>
      <p className="sf" style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 720 }}>
        Every CSS variable in the prototype, grouped by purpose.
      </p>

      <Section title="Brand · cyan">
        <Swatch name="--brand-cyan" value="#00D6FE" label="Primary brand · used in lg-btn-primary glow, focus rings, accent text" />
        <Swatch name="--brand-cyan-text" value="var(--brand-cyan-text)" label=".text-halo-cyan · adapts on light theme to #007D96 for AA contrast" />
        <Swatch name="--brand-cyan-soft" value="var(--brand-cyan-soft)" label="rgba(0,214,254,0.15) · soft tinted backgrounds" />
        <Swatch name="--brand-cyan-glow" value="var(--brand-cyan-glow)" label="rgba(0,214,254,0.50) · button aura, ember halo" />
        <Swatch name="--brand-cyan-border" value="var(--brand-cyan-border)" label="rgba(0,214,254,0.45) · cyan-tinted borders" />
        <Swatch name="--brand-cyan-deep" value="#0099B8" label="Deeper variant for hover/pressed" />
      </Section>

      <Section title="Canvas · surfaces">
        <Swatch name="--canvas-bg" value="var(--canvas-bg)" label="Page background · #000 dark / #FAF7F2 cream light" />
        <Swatch name="--canvas-bg-soft" value="var(--canvas-bg-soft)" label="Slightly lifted from canvas" />
        <Swatch name="--ink-surface" value="var(--ink-surface)" label="Auto-conversion of bg-black inside .glass-app" />
      </Section>

      <Section title="Glass tiers" cols={3}>
        <Swatch name="--glass-bg" value="var(--glass-bg)" label="Light glass (.lg-glass) — floating elements" />
        <Swatch name="--glass-card-bg" value="var(--glass-card-bg)" label="Card glass (.lg-glass-card) — most cards" />
        <Swatch name="--glass-strong-bg" value="var(--glass-strong-bg)" label="Heavy glass (.lg-glass-strong) — sheets, raised surfaces" />
      </Section>

      <Section title="Text">
        <Swatch name="--text-primary" value="var(--text-primary)" label="Primary text · #fff dark / #14141a light" />
        <Swatch name="--text-secondary" value="var(--text-secondary)" label="text-white/85" />
        <Swatch name="--text-tertiary" value="var(--text-tertiary)" label="text-white/65" />
        <Swatch name="--text-muted" value="var(--text-muted)" label="text-white/55" />
        <Swatch name="--text-faint" value="var(--text-faint)" label="text-white/45" />
        <Swatch name="--text-disabled" value="var(--text-disabled)" label="text-white/25" />
      </Section>

      <Section title="Borders · hairlines" cols={3}>
        <Swatch name="--hairline" value="var(--hairline)" label="rgba(255,255,255,0.08) · default divider" />
        <Swatch name="--hairline-soft" value="var(--hairline-soft)" label="rgba(255,255,255,0.06) · subtle" />
        <Swatch name="--hairline-strong" value="var(--hairline-strong)" label="rgba(255,255,255,0.12) · stronger" />
      </Section>

      <Section title="State · live (the only sanctioned red)" cols={3}>
        <Swatch name="--state-live" value="#DC2626" label="LIVE pill, ember pulse — only red allowed" />
        <Swatch name="--state-live-glow" value="rgba(220,38,38,0.55)" label="Halo around LIVE pill" />
        <Swatch name="--state-live-soft" value="rgba(220,38,38,0.20)" label="Subtle live wash" />
      </Section>

      <Section title="Atmosphere tints (corner radials)" cols={3}>
        <Swatch name="--atm-tint-1" value="rgba(0,214,254,0.05)" label="Top-left cyan · softer in dark" />
        <Swatch name="--atm-tint-2" value="rgba(132,88,255,0.04)" label="Top-right violet" />
        <Swatch name="--atm-tint-3" value="rgba(255,92,158,0.03)" label="Bottom pink" />
      </Section>
    </div>
  ),
};
