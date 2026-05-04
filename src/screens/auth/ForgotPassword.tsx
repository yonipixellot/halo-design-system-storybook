import { useState } from 'react';
import {
  AuthAtmosphere,
  GlassField,
  AuthErrorBanner,
  AuthSpinner,
  type AuthDispatch,
} from './_shared';

/* Verbatim port: halo-v3.2-glass.html lines 5450-5510, plus error/loading
   props so the FE team can drive UI from their reducer / API response. */

export interface ForgotPasswordScreenProps {
  dispatch: AuthDispatch;
  /** Top-of-form banner — for non-field errors (network, etc). */
  error?: string | null;
  /** Per-field error highlighting. */
  fieldError?: string;
  /** Disables the CTA and shows a spinner. */
  loading?: boolean;
  /** Pre-filled email — keeps field-error highlight visible in stories. */
  initialEmail?: string;
}

export const ForgotPasswordScreen = ({
  dispatch,
  error,
  fieldError,
  loading,
  initialEmail = '',
}: ForgotPasswordScreenProps) => {
  const [email, setEmail] = useState(initialEmail);
  const valid = email.includes('@');
  const send = () => dispatch({ type: 'SET_AUTH_STEP', step: 'forgot-sent' });
  const back = () => dispatch({ type: 'SET_AUTH_STEP', step: 'signin' });

  return (
    <AuthAtmosphere>
      <div className="pt-12 px-5">
        <button
          onClick={back}
          disabled={loading}
          className="w-9 h-9 lg-glass squircle-sm flex items-center justify-center text-white/85"
        >
          <svg
            width={14}
            height={14}
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: 14, height: 14, display: 'block' }}
          >
            <path d="M8.5 2.5 L4 7 L8.5 11.5" />
          </svg>
        </button>
      </div>
      <div className="px-6 pt-8 anim-fade">
        <h1 className="sf-display text-[28px] font-bold text-white leading-tight tracking-[-0.025em] mb-1.5">
          Reset password
        </h1>
        <p className="sf text-[13px] text-white/60 mb-7 leading-relaxed">
          Type the email on your account. We'll send a one-tap reset link.
        </p>
        <AuthErrorBanner message={error} />
        <GlassField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@school.com"
          autoFocus
          error={fieldError}
        />
        <button
          onClick={send}
          disabled={!valid || loading}
          className="mt-5 lg-btn-primary lg-shine lg-aura squircle-md py-3.5 w-full sf text-[14.5px] font-semibold"
        >
          {loading ? <AuthSpinner label="Sending…" /> : 'Send reset link'}
        </button>
      </div>
    </AuthAtmosphere>
  );
};

export const ForgotSentScreen = ({ dispatch }: { dispatch: AuthDispatch }) => {
  const back = () => dispatch({ type: 'SET_AUTH_STEP', step: 'signin' });

  return (
    <AuthAtmosphere>
      <div className="pt-24 px-6 text-center anim-fade">
        <div
          className="w-16 h-16 rounded-full lg-glass-strong mx-auto mb-5 flex items-center justify-center"
          style={{ boxShadow: '0 0 32px rgba(0,214,254,0.45)' }}
        >
          <svg
            width={28}
            height={28}
            viewBox="0 0 28 28"
            fill="none"
            stroke="#00D6FE"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 7l11 7L25 7" />
            <rect x={3} y={6} width={22} height={16} rx={2} />
          </svg>
        </div>
        <h1 className="sf-display text-[24px] font-bold text-white leading-tight tracking-[-0.022em] mb-2">
          Check your inbox
        </h1>
        <p className="sf text-[13px] text-white/65 leading-relaxed max-w-[260px] mx-auto mb-8">
          We sent a reset link. If it doesn't show in a minute, peek in spam.
        </p>
        <button
          onClick={back}
          className="lg-glass squircle-md py-3 px-6 sf text-[13px] font-semibold text-white"
        >
          Back to sign in
        </button>
      </div>
    </AuthAtmosphere>
  );
};
