import { useTranslation } from 'react-i18next';
import { OnboardStepper } from './_chrome';
import { PersonaCard, type PersonaCardKind } from './PersonaCard';
import type { Persona } from './_data';

/* Verbatim port: halo-v3.2-glass.html line 6584.
   May 2026 refactor: extracted each row to <PersonaCard /> organism.
   May 2026 product call: 'coach' persona is hidden from the picker
   (shipped functionality not ready). The Persona type still includes
   'coach' so STORYTELLING_DROPS, audience routing, etc. keep working. */

const VISIBLE_PERSONAS: { kind: PersonaCardKind; featured?: boolean }[] = [
  { kind: 'player', featured: true },
  { kind: 'parent' },
  { kind: 'fan' },
  /* coach intentionally omitted — re-enable by adding `{ kind: 'coach' }` */
];

export const PersonaStep = ({ onPick }: { onPick: (p: Persona) => void }) => {
  const { t } = useTranslation();

  return (
    <>
      <OnboardStepper step={1} total={3} />
      <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-4 pb-[120px] anim-fade">
        <h1 className="sf-display text-[26px] font-bold text-white leading-[1.05] tracking-[-0.025em] mb-2">
          {t('onboarding.welcomeTitle')}
        </h1>
        <p className="sf text-[13px] text-white/65 leading-relaxed mb-6">
          {t('onboarding.welcomeSub')}
        </p>
        <div className="space-y-2.5">
          {VISIBLE_PERSONAS.map((p) => (
            <PersonaCard
              key={p.kind}
              kind={p.kind}
              featured={p.featured}
              onClick={() => onPick(p.kind)}
            />
          ))}
        </div>
      </div>
    </>
  );
};
