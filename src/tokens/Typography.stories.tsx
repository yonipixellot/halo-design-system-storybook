import type { Meta, StoryObj } from '@storybook/react';

const Row = ({ token, sample, meta }: { token: string; sample: React.ReactNode; meta?: string }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr 280px',
      gap: 24,
      alignItems: 'baseline',
      padding: '14px 0',
      borderBottom: '1px solid var(--hairline)',
    }}
  >
    <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
      {token}
    </div>
    <div style={{ minWidth: 0 }}>{sample}</div>
    <div className="sf" style={{ fontSize: 11.5, color: 'var(--text-faint)', lineHeight: 1.5 }}>
      {meta}
    </div>
  </div>
);

const meta = {
  title: 'Tokens/Typography',
  parameters: { wrapper: 'docs' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const All: Story = {
  render: () => (
    <div style={{ color: 'var(--text-primary)', maxWidth: 1280 }}>
      <h2 className="sf-display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 6 }}>
        Typography
      </h2>
      <p className="sf" style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, maxWidth: 720 }}>
        Two families. Letter-spacing tighter for display, neutral for body. Pulled from the actual screens — not invented sizes.
      </p>

      <Row
        token=".sf-display · 28px / 700 / -0.025em"
        sample={<div className="sf-display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.05 }}>Reset password</div>}
        meta="Hero headlines (auth, onboarding)"
      />
      <Row
        token=".sf-display · 26px / 700 / -0.025em"
        sample={<div className="sf-display" style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.05 }}>Welcome to Halo</div>}
        meta="Page headline"
      />
      <Row
        token=".sf-display · 24px / 700 / -0.025em"
        sample={<div className="sf-display" style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.05 }}>Pick teams to follow</div>}
        meta="Section headline"
      />
      <Row
        token=".sf-display · 21px / 700 / -0.02em"
        sample={<div className="sf-display" style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05 }}>“Crash on the boards”</div>}
        meta="NextGameTeaser pull-quote"
      />
      <Row
        token=".sf-display · 18px / 700 / -0.015em"
        sample={<div className="sf-display" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em' }}>Following — upcoming</div>}
        meta="Rail title"
      />
      <Row
        token=".sf-display · 16px / 700 / -0.01em"
        sample={<div className="sf-display" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>Player</div>}
        meta="Card title"
      />
      <Row
        token=".sf-display · 14.5px / 700 / -0.01em"
        sample={<div className="sf-display" style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.01em' }}>Varsity vs Lincoln</div>}
        meta="Compact card title"
      />
      <Row
        token=".sf · 14.5px / 600"
        sample={<div className="sf" style={{ fontSize: 14.5, fontWeight: 600 }}>Sign in</div>}
        meta="Primary CTA label"
      />
      <Row
        token=".sf · 13px / 400 / 1.6 leading"
        sample={<div className="sf" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>Type the email on your account. We'll send a one-tap reset link.</div>}
        meta="Body copy"
      />
      <Row
        token=".sf · 12.5px / 600"
        sample={<div className="sf" style={{ fontSize: 12.5, fontWeight: 600 }}>Sign In · Sign Up</div>}
        meta="Tab label"
      />
      <Row
        token=".sf · 12px / 500"
        sample={<div className="sf" style={{ fontSize: 12, color: 'var(--text-muted)' }}>Forgot password?</div>}
        meta="Tertiary link"
      />
      <Row
        token=".sf · 11px / 700 · 0.18em / UPPER"
        sample={<div className="sf" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--brand-cyan-text)' }}>Step 1 of 3</div>}
        meta="Eyebrow / step indicator"
      />
      <Row
        token=".sf · 10px / 600 · 0.16em / UPPER"
        sample={<div className="sf" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Email</div>}
        meta="Input label · GlassField"
      />
      <Row
        token=".font-mono · 11px"
        sample={<div className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>varsity-eastside-2026</div>}
        meta="Code, identifiers, claim codes"
      />
    </div>
  ),
};
