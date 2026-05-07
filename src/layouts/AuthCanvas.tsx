import type { ReactNode } from 'react';
import { CLIENT } from '@/screens/auth/_shared';
import { TEAM_LOGOS } from '@/screens/home/_avatars';

/* AuthCanvas — desktop layout for SignIn / SignUp / Forgot / Reset.

   Phone (<lg): full-canvas atmosphere + form content stacked. Same
   experience as before — children render with their own padding and
   the atmosphere layer sits behind via absolute fill.

   Desktop (lg+): split-screen.
   - Brand panel (inline-start, ~55%): atmosphere fills, school/team
     identity is the hero — emblem + "WELCOME TO" + school name +
     tagline + hashtag. Multi-tenant: production resolves the school
     from the auth host/subdomain; the demo uses CLIENT (Eastside Prep).
   - Form panel (inline-end, ~45%): clean canvas-bg, form content
     centered in a max-w-[440px] column. The form lives here and
     reads as the action target.

   A small HALO wordmark sits in the brand panel's top corner so the
   user knows what platform they're on while the school identity gets
   the full visual weight.

   Children render exactly once (in the form panel) so form state
   doesn't get duplicated across phone/desktop renders. */

export interface AuthCanvasProps {
  children: ReactNode;
  /** Reserved for future use; the split-screen layout supersedes the
      single content cap. Kept on the prop list for API compatibility. */
  contentMaxWidth?: number | 'full';
}

const BrandPanel = () => {
  const logoUrl = (TEAM_LOGOS as Record<string, string>)[CLIENT.initial];

  return (
    <aside
      className="hidden lg:flex lg:flex-[11] relative overflow-hidden"
      aria-hidden="true"
    >
      {/* Atmosphere layer — only inside the brand panel at desktop */}
      <div className="absolute inset-0 z-0">
        <div className="lg-atmosphere" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, var(--vignette-corner) 0%, transparent 30%, transparent 70%, var(--vignette-corner-soft) 100%)',
          }}
        />
      </div>

      {/* Small HALO mark — top-start corner. Lets the user place the
          platform without competing with the school hero. */}
      <div
        className="absolute z-20 sf-display font-bold text-white/65 tracking-[0.18em]"
        style={{ top: 32, insetInlineStart: 40, fontSize: 14 }}
      >
        HALO
      </div>

      {/* Brand content — centered emblem + school identity stack */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center w-full px-12 xl:px-20 py-20">
        {logoUrl && (
          <img
            src={logoUrl}
            alt=""
            className="rounded-full mb-10 shrink-0"
            style={{
              width: 'clamp(150px, 14vw, 220px)',
              height: 'clamp(150px, 14vw, 220px)',
              objectFit: 'cover',
              boxShadow: '0 0 60px -8px rgba(0,214,254,0.35)',
            }}
          />
        )}

        <div
          className="sf text-[11.5px] xl:text-[12.5px] tracking-[0.24em] uppercase font-semibold text-white/55 mb-3"
        >
          Welcome to
        </div>

        <h1
          className="sf-display font-extrabold text-white leading-[0.92] tracking-[-0.025em] mb-3"
          style={{ fontSize: 'clamp(40px, 4.4vw, 64px)' }}
        >
          {CLIENT.name}
        </h1>

        <p
          className="sf-display font-bold leading-tight tracking-[-0.01em] mb-6"
          style={{
            color: 'var(--brand-cyan-text)',
            fontSize: 'clamp(16px, 1.6vw, 22px)',
          }}
        >
          {CLIENT.tagline}
        </p>

        <div
          className="sf font-semibold tracking-[0.06em] italic text-white/45"
          style={{ fontSize: 'clamp(11px, 1vw, 13px)' }}
        >
          #{CLIENT.initial}_FAMILY
        </div>
      </div>
    </aside>
  );
};

export const AuthCanvas = ({ children }: AuthCanvasProps) => (
  <div className="anim-fade text-white sf relative w-full lg:flex lg:min-h-screen">
    {/* Phone-only: full-canvas atmosphere behind the form */}
    <div
      className="lg:hidden absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <div className="lg-atmosphere" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, var(--vignette-corner) 0%, transparent 30%, transparent 70%, var(--vignette-corner-soft) 100%)',
        }}
      />
    </div>

    {/* Desktop-only brand panel (~55%) */}
    <BrandPanel />

    {/* Form panel — single render of children. Phone: transparent so
        atmosphere shows through. Desktop: clean canvas-bg of .glass-app. */}
    <main className="relative z-10 lg:flex-[9] lg:flex lg:flex-col lg:justify-center lg:px-10 xl:px-16 lg:py-16">
      <div className="w-full lg:max-w-[440px] lg:mx-auto">{children}</div>
    </main>
  </div>
);
