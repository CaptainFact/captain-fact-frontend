export const optionsToQueryString = (options) => (
  options && Object.keys(options).length > 0 ?
    `?${Object.entries(options).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')}` : ''
)

export const youtubeRegex =
  /^(http(s)?:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/

export const dailymotionRegex =
  /^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/

export const soundcloudRegex =
  /^https?:\/\/(soundcloud.com|snd.sc)\/([a-z0-9-_]+\/[a-z0-9-_]+)$/
