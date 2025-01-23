import { VIDEO_PLAYER_YOUTUBE } from '../constants'

/**
 * Returns the offset used to shift all video's timecodes.
 */
export const getTimecodesOffset = (video, videoPlayer) => {
  if (videoPlayer === VIDEO_PLAYER_YOUTUBE) {
    return video.youtube_offset
  }

  // eslint-disable-next-line no-console
  console.warn(`getTimecode: Unknown provider ${videoPlayer}`)
  return 0
}

/**
 * Returns HD thumbnail URL if any, otherwise returns the default thumbnail URL.
 */
export const getHDThumbnailUrl = (video) => {
  if (video.youtube_id) {
    return `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`
  }

  return video.thumbnail
}
