import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/lib/i18n';

/* LanguagePage — nested page inside SideMenu.
   Tapping a language calls i18n.changeLanguage(), which:
     - Persists the choice to localStorage (key: halo.lang)
     - Fires the 'languageChanged' event the preview decorator listens to
     - Triggers the .glass-app dir attribute flip globally
   The page stays open after selection so the user sees the immediate
   visual feedback (text + direction flip) and can dismiss the drawer
   when ready. */

const LANGUAGE_META: Record<SupportedLanguage, { native: string; flag: string; direction: 'ltr' | 'rtl' }> = {
  en: { native: 'English',  flag: '🇬🇧', direction: 'ltr' },
  he: { native: 'עברית',     flag: '🇮🇱', direction: 'rtl' },
};

export interface LanguagePageProps {
  onBack: () => void;
  onClose: () => void;
}

export const LanguagePage = ({ onBack, onClose: _onClose }: LanguagePageProps) => {
  const { t, i18n } = useTranslation();
  const current = i18n.language;

  return (
    <>
      {/* Header — back arrow + title */}
      <div
        className="px-5 pt-14 pb-4 flex items-center gap-3 shrink-0"
        style={{ borderBottom: '1px solid var(--glass-strong-border)' }}
      >
        <button
          onClick={onBack}
          aria-label={t('common.back')}
          className="w-9 h-9 lg-glass squircle-sm flex items-center justify-center text-white"
        >
          <svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon-flip-rtl"
            style={{ width: 12, height: 12, display: 'block' }}
          >
            <path d="M8 2 L3 6 L8 10" />
          </svg>
        </button>
        <span className="sf-display text-[20px] font-bold text-white tracking-[-0.015em]">
          {t('language.title')}
        </span>
      </div>

      {/* Subtitle */}
      <div className="px-5 pt-4 pb-2 shrink-0">
        <p className="sf text-[12.5px]" style={{ color: 'var(--text-tertiary)' }}>
          {t('language.subtitle')}
        </p>
      </div>

      {/* Language list */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const meta = LANGUAGE_META[lang];
          const active = current === lang;
          return (
            <button
              key={lang}
              onClick={() => i18n.changeLanguage(lang)}
              aria-pressed={active}
              className="w-full squircle-sm px-3 py-3.5 flex items-center gap-3 lg-aura"
              style={{
                marginBottom: 4,
                background: active ? 'var(--brand-cyan-soft)' : 'transparent',
                border: active
                  ? '1px solid var(--brand-cyan-border)'
                  : '1px solid transparent',
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }}>{meta.flag}</span>
              <div className="flex-1 text-start">
                <div
                  className="sf text-[14.5px] font-semibold"
                  style={{
                    /* Auto-adapt to theme via canvas tokens. Hardcoded
                       '#fff' here used to make the unselected language
                       invisible in light mode. */
                    color: active ? 'var(--brand-cyan-text)' : 'var(--text-primary)',
                  }}
                >
                  {meta.native}
                </div>
                <div
                  className="sf text-[10.5px] tracking-[0.10em] uppercase font-bold mt-0.5"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {meta.direction === 'rtl' ? 'RTL' : 'LTR'}
                </div>
              </div>
              {active && (
                <span
                  className="sf text-[10.5px] tracking-[0.14em] uppercase font-bold"
                  style={{ color: 'var(--brand-cyan-text)' }}
                >
                  {t('language.current')}
                </span>
              )}
              {active && <CheckIcon />}
            </button>
          );
        })}
      </nav>
    </>
  );
};

const CheckIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      width: 16,
      height: 16,
      display: 'block',
      color: 'var(--brand-cyan-text)',
    }}
  >
    <path d="M3 8.5 L6.5 12 L13 4.5" />
  </svg>
);
