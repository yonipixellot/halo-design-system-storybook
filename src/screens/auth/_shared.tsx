import { useState, type ReactNode } from 'react';
import { cls } from '@/lib/cls';

/* ============================================================================
   Verbatim port from halo-v3.2-glass.html lines 4863-5132.
   Shared building blocks for every auth screen.
   ============================================================================ */

export const AuthAtmosphere = ({ children }: { children: ReactNode }) => (
  <div
    className="anim-fade pb-8 text-white sf relative"
    style={{ minHeight: '100%' }}
  >
    <div className="lg-atmosphere" />
    <div
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{
        background:
          'linear-gradient(180deg, var(--vignette-corner) 0%, transparent 30%, transparent 70%, var(--vignette-corner-soft) 100%)',
      }}
    />
    <div className="relative z-10">{children}</div>
  </div>
);

export const HaloWordmark = () => null;

/* === Client logo hero card — shown above auth screens for white-label co-brand. */
export const CLIENT = {
  name: 'Eastside Prep',
  tagline: 'Athletics + Performance',
  initial: 'EP',
  accent: '#0a1f3d',
  hueA: 'rgba(0,214,254,0.40)',
  hueB: 'rgba(132,88,255,0.30)',
};

export const ClientLogoMark = () => (
  <div
    className="relative"
    style={{
      width: 220,
      height: 151,
      flex: '0 0 auto',
      filter: 'drop-shadow(0 0 36px rgba(0,214,254,0.40))',
    }}
  >
    <svg
      width={220}
      height={151}
      viewBox="0 0 236 162"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`${CLIENT.name} logo`}
      style={{ width: 220, height: 151, display: 'block' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M172.355 53.8276L162.262 107.655C161.315 112.797 158.266 115.315 153.22 115.315H69.5293C64.4826 115.315 62.3799 112.797 63.4313 107.655L73.5246 53.8276C74.4708 48.6862 77.5199 46.1679 82.5665 46.1679H166.257C171.304 46.1679 173.406 48.6862 172.355 53.8276ZM182.448 0H83.6179C43.0344 0 19.9038 15.4243 14.1212 46.1679L1.08404 115.42C-4.69859 146.163 12.6493 161.588 53.2328 161.588H152.063C192.647 161.588 215.777 146.163 221.56 115.42L234.597 46.1679C240.38 15.4243 223.032 0 182.448 0Z"
        fill="#00D6FE"
      />
    </svg>
  </div>
);

export const ClientLogoHero = () => (
  <div
    data-theme="dark"
    className="lg:hidden relative w-full overflow-hidden anim-fade lg-keep-dark flex items-center justify-center"
    style={{
      height: 320,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      background:
        'linear-gradient(180deg, transparent 0%, transparent 50%, rgba(0,0,0,0.20) 100%),' +
        CLIENT.accent,
      boxShadow:
        'inset 0 -1px 0 rgba(255,255,255,0.06), 0 24px 60px -24px rgba(0,0,0,0.40)',
      color: '#fff',
    }}
  >
    <ClientLogoMark />
  </div>
);

/* === Sign In / Sign Up segmented toggle — glass pill === */
export type AuthMode = 'signin' | 'signup';
export const AuthModeToggle = ({
  mode,
  onChange,
}: {
  mode: AuthMode;
  onChange: (m: AuthMode) => void;
}) => (
  <div className="lg-glass squircle-md p-1 flex gap-1 mb-6">
    {(
      [
        { key: 'signin', label: 'Sign In' },
        { key: 'signup', label: 'Sign Up' },
      ] as const
    ).map((t) => (
      <button
        key={t.key}
        onClick={() => onChange(t.key)}
        className={cls(
          'flex-1 py-2.5 sf text-[12.5px] font-semibold tracking-tight squircle-sm transition-all',
          mode === t.key ? 'text-halo-cyan' : 'text-white/55',
        )}
        style={
          mode === t.key
            ? {
                background: 'var(--glass-strong-bg)',
                boxShadow:
                  'inset 0 1px 0 var(--glass-strong-inset-top), 0 2px 8px -2px rgba(0,0,0,0.08)',
                border: '1px solid var(--glass-strong-border)',
              }
            : { border: '1px solid transparent' }
        }
      >
        {t.label}
      </button>
    ))}
  </div>
);

export const GlassField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoFocus,
  rightSlot,
  hint,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  rightSlot?: ReactNode;
  hint?: string | null;
  error?: string | null;
}) => {
  const [focused, setFocused] = useState(false);
  const showError = !!error && !focused && !!value;
  return (
    <div>
      <label className="sf text-[10px] tracking-[0.16em] uppercase text-white/55 font-semibold mb-2 block px-1">
        {label}
      </label>
      <div
        className="lg-glass-card squircle-md px-3.5 py-3 flex items-center gap-2"
        style={
          showError
            ? {
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.14), 0 0 0 2px rgba(220,38,38,0.55), 0 12px 40px -12px rgba(0,0,0,0.55)',
                borderColor: 'rgba(220,38,38,0.65)',
              }
            : focused
            ? {
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.14), 0 0 0 2px rgba(0,214,254,0.45), 0 12px 40px -12px rgba(0,0,0,0.55)',
                borderColor: 'rgba(0,214,254,0.55)',
              }
            : undefined
        }
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="auth-input sf text-[15px] flex-1"
        />
        {rightSlot}
      </div>
      {(hint || showError) && (
        <div
          className="sf text-[10.5px] mt-1.5 px-1 leading-snug"
          style={{ color: showError ? '#FCA5A5' : 'rgba(255,255,255,0.45)' }}
        >
          {showError ? error : hint}
        </div>
      )}
    </div>
  );
};

