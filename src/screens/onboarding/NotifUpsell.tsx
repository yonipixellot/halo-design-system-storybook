import { useTranslation } from 'react-i18next';

/* NotifUpsell — pre-prompt screen for push notifications.
   Shown after the player finishes onboarding; tapping the primary CTA
   triggers the native iOS/Android permission dialog (in production —
   for the storybook demo, both buttons just close to Home).

   Pattern rationale: a soft pre-prompt converts ~2x higher than going
   straight to the native dialog. The user mentally commits before the
   native modal fires. */

export interface NotifUpsellProps {
  onAllow: () => void;
  onSkip: () => void;
}

export const NotifUpsell = ({ onAllow, onSkip }: NotifUpsellProps) => {
  const { t } = useTranslation();

  const PERKS = [
    t('notifUpsell.perk1'),
    t('notifUpsell.perk2'),
    t('notifUpsell.perk3'),
  ];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-14 pb-[120px] anim-fade flex flex-col">
      {/* Hero block — centered */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Bell with cyan halo */}
        <div className="relative mb-8" style={{ width: 120, height: 120 }}>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(0,214,254,0.55) 0%, transparent 65%)',
              filter: 'blur(20px)',
            }}
          />
          <div
            className="relative rounded-full lg-glass-strong flex items-center justify-center"
            style={{
              width: 120,
              height: 120,
              border: '2.5px solid var(--brand-cyan)',
              boxShadow:
                '0 0 50px -8px rgba(0,214,254,0.55), 0 12px 40px -12px rgba(0,0,0,0.55)',
              color: 'var(--brand-cyan-text)',
            }}
          >
            <svg
              width={56}
              height={56}
              viewBox="0 0 56 56"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: 56, height: 56, display: 'block' }}
              aria-hidden="true"
            >
              <path d="M14 26 a14 14 0 0 1 28 0 v8 l4 6 H10 l4 -6 Z" />
              <path d="M22 42 a6 6 0 0 0 12 0" />
            </svg>
          </div>
          {/* Tiny pulse dot top-right */}
          <div
            className="absolute rounded-full anim-pulse-dot"
            style={{
              top: 4,
              insetInlineEnd: 4,
              width: 18,
              height: 18,
              background: 'var(--brand-cyan)',
              boxShadow: '0 0 14px var(--brand-cyan-glow), 0 0 0 3px var(--canvas-bg)',
            }}
          />
        </div>

        {/* Title */}
        <h1
          className="sf-display font-bold text-white leading-[1.05] tracking-[-0.025em] mb-3"
          style={{ fontSize: 28 }}
        >
          {t('notifUpsell.title')}
        </h1>

        {/* Body */}
        <p
          className="sf text-[14px] leading-relaxed mb-7 max-w-[300px]"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {t('notifUpsell.body')}
        </p>

        {/* Perks list */}
        <ul className="space-y-3 mb-2 w-full max-w-[300px]">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-center gap-3 text-start">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: 'var(--brand-cyan-soft)',
                  border: '1px solid var(--brand-cyan-border)',
                  color: 'var(--brand-cyan-text)',
                }}
              >
                <svg
                  width={14}
                  height={14}
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: 14, height: 14, display: 'block' }}
                >
                  <path d="M3 7 L6 10 L11 4" />
                </svg>
              </span>
              <span
                className="sf text-[13.5px] font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {perk}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTAs */}
      <div className="shrink-0 mt-6 space-y-3">
        <button
          onClick={onAllow}
          className="lg-btn-primary lg-shine lg-aura squircle-md py-4 w-full sf text-[14.5px] font-semibold"
        >
          {t('notifUpsell.allow')}
        </button>
        <button
          onClick={onSkip}
          className="w-full sf text-[12.5px] py-1 text-center"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {t('notifUpsell.skip')}
        </button>
      </div>
    </div>
  );
};
