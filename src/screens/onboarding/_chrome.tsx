import type { ReactNode } from 'react';

/* Verbatim port: halo-v3.2-glass.html lines 6430-6480 */

export const OnboardStepper = ({
  step,
  total,
  onBack,
  label,
}: {
  step: number;
  total: number;
  onBack?: () => void;
  label?: string;
}) => (
  <div
    className="shrink-0 relative z-20 px-5 pt-12 pb-3"
    style={{
      background:
        'linear-gradient(180deg, var(--header-fade-start) 0%, var(--header-fade-mid) 80%, transparent 100%)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }}
  >
    <div className="flex items-center justify-between mb-3">
      {onBack ? (
        <button
          onClick={onBack}
          className="w-9 h-9 lg-glass squircle-sm flex items-center justify-center text-white/85"
        >
          <svg
            width={13}
            height={13}
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8.5 2.5 L4 7 L8.5 11.5" />
          </svg>
        </button>
      ) : (
        <div className="w-9" />
      )}
      <span className="sf text-[10px] font-bold tracking-[0.18em] uppercase text-halo-cyan">
        {label || `Step ${step} of ${total}`}
      </span>
      <div className="w-9" />
    </div>
    <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--hairline-strong)' }}>
      <div
        className="h-full rounded-full bg-halo-cyan"
        style={{
          width: `${(step / total) * 100}%`,
          boxShadow: '0 0 10px rgba(0,214,254,0.6)',
          transition: 'width 380ms cubic-bezier(.2,.8,.2,1)',
        }}
      />
    </div>
  </div>
);

export const OnboardDock = ({ children }: { children: ReactNode }) => (
  <div
    className="shrink-0 px-5 pb-6 pt-4"
    style={{
      position: 'relative',
      flexShrink: 0,
      minHeight: 110,
      zIndex: 30,
      background:
        'linear-gradient(180deg, var(--bottom-fade-start) 0%, var(--bottom-fade-mid) 35%, var(--bottom-fade-end) 100%)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderTop: '1px solid var(--hairline)',
    }}
  >
    {children}
  </div>
);
