import type { Meta, StoryObj } from '@storybook/react';
import { AppleIcon, GoogleIcon } from '@/screens/auth/_shared';

const Cell = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      padding: 18,
      borderRadius: 12,
      border: '1px solid var(--hairline)',
      background: 'var(--glass-card-bg)',
      minHeight: 96,
    }}
  >
    <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
      {children}
    </div>
    <div className="font-mono" style={{ fontSize: 10.5, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
      {label}
    </div>
  </div>
);

const Group = ({ title, cols, children }: { title: string; cols: number; children: React.ReactNode }) => (
  <section style={{ marginBottom: 36 }}>
    <h3
      className="sf-display"
      style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em', marginBottom: 14 }}
    >
      {title}
    </h3>
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 12 }}>
      {children}
    </div>
  </section>
);

const meta = {
  title: 'Tokens/Icons',
  parameters: { wrapper: 'docs' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const All: Story = {
  render: () => (
    <div style={{ color: 'var(--text-primary)', maxWidth: 1280 }}>
      <h2 className="sf-display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 6 }}>
        Icons
      </h2>
      <p className="sf" style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, maxWidth: 720 }}>
        Inline SVG with <code>stroke="currentColor"</code>. No icon library. Sized 14–22px depending on context.
      </p>

      <Group title="Branded" cols={6}>
        <Cell label="<AppleIcon />"><AppleIcon /></Cell>
        <Cell label="<GoogleIcon />"><GoogleIcon /></Cell>
      </Group>

      <Group title="Navigation" cols={6}>
        <Cell label="Chevron back · 14">
          <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 2.5 L4 7 L8.5 11.5" />
          </svg>
        </Cell>
        <Cell label="Chevron forward · 14">
          <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5.5 2.5 L10 7 L5.5 11.5" />
          </svg>
        </Cell>
        <Cell label="Hamburger · 14×10">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="0" y1="1" x2="14" y2="1" />
            <line x1="0" y1="5" x2="14" y2="5" />
            <line x1="0" y1="9" x2="14" y2="9" />
          </svg>
        </Cell>
      </Group>

      <Group title="Action" cols={6}>
        <Cell label="Bell · 15">
          <svg width={15} height={15} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.7 10.3h8.6V8.6c0-.4-.16-.78-.44-1.06l-.56-.56V5.5a3.3 3.3 0 1 0-6.6 0v1.48l-.56.56c-.28.28-.44.66-.44 1.06v1.7Z" />
            <path d="M5.5 10.3a1.5 1.5 0 0 0 3 0" />
          </svg>
        </Cell>
        <Cell label="Search · 16">
          <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <circle cx={7} cy={7} r={5} />
            <path d="M11 11 L14 14" />
          </svg>
        </Cell>
        <Cell label="Close · 11">
          <svg width={11} height={11} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
            <path d="M3 3 L11 11 M11 3 L3 11" />
          </svg>
        </Cell>
        <Cell label="Plus · 14">
          <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
            <path d="M7 2 V12 M2 7 H12" />
          </svg>
        </Cell>
        <Cell label="Check sm · 12 (button)">
          <svg width={12} height={12} viewBox="0 0 14 14" fill="none" stroke="#000" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7 L6 10 L11 4" />
          </svg>
        </Cell>
        <Cell label="Check lg · 28 (success)">
          <svg width={28} height={28} viewBox="0 0 28 28" fill="none" stroke="#00D6FE" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 14 L11 20 L23 8" />
          </svg>
        </Cell>
      </Group>

      <Group title="Theme & state" cols={6}>
        <Cell label="Moon · 15">
          <svg width={15} height={15} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11.6 8.7A4.6 4.6 0 0 1 5.3 2.4a5 5 0 1 0 6.3 6.3Z" />
          </svg>
        </Cell>
        <Cell label="Sun · 15">
          <svg width={15} height={15} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="7" r="2.4" />
            <path d="M7 1.4v1.5M7 11.1v1.5M1.4 7h1.5M11.1 7h1.5M3 3l1.05 1.05M9.95 9.95L11 11M3 11l1.05-1.05M9.95 4.05L11 3" />
          </svg>
        </Cell>
        <Cell label="Envelope · 28 (forgot-sent)">
          <svg width={28} height={28} viewBox="0 0 28 28" fill="none" stroke="#00D6FE" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7l11 7L25 7" />
            <rect x={3} y={6} width={22} height={16} rx={2} />
          </svg>
        </Cell>
      </Group>

      <Group title="Personas (onboarding)" cols={4}>
        <Cell label="Player · 22">
          <svg width={22} height={22} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 9 a3 3 0 1 0 0 -6 a3 3 0 1 0 0 6 Z M3 17 c0 -3.5 3 -6 7 -6 s7 2.5 7 6" />
          </svg>
        </Cell>
        <Cell label="Parent · 22">
          <svg width={22} height={22} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 8 a3 3 0 1 0 0 -6 a3 3 0 1 0 0 6 Z M15 8 a3 3 0 1 0 0 -6 a3 3 0 1 0 0 6 Z M2 17 c0 -3 2 -5 5 -5 M13 12 c3 0 5 2 5 5 M10 17 c-1.5 0 -2.5 -1 -2.5 -2.5 s1 -2.5 2.5 -2.5 s2.5 1 2.5 2.5 S 11.5 17 10 17 Z" />
          </svg>
        </Cell>
        <Cell label="Fan · 22">
          <svg width={22} height={22} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2 L12.6 7.4 L18.5 8.3 L14.2 12.4 L15.3 18.3 L10 15.5 L4.7 18.3 L5.8 12.4 L1.5 8.3 L7.4 7.4 Z" />
          </svg>
        </Cell>
        <Cell label="Coach · 22">
          <svg width={22} height={22} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 4 h16 v9 h-7 l-2 3 -2 -3 H2 Z M5 7.5 h10 M5 10.5 h6" />
          </svg>
        </Cell>
      </Group>
    </div>
  ),
};
