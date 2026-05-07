import type { ReactNode } from 'react';
import { CLIENT, ClientLogoMark } from '@/screens/auth/_shared';

/* AuthCanvas — desktop layout for SignIn / SignUp / Forgot / Reset.

   Phone (<lg): full-canvas atmosphere + form content stacked. The
   ClientLogoHero (navy block + cyan HALO mark) renders above the form
   on phone — that's the existing phone treatment, unchanged.

   Desktop (lg+): split-screen.
   - Brand panel (inline-start, ~55%): solid navy (CLIENT.accent) with
     the cyan HALO mark centered. This is the same visual language as
     ClientLogoHero but full-height. Form children's ClientLogoHero is
     hidden at lg+ via `lg:hidden` on the component itself, so the form
     panel only shows the form.
   - Form panel (inline-end, ~45%): canvas-bg, form content centered
     in a max-w-[440px] column. Just the auth form — no logo block
     competing for attention.

   Children render exactly once (in the form panel) so form state
   doesn't get duplicated across phone/desktop renders. */

export interface AuthCanvasProps {
  children: ReactNode;
  /** Reserved for future use; the split-screen layout supersedes the
      single content cap. Kept on the prop list for API compatibility. */
  contentMaxWidth?: number | 'full';
}

const BrandPanel = () => (
  <aside
    data-theme="dark"
    className="hidden lg:flex lg:flex-[11] lg-keep-dark relative overflow-hidden flex-col justify-center items-center"
    aria-hidden="true"
    style={{
      background:
        'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,214,254,0.10) 0%, transparent 65%),' +
        'linear-gradient(180deg, transparent 0%, transparent 50%, rgba(0,0,0,0.20) 100%),' +
        CLIENT.accent,
      boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.06)',
      color: '#fff',
    }}
  >
    {/* Cyan HALO mark — native ClientLogoMark size, slight glow only.
        Scaled treatment was overpowering at 1.6×; native sits with
        comfortable breathing room. */}
    <div style={{ filter: 'drop-shadow(0 0 40px rgba(0,214,254,0.35))' }}>
      <ClientLogoMark />
    </div>
  </aside>
);

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
        atmosphere shows through. Desktop: clean canvas-bg of .glass-app.
        Internal scroll at lg+ so long forms (e.g. SignUp's multi-step)
        scroll inside the form column instead of letting the page push
        the brand panel taller than the viewport.

        Note: NO `justify-center` here — when a form is taller than the
        viewport, justify-center pushes the top of the form (Sign In /
        Sign Up tabs) above the scroll area's top, making it
        unreachable. Anchor to top + `py-16` for breathing room and
        let `overflow-y-auto` handle long forms. */}
    <main className="relative z-10 lg:flex-[9] lg:flex lg:flex-col lg:px-10 xl:px-16 lg:py-16 lg:max-h-screen lg:overflow-y-auto">
      <div className="w-full lg:max-w-[440px] lg:mx-auto">{children}</div>
    </main>
  </div>
);
