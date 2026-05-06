import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json';
import he from './he.json';

/* === Halo i18n config ===
   - English + Hebrew dictionaries (add more by dropping a JSON file
     and registering it in `resources` below).
   - Hebrew is RTL; English is LTR. The `dir()` helper exported below
     reads i18next's current language and returns the right direction.
   - Default = English. Detected language sources: localStorage first,
     then browser/htmlTag, then default. (No URL/cookie/path detection
     — keep storybook's URL clean.)
   - On language change, we automatically flip `<html dir>` and the
     `.glass-app` wrapper's `dir` attribute via the listener below. */

export const SUPPORTED_LANGUAGES = ['en', 'he'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const RTL_LANGUAGES: SupportedLanguage[] = ['he'];

export const dirFor = (lang: string): 'ltr' | 'rtl' =>
  RTL_LANGUAGES.includes(lang as SupportedLanguage) ? 'rtl' : 'ltr';

/* Idempotent init — calling this multiple times is a no-op once
   initialized. Required because the storybook decorator imports it
   at preview-load time, and individual screens may also import. */
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        he: { translation: he },
      },
      fallbackLng: 'en',
      supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
      interpolation: { escapeValue: false },
      detection: {
        order: ['localStorage', 'htmlTag', 'navigator'],
        lookupLocalStorage: 'halo.lang',
        caches: ['localStorage'],
      },
      returnNull: false,
    });

  /* Flip the document's dir + the .glass-app wrapper(s) on language change. */
  const applyDir = (lang: string) => {
    const dir = dirFor(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', lang);
      /* Storybook puts the canvas in an iframe — the .glass-app lives
         inside, so we also flip every instance found. */
      document.querySelectorAll('.glass-app').forEach((el) => {
        (el as HTMLElement).setAttribute('dir', dir);
      });
    }
  };

  i18n.on('languageChanged', applyDir);
  /* Apply once on startup for the detected/default language. */
  applyDir(i18n.language || 'en');
}

export default i18n;
