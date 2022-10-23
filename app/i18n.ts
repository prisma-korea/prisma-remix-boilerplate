import type {InitOptions} from 'i18next';
import en from '../public/locales/en.json';
import ko from '../public/locales/ko.json';

export const resources = {
  en: {translation: en},
  ko: {translation: ko},
};

export const defaultNS = 'translation';

export const i18nConfig: Omit<InitOptions, "react" | "detection"> | null = {
  fallbackLng: 'en',
  debug: true,
  supportedLngs: ['en', 'ko'],
  ns: ['translation'],
  defaultNS,
  load: 'languageOnly',
  nonExplicitSupportedLngs: true,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources,
}
