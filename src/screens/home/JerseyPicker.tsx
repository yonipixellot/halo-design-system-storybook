import { useState } from 'react';
import { JERSEY_COLORS, type JerseyColor } from './_data';

/* Verbatim port: halo-v3.2-glass.html lines 8628-8758.
   Three-stage conversational flow inside GameCardPre:
     Stage 1 ('detected')  — system says "we see you in X, right?" + 2 CTAs.
     Stage 2 ('pick')      — manual override with home + away color swatches.
     Stage 3 ('confirmed') — slim cyan acknowledgement pill.
   All stages use glass tokens. */

export interface JerseyPickerProps {
  /** Fired with the selected color id when the user confirms. */
  onConfirm?: (colorId: string) => void;
  /** Fired with the toast message — wire to your toast system. */
  onToast?: (msg: string) => void;
  /** Optional starting stage — useful for stories. */
  initialStage?: 'detected' | 'pick' | 'confirmed';
  /** Optional pre-detected color — first JERSEY_COLORS entry by default. */
  initialDetected?: JerseyColor;
}

export const JerseyPicker = ({
  onConfirm,
  onToast,
  initialStage = 'detected',
  initialDetected,
}: JerseyPickerProps) => {
  const [stage, setStage] = useState(initialStage);
  const [detected] = useState(initialDetected ?? JERSEY_COLORS[0]);
  const [home, setHome] = useState(JERSEY_COLORS[0]);
  const [away, setAway] = useState(JERSEY_COLORS[3]);

  const confirmDetected = () => {
    onConfirm?.(detected.id);
    onToast?.(`Locked in · ${detected.name}`);
    setStage('confirmed');
  };
  const saveManual = () => {
    onConfirm?.(home.id);
    onToast?.(`Saved · home ${home.name} / away ${away.name}`);
    setStage('confirmed');
  };

  const eyebrow = (text: string) => (
    <div
      className="sf text-[10px] tracking-[0.16em] uppercase font-bold mb-2.5"
      style={{ color: 'var(--brand-cyan-text)' }}
    >
      {text}
    </div>
  );

  const sectionWrap = (children: React.ReactNode) => (
    <div
      className="relative z-10 mt-4 pt-3.5"
      style={{ borderTop: '1px dashed var(--hairline-strong)' }}
    >
      {children}
    </div>
  );

  const ctaPrimary = (label: string, onClick: () => void) => (
    <button
      onClick={onClick}
      className="lg-btn-primary lg-shine squircle-sm py-2 sf text-[11.5px] font-semibold"
    >
      {label}
    </button>
  );

  const ctaSecondary = (label: string, onClick: () => void) => (
    <button
      onClick={onClick}
      className="squircle-sm py-2 sf text-[11.5px] font-semibold lg-glass"
      style={{ color: 'var(--text-primary)' }}
    >
      {label}
    </button>
  );

  if (stage === 'detected') {
    return sectionWrap(
      <>
        {eyebrow('Jersey detection')}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 squircle-sm shrink-0"
            style={{
              backgroundColor: detected.fill,
              border: '1px solid var(--hairline-strong)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 10px -4px rgba(0,0,0,0.40)',
            }}
          />
          <div
            className="flex-1 sf text-[12.5px] leading-snug"
            style={{ color: 'var(--text-secondary)' }}
          >
            We recognized you play in{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{detected.name.toLowerCase()}</strong>{' '}
            today. Is that right?
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {ctaPrimary('Yes, lock it in', confirmDetected)}
          {ctaSecondary('No, change', () => setStage('pick'))}
        </div>
      </>,
    );
  }

  if (stage === 'pick') {
    const cycle = (current: JerseyColor, setCurrent: (c: JerseyColor) => void) => {
      const idx = JERSEY_COLORS.findIndex((c) => c.id === current.id);
      setCurrent(JERSEY_COLORS[(idx + 1) % JERSEY_COLORS.length]);
    };
    const swatch = (c: JerseyColor, onTap: () => void, label: string) => (
      <button
        onClick={onTap}
        className="w-full aspect-square squircle-sm flex items-center justify-center shrink-0 lg-aura"
        style={{
          backgroundColor: c.fill,
          border: '1px solid var(--hairline-strong)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 12px -4px rgba(0,0,0,0.40)',
        }}
        aria-label={`${label} ${c.name} — tap to change`}
      />
    );
    return sectionWrap(
      <>
        {eyebrow('Pick your kit')}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div
              className="sf text-[10px] tracking-[0.12em] uppercase font-semibold mb-1.5"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Home · {home.name}
            </div>
            {swatch(home, () => cycle(home, setHome), 'Home')}
          </div>
          <div>
            <div
              className="sf text-[10px] tracking-[0.12em] uppercase font-semibold mb-1.5"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Away · {away.name}
            </div>
            {swatch(away, () => cycle(away, setAway), 'Away')}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {ctaSecondary('Back', () => setStage('detected'))}
          {ctaPrimary('Save', saveManual)}
        </div>
      </>,
    );
  }

  /* Confirmed — slim cyan acknowledgement pill */
  return (
    <div
      className="relative z-10 mt-4 pt-3.5 flex items-center gap-2"
      style={{ borderTop: '1px dashed var(--hairline-strong)' }}
    >
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'var(--brand-cyan-soft)', border: '1px solid var(--brand-cyan-border)' }}
      >
        <svg
          width={11}
          height={11}
          viewBox="0 0 14 14"
          fill="none"
          stroke="var(--brand-cyan-text)"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 11, height: 11, display: 'block' }}
        >
          <path d="M3 7 L6 10 L11 4" />
        </svg>
      </div>
      <span className="sf text-[11.5px]" style={{ color: 'var(--text-secondary)' }}>
        Jersey locked in · we'll tag your moments tonight
      </span>
    </div>
  );
};
