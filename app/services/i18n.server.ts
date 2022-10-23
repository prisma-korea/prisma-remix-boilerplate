import Backend from 'i18next-fs-backend';
import {RemixI18Next} from 'remix-i18next';
import {i18nConfig} from '~/i18n';
import {resolve} from 'node:path';

export let remixI18n = new RemixI18Next({
  detection: {
    // This is the list of languages your application supports
    supportedLanguages: ['en', 'ko'],
    // This is the language you want to use in case the user language is not
    // listed above
    fallbackLanguage: 'en',
  },
  // This is the configuration for i18next used when translating messages server
  // side only
  i18next: {
    ...i18nConfig,
    backend: {loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json')},
  },
  // The backend you want to use to load the translations
  // Tip: You could pass `resources` to the `i18next` configuration and avoid
  // a backend here
  backend: Backend,
});
