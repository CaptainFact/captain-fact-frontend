import 'babel-polyfill'


export const optionsToQueryString = (options) => (
  options && Object.keys(options).length > 0 ?
    `?${Object.entries(options).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')}` : ''
)

export const youtubeRegex =
  /^(http(s)?:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_]+)/
