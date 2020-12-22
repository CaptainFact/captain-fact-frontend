import i18n from 'i18next'
import titleCase from 'voca/title_case'

import dateLocaleFR from 'date-fns/locale/fr'
import datelocaleEN from 'date-fns/locale/en-US'
import datelocaleAR from 'date-fns/locale/ar-MA'
import datelocaleES from 'date-fns/locale/es'
import datelocalePTBR from 'date-fns/locale/pt-BR'
import * as fr from './fr'
import * as en from './en'
import * as ar from './ar'
import * as es from './es'
import * as pt_BR from './pt_BR'
import store from '../state/index'
import { changeLocale } from '../state/user_preferences/reducer'
import { JS_ENV } from '../config'

// Add default formats for dates
dateLocaleFR.defaultDateTimeFormat = '[Le] d MMM yyyy [à] H:mm'
dateLocaleFR.defaultDateFormat = '[Le] d MMM yyyy'
datelocaleEN.defaultDateTimeFormat = 'd MMM yyyy [at] H:mm'
datelocaleEN.defaultDateFormat = 'd MMM yyyy'
datelocaleES.defaultDateTimeFormat = '[El] d MMM yyyy [a las] H:mm'
datelocaleES.defaultDateFormat = '[El] d MMM yyyy'
datelocalePTBR.defaultDateFormat = 'd MMM yyyy'
datelocalePTBR.defaultDateTimeFormat = 'd MMM yyyy [às] H:mm'

export const locales = {
  fr: dateLocaleFR,
  en: datelocaleEN,
  ar: datelocaleAR,
  es: datelocaleES,
  pt_BR: datelocalePTBR,
}

// Configure I18N
i18n.init({
  fallbackLng: 'en',
  resources: { fr, en, ar, es, pt_BR },
  lng: store.getState().UserPreferences.locale,
  defaultNS: 'main',
  joinArrays: '\n',
  debug: JS_ENV === 'dev',
  react: {
    wait: true,
  },
  interpolation: {
    escapeValue: false, // Not needed for react
    formatSeparator: ',',
    format(value, format) {
      if (format === 'lowerCase') {
        return value.toLowerCase()
      }
      if (format === 'upperCase') {
        return value.toUpperCase()
      }
      if (format === 'titleCase') {
        return titleCase(value)
      }
      if (format === 'unSnake') {
        return value.replace('_', ' ')
      }
      return value
    },
  },
})

i18n.on('languageChanged', (language) => store.dispatch(changeLocale(language)))

export default i18n
