import { VIDEO_PLAYER_YOUTUBE } from '../constants'

/**
 * Returns the offset used to shift all video's timecodes.
 */
export const getTimecodesOffset = (video, videoPlayer) => {
  if (videoPlayer === VIDEO_PLAYER_YOUTUBE) {
    return video.youtube_offset
  }

  console.warn(`getTimecode: Unknown provider ${videoPlayer}`)
  return 0
}

/**
 * Return the timecode shifted with appropriate offset.
 */
export const getTimecode = (videoPlayer, video, baseTimecode) => {
  return getTimecodesOffset(video, videoPlayer) + baseTimecode
}

export const THUMBNAILS_SIZES = {
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE',
}
