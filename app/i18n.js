import i18n from 'i18next'
import XHR from 'i18next-xhr-backend'
import titleCase from 'voca/title_case'
import Cache from 'i18next-localstorage-cache'

import store from './state'
import localeFr from 'date-fns/locale/fr'
import localeEn from 'date-fns/locale/en'
import { fetchLocale } from './state/user_preferences/effects'
import { JS_ENV } from './config.jsenv'

// The moment locales must be imported once to be loaded
import moment from 'moment'
import 'moment/locale/fr';

// Add default formats for dates
localeFr.defaultDateTimeFormat = "[Le] D MMM YYYY [à] H:mm"
localeFr.defaultDateFormat = "[Le] D MMM YYYY"
localeEn.defaultDateTimeFormat = "D MMM YYYY [at] H:mm"
localeEn.defaultDateFormat = "D MMM YYYY"

export const locales = {fr: localeFr, en: localeEn,}

// Configure I18N
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
        en: "0.7.8",
        fr: "0.7.8"
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
i18n.on('languageChanged', language => moment.locale(language))


export default i18n;