import { OnboardStepper } from './_chrome';
import type { Persona } from './_data';

/* Verbatim port: halo-v3.2-glass.html line 6584 */

export const PersonaStep = ({ onPick }: { onPick: (p: Persona) => void }) => {
  const personas = [
    {
      key: 'player' as const,
      title: 'Player',
      sub: 'Your game, your highlights',
      icon: 'M10 9 a3 3 0 1 0 0 -6 a3 3 0 1 0 0 6 Z M3 17 c0 -3.5 3 -6 7 -6 s7 2.5 7 6',
      featured: true,
    },
    {
      key: 'parent' as const,
      title: 'Parent',
      sub: "Follow your kid's team",
      icon: 'M5 8 a3 3 0 1 0 0 -6 a3 3 0 1 0 0 6 Z M15 8 a3 3 0 1 0 0 -6 a3 3 0 1 0 0 6 Z M2 17 c0 -3 2 -5 5 -5 M13 12 c3 0 5 2 5 5 M10 17 c-1.5 0 -2.5 -1 -2.5 -2.5 s1 -2.5 2.5 -2.5 s2.5 1 2.5 2.5 S 11.5 17 10 17 Z',
    },
    {
      key: 'fan' as const,
      title: 'Fan',
      sub: 'Follow teams & players',
      icon: 'M10 2 L12.6 7.4 L18.5 8.3 L14.2 12.4 L15.3 18.3 L10 15.5 L4.7 18.3 L5.8 12.4 L1.5 8.3 L7.4 7.4 Z',
    },
    {
      key: 'coach' as const,
      title: 'Coach',
      sub: 'Manage your team',
      icon: 'M2 4 h16 v9 h-7 l-2 3 -2 -3 H2 Z M5 7.5 h10 M5 10.5 h6',
    },
  ];

  return (
    <>
      <OnboardStepper step={1} total={3} />
      <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-4 pb-[120px] anim-fade">
        <h1 className="sf-display text-[26px] font-bold text-white leading-[1.05] tracking-[-0.025em] mb-2">
          Welcome to Halo
        </h1>
        <p className="sf text-[13px] text-white/65 leading-relaxed mb-6">
          Tell us who you are — we'll tune everything to your role.
        </p>
        <div className="space-y-2.5">
          {personas.map((p) => (
            <button
              key={p.key}
              onClick={() => onPick(p.key)}
              className="w-full text-start squircle-md p-4 flex items-center gap-3.5 lg-aura lg-shine relative overflow-hidden"
              style={
                p.featured
                  ? {
                      background:
                        'radial-gradient(ellipse 65% 60% at 25% 30%, rgba(0,214,254,0.22) 0%, transparent 60%),' +
                        'radial-gradient(ellipse 70% 60% at 80% 70%, rgba(132,88,255,0.16) 0%, transparent 60%),' +
                        'var(--glass-card-bg)',
                      backdropFilter: 'blur(36px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(36px) saturate(180%)',
                      border: '1px solid rgba(0,214,254,0.35)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 12px 40px -12px rgba(0,214,254,0.30)',
                    }
                  : {
                      background: 'var(--glass-card-bg)',
                      backdropFilter: 'blur(36px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(36px) saturate(180%)',
                      border: '1px solid var(--glass-card-border)',
                      boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), var(--glass-card-shadow)',
                    }
              }
            >
              <div
                className="squircle-sm flex items-center justify-center shrink-0"
                style={
                  p.featured
                    ? {
                        width: 48,
                        height: 48,
                        background: 'rgba(0,214,254,0.15)',
                        border: '1px solid rgba(0,214,254,0.45)',
                        color: '#00D6FE',
                      }
                    : {
                        width: 48,
                        height: 48,
                        background: 'var(--hatch-grain)',
                        border: '1px solid var(--glass-card-border)',
                        color: 'var(--text-secondary)',
                      }
                }
              >
                <svg
                  width={22}
                  height={22}
                  style={{ width: 22, height: 22, display: 'block' }}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={p.featured ? 2 : 1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={p.icon} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="sf-display text-[16px] font-bold text-white leading-tight tracking-[-0.01em]">
                  {p.title}
                </div>
                <div className="sf text-[12px] text-white/60 mt-0.5">{p.sub}</div>
              </div>
              <svg
                width={16}
                height={16}
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={p.featured ? 'text-halo-cyan' : 'text-white/40'}
              >
                <path d="M5.5 2.5 L10 7 L5.5 11.5" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
