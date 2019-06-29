import i18n from 'i18next'
import titleCase from 'voca/title_case'

import dateLocaleFR from 'date-fns/locale/fr'
import datelocaleEN from 'date-fns/locale/en'
import datelocaleAR from 'date-fns/locale/ar'
import * as fr from './fr'
import * as en from './en'
import * as ar from './ar'
import store from '../state/index'
import { changeLocale } from '../state/user_preferences/reducer'
import { JS_ENV } from '../config'

// Add default formats for dates
dateLocaleFR.defaultDateTimeFormat = '[Le] D MMM YYYY [à] H:mm'
dateLocaleFR.defaultDateFormat = '[Le] D MMM YYYY'
datelocaleEN.defaultDateTimeFormat = 'D MMM YYYY [at] H:mm'
datelocaleEN.defaultDateFormat = 'D MMM YYYY'

export const locales = { fr: dateLocaleFR, en: datelocaleEN, ar: datelocaleAR }

// Configure I18N
i18n.init({
  fallbackLng: 'en',
  resources: { fr, en, ar },
  lng: store.getState().UserPreferences.locale,
  defaultNS: 'main',
  joinArrays: '\n',
  debug: JS_ENV === 'dev',
  react: {
    wait: true
  },
  interpolation: {
    escapeValue: false, // Not needed for react
    formatSeparator: ',',
    format(value, format) {
      if (format === 'lowerCase') return value.toLowerCase()
      if (format === 'upperCase') return value.toUpperCase()
      if (format === 'titleCase') return titleCase(value)
      if (format === 'unSnake') return value.replace('_', ' ')
      return value
    }
  }
})

i18n.on('languageChanged', language => store.dispatch(changeLocale(language)))

export default i18n
