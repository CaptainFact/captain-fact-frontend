import 'babel-polyfill'


export const optionsToQueryString = (options) => (
  options && Object.keys(options).length > 0 ?
    `?${Object.entries(options).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')}` : ''
)

export const youtubeRegex =
  /^(http(s)?:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_]+)/

export const isExternal = (currentHref, url) =>
  (url.indexOf(':') > -1 || url.indexOf('//') > -1) && checkDomain(currentHref) !== checkDomain(url)


// ---- Private ----

function checkDomain(url) {
  if ( url.indexOf('//') === 0 )
    url = location.protocol + url
  return url.toLowerCase().replace(/([a-z])?:\/\//,'$1').split('/')[0]
}