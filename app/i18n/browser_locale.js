// Util to get browser locale
const browserLocale = () =>
  (window.navigator.userLanguage || window.navigator.language || 'en')
    .split('-')[0].toLowerCase()

export default browserLocale