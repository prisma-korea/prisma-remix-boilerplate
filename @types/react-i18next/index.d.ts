import 'react-i18next';

import type {resources} from '~/i18n';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof resources.en;
    resources: typeof resources['en'];
  }
}
