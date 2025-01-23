import i18n from 'i18next'
import { startCase } from 'lodash'

import { JS_ENV } from '../config'
import store from '../state/index'
import { changeLocale } from '../state/user_preferences/reducer'
/* eslint-disable import/no-unresolved */
import * as ar from './ar'
import * as en from './en'
import * as eo from './eo'
import * as es from './es'
import * as fr from './fr'
import * as pt_BR from './pt_BR'
import * as ru from './ru'
/* eslint-enable import/no-unresolved */

// Configure I18N
i18n.init({
  fallbackLng: 'en',
  // Make sure to update `SUPPORTED_LOCALES` in `app/constants.js` when adding a new language
  resources: { fr, en, ar, es, pt_BR, eo, ru },
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
        return startCase(value)
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
