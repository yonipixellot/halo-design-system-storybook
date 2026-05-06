import { useTranslation } from 'react-i18next';
import { cls } from '@/lib/cls';
import type { Persona } from './_data';

/* PersonaCard — single row in the onboarding persona picker.
   Lifted out of PersonaStep (May 2026) so the design language can be
   audited and reused. The picker composes a stack of these.

   Variants:
     - kind          — 'player' | 'parent' | 'fan' | (coach is data-only,
                       hidden from picker per May 2026 product call but
                       kept in the type/data so the rest of the system
                       still works)
     - featured      — adds the cyan radial halo + cyan border + cyan
                       icon tint. Used as the "recommended" emphasis on
                       the player row. Only one row at a time should be
                       featured.
     - selected      — currently-chosen state (cyan ring, slightly
                       stronger glow). Distinct from featured: featured
                       is editorial, selected is interactive.
     - disabled      — non-interactive, dim. Used for personas that
                       aren't available yet (coach, in this build).

   The card is full-width and `lg-aura lg-shine` on hover. */

export type PersonaCardKind = Exclude<Persona, never>;

export interface PersonaCardProps {
  kind: PersonaCardKind;
  /** Override the default title (falls back to the i18n key). */
  title?: string;
  /** Override the default subtitle. */
  sub?: string;
  /** Adds the cyan halo + ring (editorial emphasis). */
  featured?: boolean;
  /** Marks this card as the user's current choice (interactive selection). */
  selected?: boolean;
  /** Non-interactive + dimmed. */
  disabled?: boolean;
  onClick?: () => void;
}

const ICON_PATHS: Record<PersonaCardKind, string> = {
  player: 'M10 9 a3 3 0 1 0 0 -6 a3 3 0 1 0 0 6 Z M3 17 c0 -3.5 3 -6 7 -6 s7 2.5 7 6',
  parent:
    'M5 8 a3 3 0 1 0 0 -6 a3 3 0 1 0 0 6 Z M15 8 a3 3 0 1 0 0 -6 a3 3 0 1 0 0 6 Z M2 17 c0 -3 2 -5 5 -5 M13 12 c3 0 5 2 5 5 M10 17 c-1.5 0 -2.5 -1 -2.5 -2.5 s1 -2.5 2.5 -2.5 s2.5 1 2.5 2.5 S 11.5 17 10 17 Z',
  fan: 'M10 2 L12.6 7.4 L18.5 8.3 L14.2 12.4 L15.3 18.3 L10 15.5 L4.7 18.3 L5.8 12.4 L1.5 8.3 L7.4 7.4 Z',
  coach: 'M2 4 h16 v9 h-7 l-2 3 -2 -3 H2 Z M5 7.5 h10 M5 10.5 h6',
};

const I18N_KEYS: Record<PersonaCardKind, { title: string; sub: string }> = {
  player: { title: 'onboarding.player', sub: 'persona.playerSub' },
  parent: { title: 'onboarding.parent', sub: 'persona.parentSub' },
  fan: { title: 'onboarding.fan', sub: 'persona.fanSub' },
  coach: { title: 'onboarding.coach', sub: 'persona.coachSub' },
};

export const PersonaCard = ({
  kind,
  title,
  sub,
  featured,
  selected,
  disabled,
  onClick,
}: PersonaCardProps) => {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t(I18N_KEYS[kind].title);
  const resolvedSub = sub ?? t(I18N_KEYS[kind].sub);

  /* Style resolution by precedence: disabled > selected > featured > default. */
  const tone: 'disabled' | 'selected' | 'featured' | 'default' = disabled
    ? 'disabled'
    : selected
    ? 'selected'
    : featured
    ? 'featured'
    : 'default';

  const cardStyle: React.CSSProperties =
    tone === 'featured'
      ? {
          background:
            'radial-gradient(ellipse 65% 60% at 25% 30%, rgba(0,214,254,0.22) 0%, transparent 60%),' +
            'radial-gradient(ellipse 70% 60% at 80% 70%, rgba(132,88,255,0.16) 0%, transparent 60%),' +
            'var(--glass-card-bg)',
          backdropFilter: 'blur(36px) saturate(180%)',
          WebkitBackdropFilter: 'blur(36px) saturate(180%)',
          border: '1px solid rgba(0,214,254,0.35)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.14), 0 12px 40px -12px rgba(0,214,254,0.30)',
        }
      : tone === 'selected'
      ? {
          background:
            'radial-gradient(ellipse 60% 60% at 30% 35%, rgba(0,214,254,0.16) 0%, transparent 65%),' +
            'var(--glass-card-bg)',
          backdropFilter: 'blur(36px) saturate(180%)',
          WebkitBackdropFilter: 'blur(36px) saturate(180%)',
          border: '1.5px solid var(--brand-cyan)',
          boxShadow:
            'inset 0 1px 0 var(--glass-card-inset-top), 0 0 0 4px rgba(0,214,254,0.12), 0 8px 24px -10px rgba(0,214,254,0.40)',
        }
      : tone === 'disabled'
      ? {
          background: 'var(--glass-card-bg)',
          backdropFilter: 'blur(36px) saturate(180%)',
          WebkitBackdropFilter: 'blur(36px) saturate(180%)',
          border: '1px solid var(--glass-card-border)',
          boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top)',
          opacity: 0.45,
        }
      : {
          background: 'var(--glass-card-bg)',
          backdropFilter: 'blur(36px) saturate(180%)',
          WebkitBackdropFilter: 'blur(36px) saturate(180%)',
          border: '1px solid var(--glass-card-border)',
          boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), var(--glass-card-shadow)',
        };

  const iconWellStyle: React.CSSProperties =
    tone === 'featured' || tone === 'selected'
      ? {
          width: 48,
          height: 48,
          background: 'rgba(0,214,254,0.15)',
          border: '1px solid rgba(0,214,254,0.45)',
          color: 'var(--brand-cyan-text)',
        }
      : {
          width: 48,
          height: 48,
          background: 'var(--hatch-grain)',
          border: '1px solid var(--glass-card-border)',
          color: 'var(--text-secondary)',
        };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={resolvedTitle}
      className={cls(
        'w-full text-start squircle-md p-4 flex items-center gap-3.5 relative overflow-hidden',
        !disabled && 'lg-aura lg-shine',
      )}
      style={cardStyle}
    >
      <div className="squircle-sm flex items-center justify-center shrink-0" style={iconWellStyle}>
        <svg
          width={22}
          height={22}
          style={{ width: 22, height: 22, display: 'block' }}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={tone === 'featured' || tone === 'selected' ? 2 : 1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={ICON_PATHS[kind]} />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="sf-display text-[16px] font-bold text-white leading-tight tracking-[-0.01em]">
          {resolvedTitle}
        </div>
        <div className="sf text-[12px] text-white/60 mt-0.5">{resolvedSub}</div>
      </div>
      {/* Trailing affordance — chevron for default/featured, checkmark for
          selected, nothing for disabled. */}
      {!disabled && !selected && (
        <svg
          width={16}
          height={16}
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cls(
            'icon-flip-rtl',
            tone === 'featured' ? 'text-halo-cyan' : 'text-white/40',
          )}
          style={{ width: 16, height: 16, display: 'block' }}
        >
          <path d="M5.5 2.5 L10 7 L5.5 11.5" />
        </svg>
      )}
      {selected && (
        <svg
          width={18}
          height={18}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: 18,
            height: 18,
            display: 'block',
            color: 'var(--brand-cyan-text)',
          }}
        >
          <path d="M3 8.5 L6.5 12 L13 4.5" />
        </svg>
      )}
    </button>
  );
};