export const GlassSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  autoFocus?: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="sf text-[10px] tracking-[0.16em] uppercase text-white/55 font-semibold mb-2 block px-1">
        {label}
      </label>
      <div
        className="lg-glass-card squircle-md px-3.5 py-3 flex items-center gap-2 relative"
        style={
          focused
            ? {
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.14), 0 0 0 2px rgba(0,214,254,0.45), 0 12px 40px -12px rgba(0,0,0,0.55)',
                borderColor: 'rgba(0,214,254,0.55)',
              }
            : undefined
        }
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="auth-input sf text-[15px] flex-1 appearance-none bg-transparent pe-6"
          style={{ color: value ? 'var(--text-primary)' : 'var(--text-faint)' }}
        >
          <option value="" disabled style={{ color: 'CanvasText' }}>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ color: 'CanvasText' }}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          width={11}
          height={7}
          viewBox="0 0 11 7"
          fill="none"
          className="absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <path
            d="M1 1.5 L5.5 5.5 L10 1.5"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export const AppleIcon = () => (
  <svg width={18} height={18} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M11.182 8.27c0-1.51 1.234-2.231 1.29-2.265-.704-1.026-1.799-1.166-2.187-1.183-.93-.094-1.81.547-2.282.547-.471 0-1.197-.531-1.97-.518-1.014.015-1.948.59-2.469 1.498-1.054 1.825-.27 4.523.755 6.005.5.726 1.097 1.541 1.876 1.512.755-.03 1.039-.488 1.95-.488.91 0 1.166.488 1.962.473.81-.014 1.323-.74 1.819-1.469.572-.842.808-1.659.823-1.7-.018-.008-1.581-.605-1.567-2.412zM9.726 4.07c.408-.495.683-1.18.608-1.86-.587.024-1.298.39-1.72.886-.378.439-.708 1.142-.619 1.811.654.05 1.323-.331 1.731-.837z" />
  </svg>
);

export const GoogleIcon = () => (
  <svg width={18} height={18} viewBox="0 0 18 18" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.614z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
    />
  </svg>
);

/* Used by ForgotPassword / Reset etc. */
export type AuthDispatch = (action: { type: string; step?: string }) => void;

/* === Error banner — top-of-form for non-field errors (network, locked,
       invalid credentials, email taken, etc.) === */
export const AuthErrorBanner = ({ message }: { message?: string | null }) => {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mb-4 squircle-md px-4 py-3 flex items-start gap-3 anim-fade"
      style={{
        background: 'rgba(220,38,38,0.10)',
        border: '1px solid rgba(220,38,38,0.45)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 24px -10px rgba(220,38,38,0.30)',
      }}
    >
      <svg
        width={16}
        height={16}
        viewBox="0 0 16 16"
        fill="none"
        stroke="rgba(252,165,165,0.95)"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0, marginTop: 1, width: 16, height: 16, display: 'block' }}
        aria-hidden="true"
      >
        <path d="M8 2 L14.5 13 L1.5 13 Z" />
        <path d="M8 6 L8 9" />
        <path d="M8 11 L8 11.5" />
      </svg>
      <span
        className="sf text-[12.5px] leading-relaxed"
        style={{ color: 'rgba(252,165,165,0.95)' }}
      >
        {message}
      </span>
    </div>
  );
};

/* === Spinner — replaces button label when an auth action is in flight === */
export const AuthSpinner = ({ label = 'Working…' }: { label?: string }) => (
  <span className="inline-flex items-center justify-center gap-2">
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      style={{ width: 16, height: 16, display: 'block', animation: 'lg-prep-spin 800ms linear infinite' }}
      aria-hidden="true"
    >
      <circle cx={8} cy={8} r={6} stroke="currentColor" strokeOpacity={0.25} strokeWidth={2} />
      <path d="M8 2 a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
    <span>{label}</span>
  </span>
);

/* === Success card — for sent-confirmation states (forgot/signup-verify) === */
export const AuthSuccessCard = ({
  title,
  body,
  cta,
  onCta,
}: {
  title: string;
  body: string;
  cta?: string;
  onCta?: () => void;
}) => (
  <div
    className="anim-fade px-6 pt-6 pb-8"
    role="status"
  >
    <div
      className="squircle-md p-5"
      style={{
        background: 'var(--glass-card-bg)',
        backdropFilter: 'blur(36px) saturate(180%)',
        WebkitBackdropFilter: 'blur(36px) saturate(180%)',
        border: '1px solid var(--brand-cyan-border)',
        boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), 0 12px 32px -10px rgba(0,214,254,0.30)',
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
        style={{ background: 'var(--brand-cyan-soft)', border: '1px solid var(--brand-cyan-border)' }}
      >
        <svg
          width={22}
          height={22}
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--brand-cyan-text)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 22, height: 22, display: 'block' }}
        >
          <path d="M5 13 L10 18 L19 7" />
        </svg>
      </div>
      <div className="sf-display text-[18px] font-bold text-white leading-tight tracking-[-0.01em] mb-2">
        {title}
      </div>
      <p className="sf text-[12.5px] text-white/65 leading-relaxed mb-4">{body}</p>
      {cta && (
        <button
          onClick={onCta}
          className="lg-btn-primary lg-shine lg-aura squircle-md py-3 w-full sf text-[13.5px] font-semibold"
        >
          {cta}
        </button>
      )}
    </div>
  </div>
);
