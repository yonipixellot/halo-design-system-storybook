import type { ReactNode } from 'react';
import { AuthAtmosphere } from '@/screens/auth/_shared';

/* AuthCanvas — desktop layout for SignIn / SignUp / Forgot / Reset.

   Below lg: passthrough — AuthAtmosphere alone, full-bleed phone
   experience unchanged.

   At lg+: atmosphere fills the entire canvas (the .glass-app wrapper),
   AND the form content is wrapped in a glass card that's centered
   horizontally + vertically. The card has a max-width of 440 so the
   email/password fields don't stretch into 70-character bars, and a
   max-height with internal scroll so tall forms (SignUp) don't blow
   past the viewport.

   The inner content is whatever the page passes — typically a
   ClientLogoHero + AuthModeToggle + form. The card padding + max-width
   are applied by AuthCanvas, not by the page. */

export interface AuthCanvasProps {
  children: ReactNode;
}

export const AuthCanvas = ({ children }: AuthCanvasProps) => (
  <AuthAtmosphere>
    {/* Centered glass card at lg+. Phone keeps the existing full-bleed
        column treatment. */}
    <div className="lg:flex lg:items-center lg:justify-center lg:min-h-screen lg:px-6 lg:py-10">
      <div
        className={[
          /* Phone: passthrough — no card chrome */
          'w-full',
          /* Desktop: glass card */
          'lg:lg-glass-card',
          'lg:squircle-lg',
          'lg:max-w-[440px]',
          'lg:py-10',
          'lg:px-9',
          'lg:max-h-[calc(100vh-80px)]',
          'lg:overflow-y-auto',
          'lg:relative',
          'lg:z-10',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  </AuthAtmosphere>
);
