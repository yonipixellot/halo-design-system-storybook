import type { Meta, StoryObj } from '@storybook/react';

const TierCard = ({ klass, label, blur }: { klass: string; label: string; blur: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div
      className={`${klass} squircle-md`}
      style={{ height: 160, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div className="sf" style={{ fontSize: 12, color: 'var(--text-primary)' }}>
        {label}
      </div>
    </div>
    <div>
      <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-primary)' }}>.{klass}</div>
      <div className="sf" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{blur}</div>
    </div>
  </div>
);

const meta = {
  title: 'Tokens/Glass',
  parameters: { wrapper: 'docs' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const All: Story = {
  render: () => (
    <div style={{ color: 'var(--text-primary)', maxWidth: 1280, position: 'relative' }}>
      {/* Atmosphere behind so glass has something to refract */}
      <div className="lg-atmosphere" style={{ borderRadius: 24, marginBottom: 24, position: 'relative', height: 80 }} />

      <h2 className="sf-display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 6 }}>
        Glass tiers
      </h2>
      <p className="sf" style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 720 }}>
        Three blur intensities. Pick by purpose, not by aesthetic preference.
      </p>

      <div className="lg-atmosphere" style={{ position: 'relative', borderRadius: 24, marginBottom: 32, padding: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, position: 'relative', zIndex: 1 }}>
          <TierCard klass="lg-glass" label="Light glass" blur="24px blur · floating elements" />
          <TierCard klass="lg-glass-card" label="Card glass" blur="36px blur · most cards (most common)" />
          <TierCard klass="lg-glass-strong" label="Strong glass" blur="48px blur · sheets, raised surfaces" />
        </div>
      </div>

      <h3 className="sf-display" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.015em', marginBottom: 14 }}>
        Effects
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
        <div>
          <button className="lg-btn-primary lg-shine lg-aura squircle-md sf" style={{ width: '100%', padding: '14px 0', fontSize: 14.5, fontWeight: 600 }}>
            Primary CTA · lg-btn-primary lg-shine lg-aura
          </button>
          <div className="font-mono" style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 8 }}>
            .lg-btn-primary · adaptive cream pill, cyan ambient ring, top-edge highlight
          </div>
        </div>
        <div>
          <button className="lg-glass squircle-md sf" style={{ width: '100%', padding: '12px 0', fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>
            Secondary · lg-glass
          </button>
          <div className="font-mono" style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 8 }}>
            .lg-glass · used for "Continue with Apple/Google", back chips
          </div>
        </div>
        <div>
          <div className="lg-shine squircle-md" style={{ height: 80, background: 'var(--glass-card-bg)', backdropFilter: 'blur(36px) saturate(180%)', border: '1px solid var(--glass-card-border)', position: 'relative', overflow: 'hidden' }}>
            <div className="sf" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--text-primary)' }}>
              Hover for sheen sweep
            </div>
          </div>
          <div className="font-mono" style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 8 }}>
            .lg-shine · 800ms diagonal sweep on hover
          </div>
        </div>
        <div>
          <div className="lg-aura squircle-md" style={{ height: 80, background: 'var(--glass-card-bg)', backdropFilter: 'blur(36px) saturate(180%)', border: '1px solid var(--glass-card-border)', position: 'relative' }}>
            <div className="sf" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--text-primary)' }}>
              Hover for cyan/violet aura
            </div>
          </div>
          <div className="font-mono" style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 8 }}>
            .lg-aura · cyan + violet halo, fades in on hover/focus
          </div>
        </div>
      </div>

      <h3 className="sf-display" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.015em', marginBottom: 14 }}>
        Atmosphere
      </h3>
      <div style={{ position: 'relative', height: 240, borderRadius: 16, overflow: 'hidden', marginBottom: 14 }}>
        <div className="lg-atmosphere" />
      </div>
      <div
        className="font-mono"
        style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'pre-wrap', lineHeight: 1.7, padding: 16, background: 'var(--glass-card-bg)', borderRadius: 12, border: '1px solid var(--hairline)' }}
      >{`base: linear-gradient(180deg, var(--atm-base-start) 0%, var(--atm-base-mid) 60%, var(--atm-base-end) 100%)
+ radial 50% 35% at 15% 10% → var(--atm-tint-1)  // cyan
+ radial 45% 35% at 90% 24% → var(--atm-tint-2)  // violet
+ radial 55% 40% at 50% 95% → var(--atm-tint-3)  // pink
+ noise overlay (3px / 7px stippled mix-blend overlay)
+ drift: translate3d(-3%, 1.5%) scale(1.06) over 36s`}</div>
    </div>
  ),
};
