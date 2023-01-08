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
 * Return the timecode shifted with appropriate offset.
 */
export const getTimecode = (videoPlayer, video, baseTimecode) => {
  return getTimecodesOffset(video, videoPlayer) + baseTimecode
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

export const THUMBNAILS_SIZES = {
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE',
}
