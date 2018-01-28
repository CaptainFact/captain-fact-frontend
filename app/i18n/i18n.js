import i18n from 'i18next'
import titleCase from 'voca/title_case'

import dateLocaleFR from 'date-fns/locale/fr'
import datelocaleEN from 'date-fns/locale/en'
import fr from './fr'
import en from './en'
import store from '../state/index'
import { fetchLocale } from '../state/user_preferences/effects'
import { JS_ENV } from '../config.jsenv'

// The moment locales must be imported once to be loaded
import moment from 'moment'
import 'moment/locale/fr';

// Add default formats for dates
dateLocaleFR.defaultDateTimeFormat = "[Le] D MMM YYYY [à] H:mm"
dateLocaleFR.defaultDateFormat = "[Le] D MMM YYYY"
datelocaleEN.defaultDateTimeFormat = "D MMM YYYY [at] H:mm"
datelocaleEN.defaultDateFormat = "D MMM YYYY"

export const locales = {fr: dateLocaleFR, en: datelocaleEN}

// Configure I18N
i18n
  .init({
    fallbackLng: 'en',
    resources: {fr, en},
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