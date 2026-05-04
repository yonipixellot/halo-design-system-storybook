import { useState } from 'react';
import {
  AuthAtmosphere,
  ClientLogoHero,
  AuthModeToggle,
  GlassField,
  GlassSelect,
  AppleIcon,
  GoogleIcon,
  AuthErrorBanner,
  AuthSpinner,
  AuthSuccessCard,
  type AuthDispatch,
} from './_shared';

/* Verbatim port: halo-v3.2-glass.html line 5213, plus error/loading/success
   props so the FE team can drive UI from their reducer / API response. */

export interface SignUpScreenProps {
  dispatch: AuthDispatch;
  /** Top-of-form banner — for non-field errors (network, server). */
  error?: string | null;
  /** Per-field highlights — `email` for email-already-taken, `password` for
      weak-password, etc. Field-level form validation (mismatch, format) still
      runs internally. */
  fieldErrors?: { name?: string; email?: string; password?: string; confirmPw?: string };
  /** Disables the CTA and shows a spinner. */
  loading?: boolean;
  /** Replaces the form with a "check your email" success card after signup. */
  emailSent?: boolean;
  /** Pre-filled values — keeps field-error highlight visible in stories. */
  initialName?: string;
  initialEmail?: string;
  initialPassword?: string;
  initialConfirmPw?: string;
}

