import { SocketApi } from '../../API'
import { VIDEO_DEBATE_CHANNEL } from '../../constants'
import { presenceDiff, setPresence } from './presence/reducer'
import * as videoReducer from './video/reducer'
import { errorToFlash, errorMsgToFlash } from '../flashes/reducer'
import { createEffect, generateFSAError } from '../utils'

export const joinVideoDebateChannel = videoId => dispatch => {
  // Connect to channel
  dispatch(videoReducer.setLoading(true))
  dispatch(
    videoReducer.fetchAll(
      SocketApi.joinChannel(VIDEO_DEBATE_CHANNEL, `${VIDEO_DEBATE_CHANNEL}:${videoId}`, {
        speaker_added: s => dispatch(videoReducer.addSpeaker(s)),
        speaker_removed: s => dispatch(videoReducer.removeSpeaker(s)),
        speaker_updated: s => dispatch(videoReducer.updateSpeaker(s)),
        presence_state: s => dispatch(setPresence(s)),
        presence_diff: s => dispatch(presenceDiff(s)),
        video_updated: ({ video }) => dispatch(videoReducer.updateVideo(video))
      })
    )
  )
}

export const leaveVideoDebateChannel = () => () => {
  return SocketApi.leaveChannel(VIDEO_DEBATE_CHANNEL)
}

export const addSpeaker = speaker => {
  return createEffect(SocketApi.push(VIDEO_DEBATE_CHANNEL, 'new_speaker', speaker), {
    catch: errorToFlash
  })
}

export const removeSpeaker = speaker => {
  return createEffect(SocketApi.push(VIDEO_DEBATE_CHANNEL, 'remove_speaker', speaker), {
    catch: errorToFlash
  })
}

export const updateSpeaker = speaker => {
  return createEffect(SocketApi.push(VIDEO_DEBATE_CHANNEL, 'update_speaker', speaker), {
    catch: [errorMsgToFlash, generateFSAError]
  })
}

/**
 * Shift all video's statements
 *
 * @param {object} offsets a map of offsets
 *
 * ## Examples
 * > shiftStatements({youtube_offset: 42})
 */
export const shiftStatements = offsets => {
  return createEffect(SocketApi.push(VIDEO_DEBATE_CHANNEL, 'shift_statements', offsets), {
    catch: errorToFlash
  })
}

/** Subscribe or unsubscribe a user from given video */
export const changeSubscription = newValue => {
  return SocketApi.push(VIDEO_DEBATE_CHANNEL, 'change_subscription', newValue)
    .then(() => {
      console.log('???')
      return videoReducer.setSubscription(newValue)
    })
    .catch(e => {
      console.log(e)
    })
}
