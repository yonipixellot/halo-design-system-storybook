import { useState } from 'react';
import {
  ClientLogoHero,
  AuthModeToggle,
  GlassField,
  AppleIcon,
  GoogleIcon,
  AuthErrorBanner,
  AuthSpinner,
  type AuthDispatch,
} from './_shared';
import { AuthCanvas } from '@/layouts/AuthCanvas';

/* Verbatim port: halo-v3.2-glass.html line 5133.
   Plus error / loading state props so the FE team can drive the UI from
   their reducer / API response. */

export interface SignInScreenProps {
  dispatch: AuthDispatch;
  /** Top-of-form banner — for non-field errors (network, locked account). */
  error?: string | null;
  /** Per-field error highlighting. */
  fieldErrors?: { email?: string; password?: string };
  /** Disables the CTAs and replaces the primary button label with a spinner. */
  loading?: boolean;
  /** Pre-filled values (used by stories to keep the field highlight visible). */
  initialEmail?: string;
  initialPassword?: string;
}

export const SignInScreen = ({
  dispatch,
  error,
  fieldErrors,
  loading,
  initialEmail = '',
  initialPassword = '',
}: SignInScreenProps) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [showPw, setShowPw] = useState(false);
  const valid = email.includes('@') && password.length >= 4;
  const signIn = () => dispatch({ type: 'SIGN_IN' });
  const goSignUp = () => dispatch({ type: 'SET_AUTH_STEP', step: 'signup' });
  const goForgot = () => dispatch({ type: 'SET_AUTH_STEP', step: 'forgot' });

  return (
    <AuthCanvas>
      <ClientLogoHero />
      <div className="px-6 pt-6 lg:px-0 lg:pt-4 anim-fade">
        <AuthModeToggle mode="signin" onChange={(m) => m === 'signup' && goSignUp()} />

        <AuthErrorBanner message={error} />

        {/* Email + password — primary path */}
        <div className="space-y-3">
          <GlassField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@school.com"
            autoFocus
            error={fieldErrors?.email}
          />
          <GlassField
            label="Password"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            error={fieldErrors?.password}
            rightSlot={
              <button
                onClick={() => setShowPw((v) => !v)}
                className="sf text-[10.5px] tracking-tight font-semibold text-halo-cyan px-1.5"
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            }
          />
        </div>

        {/* Primary CTA — capped at 400px on desktop so it doesn't span
            the entire form column. Phone keeps full-width. */}
        <button
          onClick={signIn}
          disabled={!valid || loading}
          className="mt-5 lg-btn-primary lg-shine lg-aura squircle-md py-3.5 w-full lg:max-w-[400px] lg:mx-auto lg:block sf text-[14.5px] font-semibold"
        >
          {loading ? <AuthSpinner label="Signing in…" /> : 'Sign in'}
        </button>

        {/* Forgot password */}
        <div className="mt-3 text-center">
          <button
            onClick={goForgot}
            disabled={loading}
            className="sf text-[12px] text-white/55 font-medium hover:text-halo-cyan transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: 'var(--hairline-strong)' }} />
          <span className="sf text-[10px] tracking-[0.18em] uppercase text-white/45 font-semibold">or</span>
          <div className="flex-1 h-px" style={{ background: 'var(--hairline-strong)' }} />
        </div>

        {/* Social CTAs */}
        <div className="space-y-2.5">
          <button
            onClick={signIn}
            disabled={loading}
            className="lg-glass squircle-md py-3 w-full flex items-center justify-center gap-2.5 sf text-[13.5px] font-semibold text-white"
          >
            <AppleIcon />
            Continue with Apple
          </button>
          <button
            onClick={signIn}
            disabled={loading}
            className="lg-glass squircle-md py-3 w-full flex items-center justify-center gap-2.5 sf text-[13.5px] font-semibold text-white"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>

        <p className="mt-7 px-2 sf text-[10.5px] leading-relaxed text-white/35 text-center">
          By continuing you agree to our{' '}
          <span className="underline text-white/55">Terms</span> and{' '}
          <span className="underline text-white/55">Privacy Policy</span>.
        </p>
      </div>
    </AuthCanvas>
  );
};
