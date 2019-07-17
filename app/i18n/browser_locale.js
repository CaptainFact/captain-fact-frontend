import { SUPPORTED_LOCALES } from '../constants'

// Util to get browser locale
const navigatorLocale = () => {
  if (typeof window === 'undefined') {
    return 'en'
  }

  return window.navigator.userLanguage || window.navigator.language || 'en'
}

/**
 * Returns the browser locale as a two characters code ('fr', 'en'...) if
 * supported (see `SUPPORTED_LOCALES`) or the default locale, which is 'en'.
 */
const browserLocale = () => {
  const browserLocale = navigatorLocale()
    .split('-')[0]
    .toLowerCase()

  return SUPPORTED_LOCALES.includes(browserLocale) ? browserLocale : 'en'
}

export default browserLocale
