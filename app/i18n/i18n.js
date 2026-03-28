import i18n from 'i18next'
import { startCase } from 'lodash'

import { JS_ENV } from '../config'
import { SUPPORTED_LOCALES } from '../constants'
import { getFromLocalStorage, LOCAL_STORAGE_KEYS } from '../lib/local_storage'
/* eslint-disable import/no-unresolved */
import * as ar from './ar'
import browserLocale from './browser_locale'
import * as en from './en'
import * as eo from './eo'
import * as es from './es'
import * as fr from './fr'
import * as pt_BR from './pt_BR'
import * as ru from './ru'
/* eslint-enable import/no-unresolved */

// Get initial locale from localStorage or browser
const getInitialLocale = () => {
  try {
    const stored = getFromLocalStorage(LOCAL_STORAGE_KEYS.PREFERENCES)
    if (stored) {
      const prefs = JSON.parse(stored)
      if (prefs.locale && SUPPORTED_LOCALES.includes(prefs.locale)) {
        return prefs.locale
      }
    }
  } catch {
    // Fall through to browser locale
  }
  return browserLocale()
}

// Configure I18N
i18n.init({
  fallbackLng: 'en',
  // Make sure to update `SUPPORTED_LOCALES` in `app/constants.js` when adding a new language
  resources: { fr, en, ar, es, pt_BR, eo, ru },
  lng: getInitialLocale(),
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

// Note: Locale changes are now handled by UserPreferencesContext, which calls i18n.changeLanguage()

export default i18n
