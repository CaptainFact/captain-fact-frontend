import i18n from 'i18next'
import XHR from 'i18next-xhr-backend'
import titleCase from 'voca/title_case'
import Cache from 'i18next-localstorage-cache'

import store from './state'
import localeFr from 'date-fns/locale/fr'
import localeEn from 'date-fns/locale/en'
import { fetchLocale } from './state/user_preferences/effects'
import { JS_ENV } from './config.jsenv'


export const locales = {
  fr: Object.assign(localeFr, {
    defaultDateTimeFormat: "[Le] D MMM YYYY [à] H:mm",
    defaultDateFormat: "[Le] D MMM YYYY"
  }),
  en: Object.assign(localeEn, {
    defaultDateTimeFormat: "D MMM YYYY [at] H:mm",
    defaultDateFormat: "D MMM YYYY"
  }),
}

i18n
  .use(XHR)
  .use(Cache)
  .init({
    backend: {
      loadPath: '/assets/locales/{{lng}}/{{ns}}.json'
    },
    cache: {
      enabled: JS_ENV === 'prod',
      prefix: '_translations',
      expirationTime: 48*60*60*1000, // 48h
      versions: {
        en: "0.7.0",
        fr: "0.7.0"
      }
    },
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: 'i18nLocale',
      caches: ['localStorage']
    },
    fallbackLng: 'en',
    load: 'languageOnly',
    ns: ['main', 'errors'],
    lng: store.getState().UserPreferences.locale,
    defaultNS: 'main',
    joinArrays: '\n',
    debug: JS_ENV !== 'prod',
    react: {
      wait: true
    },
    interpolation: {
      escapeValue: false, // Not needed for react
      formatSeparator: ',',
      format: function(value, format, lng) {
        if (format === 'lowerCase') return value.toLowerCase();
        if (format === 'upperCase') return value.toUpperCase();
        if (format === 'titleCase') return titleCase(value);
        if (format === 'unSnake') return value.replace('_', ' ');
        return value;
      }
    }
  });

i18n.on('languageChanged', language => store.dispatch(fetchLocale(language)))

export default i18n;