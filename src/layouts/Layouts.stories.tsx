import type { Meta, StoryObj } from '@storybook/react';
import { BREAKPOINTS } from '@/lib/responsive';

/* Layouts & Breakpoints — single docs page for the responsive system.
   Docs-style: full canvas, prose + diagrams, no phone shell. Pulls
   numbers from src/lib/responsive.ts so the page never goes stale. */

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section style={{ marginBlockEnd: 56 }}>
    <h2
      className="sf-display"
      style={{
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        marginBlockEnd: 16,
        color: 'var(--text-primary)',
      }}
    >
      {title}
    </h2>
    {children}
  </section>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p
    className="sf"
    style={{
      fontSize: 14.5,
      lineHeight: 1.65,
      color: 'var(--text-tertiary)',
      maxWidth: 720,
      marginBlockEnd: 12,
    }}
  >
    {children}
  </p>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <code
    style={{
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 12.5,
      padding: '1px 6px',
      background: 'var(--glass-card-bg)',
      border: '1px solid var(--glass-card-border)',
      borderRadius: 4,
      color: 'var(--text-primary)',
    }}
  >
    {children}
  </code>
);

/* === Visual: viewport diagram (phone | tablet | desktop) === */
const ViewportDiagram = () => {
  const items = [
    { label: 'Phone', range: '<640', width: 60, h: 130 },
    { label: 'Tablet', range: '768–1023', width: 110, h: 150 },
    { label: 'Desktop', range: '≥1024', width: 220, h: 150 },
    { label: 'Desktop XL', range: '≥1280', width: 290, h: 150 },
  ];
  return (
    <div
      style={{
        display: 'flex',
        gap: 32,
        alignItems: 'flex-end',
        padding: '32px 24px',
        background: 'var(--glass-card-bg)',
        border: '1px solid var(--glass-card-border)',
        borderRadius: 16,
        marginBlockEnd: 12,
        flexWrap: 'wrap',
      }}
    >
      {items.map((it) => (
        <div key={it.label} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: it.width,
              height: it.h,
              background: 'var(--canvas-bg)',
              border: '1.5px solid var(--brand-cyan)',
              borderRadius: 12,
              boxShadow: '0 4px 16px -4px rgba(0,214,254,0.25)',
              marginBlockEnd: 10,
            }}
          />
          <div
            className="sf-display"
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            {it.label}
          </div>
          <div
            className="sf"
            style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginBlockStart: 2 }}
          >
            {it.range}px
          </div>
        </div>
      ))}
    </div>
  );
};

/* === Visual: app shell zones (side nav | main | right rail) === */
const ShellDiagram = () => (
  <div
    style={{
      display: 'flex',
      gap: 12,
      padding: 20,
      background: 'var(--glass-card-bg)',
      border: '1px solid var(--glass-card-border)',
      borderRadius: 16,
      marginBlockEnd: 12,
    }}
  >
    <div
      style={{
        width: 90,
        height: 220,
        background: 'var(--canvas-bg-soft)',
        border: '1px solid var(--brand-cyan-border)',
        borderRadius: 8,
        padding: 8,
        color: 'var(--brand-cyan-text)',
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      SideNav
      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBlockStart: 2 }}>
        240 / 280
      </div>
    </div>
    <div
      style={{
        flex: 1,
        height: 220,
        background: 'var(--canvas-bg-soft)',
        border: '1px solid var(--hairline)',
        borderRadius: 8,
        padding: 8,
        color: 'var(--text-primary)',
        fontSize: 11,
        fontWeight: 600,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: 32,
          marginBlockEnd: 8,
          background: 'var(--canvas-bg)',
          border: '1px dashed var(--hairline)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          paddingInline: 8,
          fontSize: 10,
          color: 'var(--text-tertiary)',
        }}
      >
        AppHeader · 64
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Main · max-w 720
      </div>
    </div>
    <div
      style={{
        width: 130,
        height: 220,
        background: 'var(--canvas-bg-soft)',
        border: '1px solid var(--hairline)',
        borderRadius: 8,
        padding: 8,
        color: 'var(--text-primary)',
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      RightRail
      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBlockStart: 2 }}>
        320 / 360
      </div>
    </div>
  </div>
);

