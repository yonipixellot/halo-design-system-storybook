import type { ReactNode } from 'react';

/* WizardRail — desktop layout for multi-step onboarding flows
   (TeamsStepLocked, ClaimAndFollow, parent/fan team-and-player picks).

   Below lg: passthrough — phone treatment is unchanged.

   At lg+: a vertical rail on the inline-start edge (~280 wide) shows
   step progress and contextual chrome (eyebrow, title, current
   explainer, sticky Continue CTA). The content area on the inline-end
   edge holds the actual step content (locked-team hero + accordion,
   roster grid, etc.) and scrolls independently.

   Step rail composition:
     - eyebrow     : "STEP 1 OF 2" small caps
     - stepList    : [{ key, label, status: 'done' | 'current' | 'todo' }]
     - title       : current step title
     - description : 1-2 sentence explainer
     - cta         : Continue button (or whatever the page wants pinned)

   The rail itself uses inline-start so it RTL-flips. The CTA inside
   the rail is constrained to 240px wide (smaller than .cta-constrained
   because the rail is only 280 wide). */

export interface WizardStep {
  key: string;
  label: string;
  status: 'done' | 'current' | 'todo';
}

export interface WizardRailProps {
  /** Step number / total — rendered as the rail eyebrow. */
  step: number;
  total: number;
  /** All steps with status. The rail draws a connected indicator. */
  steps: WizardStep[];
  /** Title of the current step (rail). */
  title: string;
  /** 1–2 sentence explainer (rail). */
  description?: string;
  /** Slot for the Continue CTA — pinned to bottom of the rail. Pages
      pass their own button so they control disabled state, label, etc. */
  cta?: ReactNode;
  /** Optional secondary action below the CTA (e.g. Back). */
  secondaryAction?: ReactNode;
  /** The actual step content — fills the inline-end column. */
  children: ReactNode;
  /** Outer max-width at lg+. Default 1200, matching HomeShell — keeps
      the rail+content composite anchored on wide canvases instead of
      drifting in 1920+ voids. Pass 'full' to opt out. */
  contentMaxWidth?: number | 'full';
}

const StepDot = ({ status }: { status: WizardStep['status'] }) => (
  <div
    className="shrink-0 rounded-full"
    style={{
      width: 10,
      height: 10,
      background:
        status === 'done'
          ? 'var(--brand-cyan)'
          : status === 'current'
            ? 'var(--brand-cyan)'
            : 'transparent',
      border:
        status === 'todo'
          ? '1.5px solid var(--hairline-strong)'
          : status === 'current'
            ? '2px solid var(--brand-cyan)'
            : 'none',
      boxShadow:
        status === 'current' ? '0 0 0 4px var(--brand-cyan-soft)' : undefined,
    }}
  />
);

export const WizardRail = ({
  step,
  total,
  steps,
  title,
  description,
  cta,
  secondaryAction,
  children,
  contentMaxWidth = 1200,
}: WizardRailProps) => {
  return (
    <div
      className="lg:flex lg:min-h-screen w-full lg:mx-auto"
      style={{
        maxWidth: contentMaxWidth === 'full' ? undefined : contentMaxWidth,
      }}
    >
      {/* Rail — hidden below lg; pages keep their phone OnboardStepper */}
      <aside
        className="hidden lg:flex lg:flex-col shrink-0 sticky top-0 h-screen"
        style={{
          width: 280,
          paddingBlock: 32,
          paddingInline: 24,
          background: 'var(--canvas-bg-soft)',
          borderInlineEnd: '1px solid var(--hairline)',
        }}
      >
        {/* Eyebrow */}
        <div
          className="sf text-[10.5px] font-bold tracking-[0.18em] uppercase mb-5"
          style={{ color: 'var(--brand-cyan-text)' }}
        >
          Step {step} of {total}
        </div>

        {/* Step list */}
        <ul className="space-y-2.5 mb-7">
          {steps.map((s) => (
            <li key={s.key} className="flex items-center gap-2.5">
              <StepDot status={s.status} />
              <span
                className="sf text-[12.5px]"
                style={{
                  color:
                    s.status === 'current'
                      ? 'var(--text-primary)'
                      : s.status === 'done'
                        ? 'var(--text-tertiary)'
                        : 'var(--text-faint)',
                  fontWeight: s.status === 'current' ? 600 : 500,
                }}
              >
                {s.label}
              </span>
            </li>
          ))}
        </ul>

        {/* Current step title + description */}
        <h2
          className="sf-display text-[19px] font-bold tracking-[-0.015em] mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h2>
        {description && (
          <p
            className="sf text-[12.5px] leading-relaxed"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {description}
          </p>
        )}

        {/* Spacer pushes the CTA to the bottom */}
        <div className="flex-1" />

        {/* Pinned CTA */}
        {cta && <div style={{ maxWidth: 240 }}>{cta}</div>}
        {secondaryAction && (
          <div className="mt-2" style={{ maxWidth: 240 }}>
            {secondaryAction}
          </div>
        )}
      </aside>

      {/* Content — fills the rest at lg+, full width below */}
      <main className="flex-1 min-w-0 lg:py-8 lg:px-10 xl:px-14 lg:overflow-y-auto">
        <div className="mx-auto w-full" style={{ maxWidth: 720 }}>
          {children}
        </div>
      </main>
    </div>
  );
};
