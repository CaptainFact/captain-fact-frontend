import { toPairs, pickBy, isEmpty } from 'lodash'

/**
 * Transorm an object into a query string. Strips undefined values.
 *
 * ## Example
 *
 *    > objectToQueryString({a: 42, b: "hello", c: undefined})
 *    "?a=42&b=hello"
 */
export const optionsToQueryString = (options) => {
  const definedOptions = pickBy(options, (value) => value !== undefined)
  if (isEmpty(definedOptions)) {
    return ''
  }

  const encodeValue = (value) => {
    if (Array.isArray(value)) {
      return value.concat.map(encodeURIComponent).join(',')
    }
    return encodeURIComponent(value)
  }

  return `?${toPairs(definedOptions)
    .map(([key, value]) => `${key}=${encodeValue(value)}`)
    .join('&')}`
}

export const youtubeRegex =
  /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i
export const facebookVideoRegex =
  /http(?:s)?:\/\/(?:www\.)?facebook.(?:[a-z]+)\/(?!(?:video\.php\?v=\d+|usernameFB\/videos\/\d+)).*/

export const isExternal = (currentHref, url) =>
  (url.indexOf(':') > -1 || url.indexOf('//') > -1) && checkDomain(currentHref) !== checkDomain(url)

/**
 * Define is URL points to a downloadable file. We only support downloading
 * PDF files for now.
 */
export const isDownloadableFile = (url) => {
  return url.endsWith('.pdf')
}

export const wikidataURL = (wikidataQID) => {
  return `https://www.wikidata.org/wiki/${wikidataQID}`
}

// ---- Private ----

function checkDomain(url) {
  const fullURL = url.indexOf('//') === 0 ? location.protocol + url : url
  return fullURL
    .toLowerCase()
    .replace(/([a-z])?:\/\//, '$1')
    .split('/')[0]
}
