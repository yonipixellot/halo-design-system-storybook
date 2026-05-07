import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

/* AuthCanvas — desktop layout for SignIn / SignUp / Forgot / Reset.

   Phone (<lg): full-canvas atmosphere + form content stacked. Same
   experience as before — children render with their own padding and
   the atmosphere layer sits behind via absolute fill.

   Desktop (lg+): split-screen.
   - Brand panel (inline-start, ~55%): atmosphere fills, big HALO
     wordmark, hero tagline + body. This is the "marketing" side that
     gives the page its desktop weight.
   - Form panel (inline-end, ~45%): clean canvas-bg, form content
     centered in a max-w-[440px] column. The form lives here and
     reads as the action target.

   Children render exactly once (in the form panel) so form state
   doesn't get duplicated across phone/desktop renders. */

export interface AuthCanvasProps {
  children: ReactNode;
  /** Reserved for future use; the split-screen layout supersedes the
      single content cap. Kept on the prop list for API compatibility. */
  contentMaxWidth?: number | 'full';
}

const BrandPanel = () => {
  const { t } = useTranslation();
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

      {/* Brand content — wordmark + tagline + body */}
      <div className="relative z-10 flex flex-col justify-center w-full px-12 xl:px-20 py-20">
        <div
          className="sf-display font-extrabold text-white leading-[0.88] tracking-[-0.04em] mb-7"
          style={{ fontSize: 'clamp(56px, 5.5vw, 88px)' }}
        >
          HALO
        </div>
        <h1 className="sf-display text-[28px] xl:text-[36px] font-bold text-white leading-[1.1] tracking-[-0.02em] max-w-[460px] mb-4">
          {t('auth.heroTagline')}
        </h1>
        <p className="sf text-[15px] xl:text-[16px] text-white/65 leading-relaxed max-w-[420px]">
          {t('auth.heroBody')}
        </p>
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
