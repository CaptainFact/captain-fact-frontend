export const optionsToQueryString = (options) => (
  options && Object.keys(options).length > 0 ?
    `?${Object.entries(options).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')}` : ''
)

export const youtubeRegex =
  /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/

export const dailymotionRegex =
  /^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/

export const soundcloudRegex =
  /^https?:\/\/(soundcloud.com|snd.sc)\/([a-z0-9-_]+\/[a-z0-9-_]+)$/
