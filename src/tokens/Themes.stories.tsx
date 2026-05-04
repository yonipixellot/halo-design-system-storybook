import type { Meta, StoryObj } from '@storybook/react';

/* Side-by-side comparison of every theme-aware token in dark and light modes.
   Each row shows the token name + its dark value + its light value, so the
   FE team can see at a glance what flips and what doesn't. */

const ROWS: Array<{ token: string; usage: string }> = [
  { token: '--canvas-bg',          usage: 'Page background' },
  { token: '--canvas-bg-soft',     usage: 'Slightly lifted from canvas' },
  { token: '--text-primary',       usage: 'Primary text · text-white' },
  { token: '--text-secondary',     usage: 'Secondary text · text-white/85' },
  { token: '--text-tertiary',      usage: 'Tertiary text · text-white/65' },
  { token: '--text-muted',         usage: 'Muted text · text-white/55' },
  { token: '--text-faint',         usage: 'Faint text · text-white/45' },
  { token: '--text-disabled',      usage: 'Disabled · text-white/25' },
  { token: '--glass-bg',           usage: 'lg-glass background' },
  { token: '--glass-card-bg',      usage: 'lg-glass-card background' },
  { token: '--glass-strong-bg',    usage: 'lg-glass-strong background' },
  { token: '--glass-border',       usage: 'lg-glass border' },
  { token: '--glass-card-border',  usage: 'lg-glass-card border' },
  { token: '--glass-strong-border',usage: 'lg-glass-strong border' },
  { token: '--hairline',           usage: 'Default divider' },
  { token: '--hairline-soft',      usage: 'Subtle divider' },
  { token: '--hairline-strong',    usage: 'Stronger divider' },
  { token: '--brand-cyan-text',    usage: 'Cyan that adapts for AA on cream' },
  { token: '--brand-cyan-soft',    usage: 'Soft cyan tint' },
  { token: '--brand-cyan-glow',    usage: 'Cyan glow / aura' },
  { token: '--brand-cyan-border',  usage: 'Cyan-tinted borders' },
  { token: '--btn-primary-bg',     usage: 'Primary CTA pill base · cream/dark' },
  { token: '--btn-primary-text',   usage: 'Primary CTA text · black/white' },
  { token: '--btn-primary-glow',   usage: 'Primary CTA ambient glow' },
  { token: '--atm-tint-1',         usage: 'Atmosphere · top-left cyan' },
  { token: '--atm-tint-2',         usage: 'Atmosphere · top-right violet' },
  { token: '--atm-tint-3',         usage: 'Atmosphere · bottom pink' },
  { token: '--atm-base-start',     usage: 'Atmosphere base gradient · top' },
  { token: '--atm-base-mid',       usage: 'Atmosphere base gradient · mid' },
  { token: '--atm-base-end',       usage: 'Atmosphere base gradient · bottom' },
  { token: '--ink-surface',        usage: 'Auto-converted bg-black' },
  { token: '--vignette-corner',    usage: 'Corner darkening (dark) / sand (light)' },
  { token: '--card-base-soft-top', usage: 'Card gradient top stop' },
  { token: '--card-base-soft-bot', usage: 'Card gradient bottom stop' },
  { token: '--hatch-grain',        usage: 'Diagonal grain overlay color' },
];

const Cell = ({ theme, token }: { theme: 'dark' | 'light'; token: string }) => (
  <div
    data-theme={theme}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 12px',
      borderRadius: 10,
      background: theme === 'dark' ? '#000' : '#FAF7F2',
      border: '1px solid rgba(255,255,255,0.08)',
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: `var(${token})`,
        border: '1px solid rgba(127,127,127,0.25)',
        flex: '0 0 auto',
      }}
    />
    <code
      className="font-mono"
      style={{
        fontSize: 10.5,
        color: theme === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(20,20,26,0.78)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {token}
    </code>
  </div>
);

const meta = {
  title: 'Tokens/Themes',
  parameters: { wrapper: 'docs' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const All: Story = {
  render: () => (
    <div style={{ color: 'var(--text-primary)', maxWidth: 1280 }}>
      <h2
        className="sf-display"
        style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 6 }}
      >
        Themes — Dark vs Light
      </h2>
      <p
        className="sf"
        style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, maxWidth: 720 }}
      >
        Every token that flips between modes. Dark on the left (canvas{' '}
        <code>#000</code>), light on the right (cream <code>#FAF7F2</code>). Tokens not listed
        here are theme-agnostic — they look identical in both modes.
      </p>

      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr 1fr',
          gap: 16,
          padding: '10px 4px',
          borderBottom: '1px solid var(--hairline)',
          marginBottom: 8,
        }}
      >
        <div className="sf" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Token / usage
        </div>
        <div className="sf" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Dark
        </div>
        <div className="sf" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Light
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {ROWS.map(({ token, usage }) => (
          <div
            key={token}
            style={{
              display: 'grid',
              gridTemplateColumns: '320px 1fr 1fr',
              gap: 16,
              alignItems: 'center',
              padding: '6px 4px',
            }}
          >
            <div>
              <div
                className="font-mono"
                style={{ fontSize: 11.5, color: 'var(--text-primary)' }}
              >
                {token}
              </div>
              <div className="sf" style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>
                {usage}
              </div>
            </div>
            <Cell theme="dark" token={token} />
            <Cell theme="light" token={token} />
          </div>
        ))}
      </div>

      <h3
        className="sf-display"
        style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em', marginTop: 40, marginBottom: 12 }}
      >
        How theming works
      </h3>
      <div
        className="font-mono"
        style={{
          fontSize: 11,
          color: 'var(--text-muted)',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.7,
          padding: 16,
          background: 'var(--glass-card-bg)',
          borderRadius: 12,
          border: '1px solid var(--hairline)',
        }}
      >{`:root              { /* dark tokens — default */ }
[data-theme="dark"] { /* re-asserts dark · for nested force-dark scopes */ }
[data-theme="light"]{ /* warm cream canvas, white-translucent glass, deeper cyan text */ }

Apply at the wrapper: <div className="glass-app" data-theme="light">…</div>

Notes:
• --brand-cyan stays #00D6FE in both, but --brand-cyan-text bumps from #00D6FE to #007D96
  on light to clear AA contrast on the cream canvas at 9–11px caption sizes.
• Glass surfaces flip from dark-translucent to white-translucent with the same blur.
• Atmosphere tints get bumped on light so the corner radials are visible against cream.
• --canvas-bg flips #000 → #FAF7F2 (warm off-white).`}</div>
    </div>
  ),
};
