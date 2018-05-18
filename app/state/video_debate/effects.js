import { SocketApi } from '../../API'
import { VIDEO_DEBATE_CHANNEL } from '../../constants'
import { presenceDiff, setPresence } from './presence/reducer'
import * as videoReducer from './video/reducer'
import { errorToFlash, errorMsgToFlash } from '../flashes/reducer'
import { createEffect, generateFSAError } from '../utils'


export const joinVideoDebateChannel = videoId => dispatch => {
  // Connect to channel
  dispatch(videoReducer.setLoading(true))
  dispatch(videoReducer.fetchAll(SocketApi.joinChannel(
    VIDEO_DEBATE_CHANNEL, `${VIDEO_DEBATE_CHANNEL}:${videoId}`, {
      speaker_added: s => dispatch(videoReducer.addSpeaker(s)),
      speaker_removed: s => dispatch(videoReducer.removeSpeaker(s)),
      speaker_updated: s => dispatch(videoReducer.updateSpeaker(s)),
      presence_state: s => dispatch(setPresence(s)),
      presence_diff: s => dispatch(presenceDiff(s)),
    }
  )))
}

export const leaveVideoDebateChannel = () => () =>
  SocketApi.leaveChannel(VIDEO_DEBATE_CHANNEL)

export const addSpeaker = speaker => createEffect(
  SocketApi.push(VIDEO_DEBATE_CHANNEL, 'new_speaker', speaker),
  {catch: errorToFlash}
)

export const removeSpeaker = speaker => createEffect(
  SocketApi.push(VIDEO_DEBATE_CHANNEL, 'remove_speaker', speaker),
  {catch: errorToFlash}
)

export const updateSpeaker = speaker => createEffect(
  SocketApi.push(VIDEO_DEBATE_CHANNEL, 'update_speaker', speaker),
  {catch: [errorMsgToFlash, generateFSAError]}
)

