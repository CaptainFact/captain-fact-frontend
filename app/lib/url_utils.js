import 'core-js/es7/object'


export const optionsToQueryString = (options) => {
  if (!options || Object.keys(options).length === 0)
    return ''
  return `?${Object.entries(options).map(([key, value]) => `${key}=${encodeURIComponent(value)}`
  ).join('&')}`
}

export const youtubeRegex =  /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i

export const isExternal = (currentHref, url) => (url.indexOf(':') > -1 || url.indexOf('//') > -1) && checkDomain(currentHref) !== checkDomain(url)


// ---- Private ----

function checkDomain(url) {
  const fullURL = url.indexOf('//') === 0 ? location.protocol + url : url
  return fullURL.toLowerCase().replace(/([a-z])?:\/\//, '$1').split('/')[0]
}
