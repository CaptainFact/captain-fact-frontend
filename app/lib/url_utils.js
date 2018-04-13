import 'core-js/es7/object.js'


export const optionsToQueryString = (options) => {
  if (!options || Object.keys(options).length === 0)
    return ''
  return `?${Object.entries(options).map(([key, value]) => 
    `${key}=${encodeURIComponent(value)}`
  ).join('&')}`
}

export const youtubeRegex =
  /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i

export const isExternal = (currentHref, url) =>
  (url.indexOf(':') > -1 || url.indexOf('//') > -1) && checkDomain(currentHref) !== checkDomain(url)


// ---- Private ----

function checkDomain(url) {
  if (url.indexOf('//') === 0 )
    url = location.protocol + url
  return url.toLowerCase().replace(/([a-z])?:\/\//,'$1').split('/')[0]
}