export const SignUpScreen = ({
  dispatch,
  error,
  fieldErrors,
  loading,
  emailSent,
  initialName = '',
  initialEmail = '',
  initialPassword = '',
  initialConfirmPw = '',
}: SignUpScreenProps) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [confirmPw, setConfirmPw] = useState(initialConfirmPw);
  const [showPw, setShowPw] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');

  if (emailSent) {
    return (
      <AuthAtmosphere>
        <ClientLogoHero />
        <AuthSuccessCard
          title="Check your inbox"
          body={`We sent a verification link to ${email || 'your email'}. Tap it to finish creating your account.`}
          cta="Back to sign in"
          onCta={() => dispatch({ type: 'SET_AUTH_STEP', step: 'signin' })}
        />
      </AuthAtmosphere>
    );
  }

  const pwOk = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  const pwMatch = !confirmPw || password === confirmPw;
  const valid =
    name.length > 1 &&
    email.includes('@') &&
    pwOk &&
    pwMatch &&
    confirmPw.length > 0 &&
    birthDate.length > 0 &&
    gender.length > 0 &&
    country.length > 0;

  const signUp = () => dispatch({ type: 'SIGN_IN' });
  const goSignIn = () => dispatch({ type: 'SET_AUTH_STEP', step: 'signin' });

  const COUNTRIES = [
    { value: 'af', label: 'Afghanistan' }, { value: 'al', label: 'Albania' },
    { value: 'dz', label: 'Algeria' }, { value: 'ad', label: 'Andorra' },
    { value: 'ao', label: 'Angola' }, { value: 'ag', label: 'Antigua and Barbuda' },
    { value: 'ar', label: 'Argentina' }, { value: 'am', label: 'Armenia' },
    { value: 'au', label: 'Australia' }, { value: 'at', label: 'Austria' },
    { value: 'az', label: 'Azerbaijan' }, { value: 'bs', label: 'Bahamas' },
    { value: 'bh', label: 'Bahrain' }, { value: 'bd', label: 'Bangladesh' },
    { value: 'bb', label: 'Barbados' }, { value: 'by', label: 'Belarus' },
    { value: 'be', label: 'Belgium' }, { value: 'bz', label: 'Belize' },
    { value: 'bj', label: 'Benin' }, { value: 'bt', label: 'Bhutan' },
    { value: 'bo', label: 'Bolivia' }, { value: 'ba', label: 'Bosnia and Herzegovina' },
    { value: 'bw', label: 'Botswana' }, { value: 'br', label: 'Brazil' },
    { value: 'bn', label: 'Brunei' }, { value: 'bg', label: 'Bulgaria' },
    { value: 'bf', label: 'Burkina Faso' }, { value: 'bi', label: 'Burundi' },
    { value: 'cv', label: 'Cabo Verde' }, { value: 'kh', label: 'Cambodia' },
    { value: 'cm', label: 'Cameroon' }, { value: 'ca', label: 'Canada' },
    { value: 'cf', label: 'Central African Republic' }, { value: 'td', label: 'Chad' },
    { value: 'cl', label: 'Chile' }, { value: 'cn', label: 'China' },
    { value: 'co', label: 'Colombia' }, { value: 'km', label: 'Comoros' },
    { value: 'cg', label: 'Congo' }, { value: 'cd', label: 'Congo (DRC)' },
    { value: 'cr', label: 'Costa Rica' }, { value: 'ci', label: "Côte d'Ivoire" },
    { value: 'hr', label: 'Croatia' }, { value: 'cu', label: 'Cuba' },
    { value: 'cy', label: 'Cyprus' }, { value: 'cz', label: 'Czechia' },
    { value: 'dk', label: 'Denmark' }, { value: 'dj', label: 'Djibouti' },
    { value: 'dm', label: 'Dominica' }, { value: 'do', label: 'Dominican Republic' },
    { value: 'ec', label: 'Ecuador' }, { value: 'eg', label: 'Egypt' },
    { value: 'sv', label: 'El Salvador' }, { value: 'gq', label: 'Equatorial Guinea' },
    { value: 'er', label: 'Eritrea' }, { value: 'ee', label: 'Estonia' },
    { value: 'sz', label: 'Eswatini' }, { value: 'et', label: 'Ethiopia' },
    { value: 'fj', label: 'Fiji' }, { value: 'fi', label: 'Finland' },
    { value: 'fr', label: 'France' }, { value: 'ga', label: 'Gabon' },
    { value: 'gm', label: 'Gambia' }, { value: 'ge', label: 'Georgia' },
    { value: 'de', label: 'Germany' }, { value: 'gh', label: 'Ghana' },
    { value: 'gr', label: 'Greece' }, { value: 'gd', label: 'Grenada' },
    { value: 'gt', label: 'Guatemala' }, { value: 'gn', label: 'Guinea' },
    { value: 'gw', label: 'Guinea-Bissau' }, { value: 'gy', label: 'Guyana' },
    { value: 'ht', label: 'Haiti' }, { value: 'hn', label: 'Honduras' },
    { value: 'hk', label: 'Hong Kong' }, { value: 'hu', label: 'Hungary' },
    { value: 'is', label: 'Iceland' }, { value: 'in', label: 'India' },
    { value: 'id', label: 'Indonesia' }, { value: 'ir', label: 'Iran' },
    { value: 'iq', label: 'Iraq' }, { value: 'ie', label: 'Ireland' },
    { value: 'il', label: 'Israel' }, { value: 'it', label: 'Italy' },
    { value: 'jm', label: 'Jamaica' }, { value: 'jp', label: 'Japan' },
    { value: 'jo', label: 'Jordan' }, { value: 'kz', label: 'Kazakhstan' },
    { value: 'ke', label: 'Kenya' }, { value: 'ki', label: 'Kiribati' },
    { value: 'kw', label: 'Kuwait' }, { value: 'kg', label: 'Kyrgyzstan' },
    { value: 'la', label: 'Laos' }, { value: 'lv', label: 'Latvia' },
    { value: 'lb', label: 'Lebanon' }, { value: 'ls', label: 'Lesotho' },
    { value: 'lr', label: 'Liberia' }, { value: 'ly', label: 'Libya' },
    { value: 'li', label: 'Liechtenstein' }, { value: 'lt', label: 'Lithuania' },
    { value: 'lu', label: 'Luxembourg' }, { value: 'mo', label: 'Macao' },
    { value: 'mg', label: 'Madagascar' }, { value: 'mw', label: 'Malawi' },
    { value: 'my', label: 'Malaysia' }, { value: 'mv', label: 'Maldives' },
    { value: 'ml', label: 'Mali' }, { value: 'mt', label: 'Malta' },
    { value: 'mh', label: 'Marshall Islands' }, { value: 'mr', label: 'Mauritania' },
    { value: 'mu', label: 'Mauritius' }, { value: 'mx', label: 'Mexico' },
    { value: 'fm', label: 'Micronesia' }, { value: 'md', label: 'Moldova' },
    { value: 'mc', label: 'Monaco' }, { value: 'mn', label: 'Mongolia' },
    { value: 'me', label: 'Montenegro' }, { value: 'ma', label: 'Morocco' },
    { value: 'mz', label: 'Mozambique' }, { value: 'mm', label: 'Myanmar' },
    { value: 'na', label: 'Namibia' }, { value: 'nr', label: 'Nauru' },
    { value: 'np', label: 'Nepal' }, { value: 'nl', label: 'Netherlands' },
    { value: 'nz', label: 'New Zealand' }, { value: 'ni', label: 'Nicaragua' },
    { value: 'ne', label: 'Niger' }, { value: 'ng', label: 'Nigeria' },
    { value: 'kp', label: 'North Korea' }, { value: 'mk', label: 'North Macedonia' },
    { value: 'no', label: 'Norway' }, { value: 'om', label: 'Oman' },
    { value: 'pk', label: 'Pakistan' }, { value: 'pw', label: 'Palau' },
    { value: 'ps', label: 'Palestine' }, { value: 'pa', label: 'Panama' },
    { value: 'pg', label: 'Papua New Guinea' }, { value: 'py', label: 'Paraguay' },
    { value: 'pe', label: 'Peru' }, { value: 'ph', label: 'Philippines' },
    { value: 'pl', label: 'Poland' }, { value: 'pt', label: 'Portugal' },
    { value: 'pr', label: 'Puerto Rico' }, { value: 'qa', label: 'Qatar' },
    { value: 'ro', label: 'Romania' }, { value: 'ru', label: 'Russia' },
    { value: 'rw', label: 'Rwanda' }, { value: 'kn', label: 'Saint Kitts and Nevis' },
    { value: 'lc', label: 'Saint Lucia' }, { value: 'vc', label: 'Saint Vincent and the Grenadines' },
    { value: 'ws', label: 'Samoa' }, { value: 'sm', label: 'San Marino' },
    { value: 'st', label: 'São Tomé and Príncipe' }, { value: 'sa', label: 'Saudi Arabia' },
    { value: 'sn', label: 'Senegal' }, { value: 'rs', label: 'Serbia' },
    { value: 'sc', label: 'Seychelles' }, { value: 'sl', label: 'Sierra Leone' },
    { value: 'sg', label: 'Singapore' }, { value: 'sk', label: 'Slovakia' },
    { value: 'si', label: 'Slovenia' }, { value: 'sb', label: 'Solomon Islands' },
    { value: 'so', label: 'Somalia' }, { value: 'za', label: 'South Africa' },
    { value: 'kr', label: 'South Korea' }, { value: 'ss', label: 'South Sudan' },
    { value: 'es', label: 'Spain' }, { value: 'lk', label: 'Sri Lanka' },
    { value: 'sd', label: 'Sudan' }, { value: 'sr', label: 'Suriname' },
    { value: 'se', label: 'Sweden' }, { value: 'ch', label: 'Switzerland' },
    { value: 'sy', label: 'Syria' }, { value: 'tw', label: 'Taiwan' },
    { value: 'tj', label: 'Tajikistan' }, { value: 'tz', label: 'Tanzania' },
    { value: 'th', label: 'Thailand' }, { value: 'tl', label: 'Timor-Leste' },
    { value: 'tg', label: 'Togo' }, { value: 'to', label: 'Tonga' },
    { value: 'tt', label: 'Trinidad and Tobago' }, { value: 'tn', label: 'Tunisia' },
    { value: 'tr', label: 'Türkiye' }, { value: 'tm', label: 'Turkmenistan' },
    { value: 'tv', label: 'Tuvalu' }, { value: 'ug', label: 'Uganda' },
    { value: 'ua', label: 'Ukraine' }, { value: 'ae', label: 'United Arab Emirates' },
    { value: 'gb', label: 'United Kingdom' }, { value: 'us', label: 'United States' },
    { value: 'uy', label: 'Uruguay' }, { value: 'uz', label: 'Uzbekistan' },
    { value: 'vu', label: 'Vanuatu' }, { value: 'va', label: 'Vatican City' },
    { value: 've', label: 'Venezuela' }, { value: 'vn', label: 'Vietnam' },
    { value: 'ye', label: 'Yemen' }, { value: 'zm', label: 'Zambia' },
    { value: 'zw', label: 'Zimbabwe' },
  ];
  const GENDERS = [
    { value: 'm', label: 'Male' }, { value: 'f', label: 'Female' },
    { value: 'nb', label: 'Non-binary' }, { value: 'na', label: 'Prefer not to say' },
  ];

  return (
    <AuthAtmosphere>
      <ClientLogoHero />
      <div className="px-6 pt-6 pb-8 anim-fade">
        <AuthModeToggle mode="signup" onChange={(m) => m === 'signin' && goSignIn()} />

        {/* Step indicator */}
        <div className="mb-4">
          <div
            className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 squircle-sm"
            style={{
              background: 'var(--brand-cyan-soft)',
              border: '1px solid var(--brand-cyan-border)',
            }}
          >
            <span
              className="sf text-[9.5px] tracking-[0.18em] uppercase font-bold"
              style={{ color: 'var(--brand-cyan-text)' }}
            >
              Step 1 of 3
            </span>
            <span
              className="sf text-[9.5px] tracking-[0.16em] uppercase font-semibold"
              style={{ color: 'rgba(0,214,254,0.55)' }}
            >
              ·
            </span>
            <span
              className="sf text-[9.5px] tracking-[0.16em] uppercase font-semibold"
              style={{ color: 'var(--brand-cyan-text)' }}
            >
              Account details
            </span>
          </div>
          <p className="sf text-[12.5px] text-white/55 leading-relaxed">Personalisation comes next.</p>
        </div>

        <AuthErrorBanner message={error} />

        {/* Field stack */}
        <div className="space-y-3">
          <GlassField
            label="Display name"
            value={name}
            onChange={setName}
            placeholder="Tal Weiss"
            autoFocus
            error={fieldErrors?.name}
          />
          <GlassField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            error={fieldErrors?.email}
          />
          <GlassField
            label="Password"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={setPassword}
            placeholder="Strong password"
            hint="Min 8 characters, 1 uppercase, 1 number"
            error={
              fieldErrors?.password ??
              (password.length > 0 && !pwOk ? "Doesn't meet the password rules yet" : null)
            }
            rightSlot={
              <button
                onClick={() => setShowPw((v) => !v)}
                className="sf text-[10.5px] tracking-tight font-semibold text-halo-cyan px-1.5"
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            }
          />
          <GlassField
            label="Confirm password"
            type={showPw ? 'text' : 'password'}
            value={confirmPw}
            onChange={setConfirmPw}
            placeholder="Type it again"
            error={
              fieldErrors?.confirmPw ??
              (confirmPw.length > 0 && !pwMatch ? "Passwords don't match" : null)
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <GlassField
              label="Birth date"
              type="date"
              value={birthDate}
              onChange={setBirthDate}
              placeholder="dd/mm/yyyy"
            />
            <GlassSelect
              label="Gender"
              value={gender}
              onChange={setGender}
              options={GENDERS}
              placeholder="Select…"
            />
          </div>
          <GlassSelect
            label="Country"
            value={country}
            onChange={setCountry}
            options={COUNTRIES}
            placeholder="Select your country…"
          />
        </div>

        <button
          onClick={signUp}
          disabled={!valid || loading}
          className="mt-6 lg-btn-primary lg-shine lg-aura squircle-md py-3.5 w-full sf text-[14.5px] font-semibold"
        >
          {loading ? <AuthSpinner label="Creating account…" /> : 'Continue'}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: 'var(--hairline-strong)' }} />
          <span className="sf text-[10px] tracking-[0.18em] uppercase text-white/45 font-semibold">or</span>
          <div className="flex-1 h-px" style={{ background: 'var(--hairline-strong)' }} />
        </div>

        <div className="space-y-2.5">
          <button
            onClick={signUp}
            className="lg-glass squircle-md py-3 w-full flex items-center justify-center gap-2.5 sf text-[13.5px] font-semibold text-white"
          >
            <AppleIcon />
            Sign up with Apple
          </button>
          <button
            onClick={signUp}
            className="lg-glass squircle-md py-3 w-full flex items-center justify-center gap-2.5 sf text-[13.5px] font-semibold text-white"
          >
            <GoogleIcon />
            Sign up with Google
          </button>
        </div>

        <p className="mt-7 px-2 sf text-[10.5px] leading-relaxed text-white/35 text-center">
          By creating an account you agree to our{' '}
          <span className="underline text-white/55">Terms</span> and{' '}
          <span className="underline text-white/55">Privacy Policy</span>.
        </p>
      </div>
    </AuthAtmosphere>
  );
};
