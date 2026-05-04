import type { Meta, StoryObj } from '@storybook/react';
import { AppleIcon, GoogleIcon } from '@/screens/auth/_shared';

/* The prototype does NOT have a Button component. Each button uses inline
   className soup. These stories document the canonical patterns. */

const Card = ({ label, code, children, span = 1 }: { label: string; code: string; children: React.ReactNode; span?: number }) => (
  <div
    style={{
      gridColumn: `span ${span}`,
      padding: 18,
      borderRadius: 14,
      border: '1px solid var(--hairline)',
      background: 'var(--glass-card-bg)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}
  >
    <div className="sf-display" style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</div>
    <div>{children}</div>
    <div
      className="font-mono"
      style={{
        fontSize: 10.5,
        color: 'var(--text-muted)',
        whiteSpace: 'pre-wrap',
        lineHeight: 1.6,
        padding: 12,
        borderRadius: 8,
        background: 'rgba(0,0,0,0.25)',
        border: '1px solid var(--hairline-soft)',
        marginTop: 'auto',
      }}
    >
      {code}
    </div>
  </div>
);

const meta = {
  title: 'Tokens/Buttons',
  parameters: { wrapper: 'docs' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const All: Story = {
  render: () => (
    <div style={{ color: 'var(--text-primary)', maxWidth: 1280 }}>
      <h2 className="sf-display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 6 }}>
        Buttons
      </h2>
      <p className="sf" style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 720 }}>
        The prototype expresses button variants as inline className soup, not as a wrapped <code>Button</code> component.
        Copy the className strings as-is.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <Card
          label="Primary CTA"
          code={`<button className="lg-btn-primary lg-shine lg-aura squircle-md py-3.5 w-full sf text-[14.5px] font-semibold">Sign in</button>`}
        >
          <button className="lg-btn-primary lg-shine lg-aura squircle-md py-3.5 w-full sf text-[14.5px] font-semibold">
            Sign in
          </button>
        </Card>

        <Card
          label="Primary CTA · disabled"
          code={`<button disabled className="lg-btn-primary lg-shine lg-aura squircle-md py-3.5 w-full sf text-[14.5px] font-semibold">Continue</button>`}
        >
          <button disabled className="lg-btn-primary lg-shine lg-aura squircle-md py-3.5 w-full sf text-[14.5px] font-semibold">
            Continue
          </button>
        </Card>

        <Card
          label="Glass · social (Apple)"
          code={`<button className="lg-glass squircle-md py-3 w-full flex items-center justify-center gap-2.5 sf text-[13.5px] font-semibold text-white">
  <AppleIcon /> Continue with Apple
</button>`}
        >
          <button className="lg-glass squircle-md py-3 w-full flex items-center justify-center gap-2.5 sf text-[13.5px] font-semibold text-white">
            <AppleIcon /> Continue with Apple
          </button>
        </Card>

        <Card
          label="Glass · social (Google)"
          code={`<button className="lg-glass squircle-md py-3 w-full flex items-center justify-center gap-2.5 sf text-[13.5px] font-semibold text-white">
  <GoogleIcon /> Continue with Google
</button>`}
        >
          <button className="lg-glass squircle-md py-3 w-full flex items-center justify-center gap-2.5 sf text-[13.5px] font-semibold text-white">
            <GoogleIcon /> Continue with Google
          </button>
        </Card>

        <Card
          label="Glass icon · 36×36 squircle-sm"
          code={`<button className="w-9 h-9 lg-glass squircle-sm flex items-center justify-center text-white/85"><svg/></button>`}
        >
          <button className="w-9 h-9 lg-glass squircle-sm flex items-center justify-center text-white/85" aria-label="Back">
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 2.5 L4 7 L8.5 11.5" />
            </svg>
          </button>
        </Card>

        <Card
          label="Text link · cyan microcopy"
          code={`<button className="sf text-[10.5px] tracking-tight font-semibold text-halo-cyan px-1.5">Show</button>`}
        >
          <button className="sf text-[10.5px] tracking-tight font-semibold text-halo-cyan px-1.5">
            Show
          </button>
        </Card>

        <Card
          label="Text link · neutral microcopy"
          code={`<button className="sf text-[12px] text-white/55 font-medium hover:text-halo-cyan transition-colors">Forgot password?</button>`}
        >
          <button className="sf text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>
            Forgot password?
          </button>
        </Card>

        <Card
          label="Manage chevron · cyan link"
          code={`<button className="sf text-[11px] font-semibold text-halo-cyan tracking-tight">Manage <span>›</span></button>`}
        >
          <button className="sf text-[11px] font-semibold text-halo-cyan tracking-tight">
            Manage <span>›</span>
          </button>
        </Card>

        <Card
          label="Auth mode toggle pill (active state)"
          span={2}
          code={`<div className="lg-glass squircle-md p-1 flex gap-1">
  <button className="flex-1 py-2.5 sf text-[12.5px] font-semibold tracking-tight squircle-sm text-halo-cyan"
    style={{ background: 'var(--glass-strong-bg)', border: '1px solid var(--glass-strong-border)' }}>
    Sign In
  </button>
  <button className="flex-1 py-2.5 sf text-[12.5px] font-semibold tracking-tight squircle-sm text-white/55">
    Sign Up
  </button>
</div>`}
        >
          <div className="lg-glass squircle-md p-1 flex gap-1" style={{ maxWidth: 360 }}>
            <button
              className="flex-1 py-2.5 sf text-[12.5px] font-semibold tracking-tight squircle-sm text-halo-cyan"
              style={{
                background: 'var(--glass-strong-bg)',
                boxShadow: 'inset 0 1px 0 var(--glass-strong-inset-top), 0 2px 8px -2px rgba(0,0,0,0.08)',
                border: '1px solid var(--glass-strong-border)',
              }}
            >
              Sign In
            </button>
            <button className="flex-1 py-2.5 sf text-[12.5px] font-semibold tracking-tight squircle-sm" style={{ color: 'var(--text-muted)', border: '1px solid transparent' }}>
              Sign Up
            </button>
          </div>
        </Card>
      </div>
    </div>
  ),
};