const Layouts = () => (
  <div style={{ maxWidth: 880 }}>
    <h1
      className="sf-display"
      style={{
        fontSize: 32,
        fontWeight: 800,
        letterSpacing: '-0.025em',
        marginBlockEnd: 8,
        color: 'var(--text-primary)',
      }}
    >
      Layouts &amp; breakpoints
    </h1>
    <p
      className="sf"
      style={{
        fontSize: 15,
        lineHeight: 1.6,
        color: 'var(--text-tertiary)',
        marginBlockEnd: 40,
        maxWidth: 700,
      }}
    >
      Halo is phone-first. The same screens reflow into tablet and desktop layouts via
      a small set of layout primitives (<Code>AppShell</Code>, <Code>SplitHero</Code>,{' '}
      <Code>SideNav</Code>, <Code>AppHeader</Code>, <Code>RightRail</Code>) and the
      Tailwind default breakpoints.
    </p>

    <Section title="Breakpoints">
      <P>
        Tailwind defaults — single source of truth in <Code>src/lib/responsive.ts</Code>.
        Use the <Code>sm:</Code> / <Code>md:</Code> / <Code>lg:</Code> / <Code>xl:</Code>{' '}
        utilities, or the <Code>useViewport()</Code> / <Code>useIsAtLeast()</Code> hooks
        when behaviour (not just CSS) needs to diverge.
      </P>
      <table
        className="sf"
        style={{
          fontSize: 13,
          borderCollapse: 'collapse',
          width: '100%',
          maxWidth: 560,
          marginBlockEnd: 16,
        }}
      >
        <thead>
          <tr style={{ borderBlockEnd: '1px solid var(--hairline-strong)' }}>
            <th style={{ textAlign: 'start', padding: '8px 12px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
              Key
            </th>
            <th style={{ textAlign: 'start', padding: '8px 12px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
              Min width
            </th>
            <th style={{ textAlign: 'start', padding: '8px 12px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
              Maps to
            </th>
          </tr>
        </thead>
        <tbody>
          {(Object.keys(BREAKPOINTS) as Array<keyof typeof BREAKPOINTS>).map((k) => {
            const labels: Record<string, string> = {
              sm: 'Wide phone',
              md: 'Tablet portrait',
              lg: 'Desktop / tablet landscape',
              xl: 'Desktop comfortable',
              '2xl': 'Large monitor',
            };
            return (
              <tr key={k} style={{ borderBlockEnd: '1px solid var(--hairline-soft)' }}>
                <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {k}
                </td>
                <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>
                  {BREAKPOINTS[k]}px
                </td>
                <td style={{ padding: '10px 12px', color: 'var(--text-tertiary)' }}>
                  {labels[k]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Section>

    <Section title="Viewport buckets">
      <P>
        The decorator switches story chrome based on these four buckets. Components
        themselves use Tailwind utilities; this layer is just for the Storybook frame.
      </P>
      <ViewportDiagram />
    </Section>

    <Section title="App shell zones">
      <P>
        Post-login pages compose <Code>AppShell</Code>, which renders the <Code>SideNav</Code>{' '}
        + <Code>AppHeader</Code> + <Code>Main</Code> + optional <Code>RightRail</Code> at{' '}
        <Code>lg+</Code>. Below <Code>lg</Code> the shell is a passthrough — the page's
        own phone chrome (page header, bottom dock) takes over.
      </P>
      <ShellDiagram />
      <P>
        Side nav lives at <Code>inline-start</Code> (RTL flips it). Right rail at{' '}
        <Code>inline-end</Code>. Main column constrains to <Code>720px</Code> by default.
      </P>
    </Section>

    <Section title="Pre-login: SplitHero">
      <P>
        Auth and both onboarding orchestrators use <Code>SplitHero</Code> on desktop —
        a brand panel on the inline-start edge (~55%) and a content panel on the
        inline-end edge (~45%). Below <Code>lg</Code> the brand panel is hidden and
        only the content panel renders, so phone screens are unaffected.
      </P>
      <div
        style={{
          display: 'flex',
          gap: 12,
          padding: 20,
          background: 'var(--glass-card-bg)',
          border: '1px solid var(--glass-card-border)',
          borderRadius: 16,
        }}
      >
        <div
          style={{
            flexBasis: '55%',
            height: 220,
            background:
              'radial-gradient(circle at 30% 40%, rgba(0,214,254,0.20) 0%, transparent 60%), var(--canvas-bg-soft)',
            border: '1px solid var(--hairline)',
            borderRadius: 8,
            padding: 12,
            color: 'var(--text-primary)',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Brand panel
          <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginBlockStart: 4 }}>
            atmosphere · hero copy · illustration
          </div>
        </div>
        <div
          style={{
            flexBasis: '45%',
            height: 220,
            background: 'var(--canvas-bg-soft)',
            border: '1px solid var(--hairline)',
            borderRadius: 8,
            padding: 12,
            color: 'var(--text-primary)',
            fontSize: 12,
            fontWeight: 600,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Content panel
          <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginBlockStart: 4 }}>
            form · funnel step · CTA
          </div>
        </div>
      </div>
    </Section>

    <Section title="How to test responsive in Storybook">
      <P>
        Use the viewport switcher in the toolbar (Phone / Tablet / Desktop / Desktop XL).
        The decorator renders the canonical 393×852 phone shell at Phone, an 834×1112
        tablet shell at Tablet, and full-bleed canvas at Desktop and above — so the
        AppShell layout fills the canvas as it would in production.
      </P>
      <P>
        Light / dark choice persists via <Code>localStorage</Code>; navigating between
        stories preserves both the theme and the viewport selection.
      </P>
    </Section>
  </div>
);

const meta: Meta = {
  title: 'Documentation/Layouts & breakpoints',
  parameters: {
    wrapper: 'docs',
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Layouts & breakpoints',
  render: () => <Layouts />,
};
