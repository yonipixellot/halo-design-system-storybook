import { useState } from 'react';
import {
  HaloWordmark,
  GlassField,
  AuthErrorBanner,
  AuthSpinner,
  type AuthDispatch,
} from './_shared';
import { AuthCanvas } from '@/layouts/AuthCanvas';

/* Verbatim port: halo-v3.2-glass.html lines 5512-5565, plus error/loading
   props + an "expired link" full-screen state for invalid tokens. */

export interface ResetPasswordScreenProps {
  dispatch: AuthDispatch;
  /** Top-of-form banner — for non-field errors (network, server). */
  error?: string | null;
  /** Per-field highlights. `confirm` is used for the password-mismatch case. */
  fieldErrors?: { password?: string; confirm?: string };
  /** Disables the CTA and shows a spinner. */
  loading?: boolean;
  /** Full-screen "expired link" state — replaces the form entirely. */
  invalidToken?: boolean;
  /** Pre-filled values — keeps field-error highlight visible in stories. */
  initialPassword?: string;
  initialConfirm?: string;
}

export const ResetPasswordScreen = ({
  dispatch,
  error,
  fieldErrors,
  loading,
  invalidToken,
  initialPassword = '',
  initialConfirm = '',
}: ResetPasswordScreenProps) => {
  const [password, setPassword] = useState(initialPassword);
  const [confirm, setConfirm] = useState(initialConfirm);
  const valid = password.length >= 6 && password === confirm;
  const submit = () => dispatch({ type: 'SET_AUTH_STEP', step: 'reset-done' });

  if (invalidToken) {
    return (
      <AuthCanvas>
        <div className="pt-24 px-6 lg:pt-6 lg:px-0 text-center anim-fade">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{
              background: 'rgba(220,38,38,0.12)',
              border: '1px solid rgba(220,38,38,0.45)',
              boxShadow: '0 0 32px rgba(220,38,38,0.30)',
            }}
          >
            <svg
              width={28}
              height={28}
              viewBox="0 0 28 28"
              fill="none"
              stroke="rgba(252,165,165,0.95)"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: 28, height: 28, display: 'block' }}
            >
              <circle cx={14} cy={14} r={11} />
              <path d="M14 8 V15" />
              <path d="M14 19 L14 19.5" />
            </svg>
          </div>
          <h1 className="sf-display text-[24px] font-bold text-white leading-tight tracking-[-0.022em] mb-2">
            This link expired
          </h1>
          <p className="sf text-[13px] text-white/65 leading-relaxed max-w-[260px] mx-auto mb-8">
            For your security, reset links work once and only for an hour. Request a fresh one.
          </p>
          <button
            onClick={() => dispatch({ type: 'SET_AUTH_STEP', step: 'forgot' })}
            className="lg-btn-primary lg-shine squircle-md py-3 px-6 sf text-[13px] font-semibold"
          >
            Send a new link
          </button>
        </div>
      </AuthCanvas>
    );
  }

  return (
    <AuthCanvas>
      <HaloWordmark />
      <div className="px-6 lg:px-0 anim-fade">
        <h1 className="sf-display text-[26px] font-bold text-white leading-tight tracking-[-0.025em] text-center mb-1.5">
          Set a new password
        </h1>
        <p className="sf text-[13px] text-white/60 text-center mb-7">
          6+ characters. Use something memorable.
        </p>
        <AuthErrorBanner message={error} />
        <div className="space-y-3">
          <GlassField
            label="New password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="6+ characters"
            autoFocus
            error={fieldErrors?.password}
          />
          <GlassField
            label="Confirm"
            type="password"
            value={confirm}
            onChange={setConfirm}
            placeholder="Type it again"
            error={fieldErrors?.confirm}
          />
        </div>
        <button
          onClick={submit}
          disabled={!valid || loading}
          className="mt-5 lg-btn-primary lg-shine lg-aura squircle-md py-3.5 w-full lg:max-w-[400px] lg:mx-auto lg:block sf text-[14.5px] font-semibold"
        >
          {loading ? <AuthSpinner label="Saving…" /> : 'Save password'}
        </button>
      </div>
    </AuthCanvas>
  );
};

export const ResetDoneScreen = ({ dispatch }: { dispatch: AuthDispatch }) => (
  <AuthCanvas>
    <div className="pt-24 px-6 lg:pt-6 lg:px-0 text-center anim-fade">
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
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 14 L11 20 L23 8" />
        </svg>
      </div>
      <h1 className="sf-display text-[24px] font-bold text-white leading-tight tracking-[-0.022em] mb-2">
        Password updated
      </h1>
      <p className="sf text-[13px] text-white/65 leading-relaxed max-w-[260px] mx-auto mb-8">
        All set. Sign in with your new password.
      </p>
      <button
        onClick={() => dispatch({ type: 'SET_AUTH_STEP', step: 'signin' })}
        className="lg-btn-primary lg-shine squircle-md py-3 px-6 sf text-[13px] font-semibold"
      >
        Back to sign in
      </button>
    </div>
  </AuthCanvas>
);
