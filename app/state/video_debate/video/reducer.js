import { handleActions, createAction } from 'redux-actions'
import { Record, List } from 'immutable'
import uuidv1 from 'uuid/v1'

import { VIDEO_PLAYER_YOUTUBE } from '../../../constants'
import { getTimecodesOffset } from '../../../lib/video_utils'
import Video from '../../videos/record'
import Speaker from '../../speakers/record'
import { resetVideoDebate } from '../actions'

// Define actions

export const fetchAll = createAction('VIDEO/FETCH_ALL')
export const setLoading = createAction('VIDEO/SET_LOADING')
export const addSpeaker = createAction('VIDEO/ADD_SPEAKER')
export const removeSpeaker = createAction('VIDEO/REMOVE_SPEAKER')
export const updateSpeaker = createAction('VIDEO/UPDATE_SPEAKER')
export const updateVideo = createAction('VIDEO/UPDATE_VIDEO')
export const setSubscription = createAction('VIDEO/SET_SUBSCRIPTION')

export const setPosition = createAction('PLAYBACK/SET_POSITION')
export const forcePosition = createAction('PLAYBACK/FORCE_POSITION')
export const setPlaying = createAction('PLAYBACK/SET_PLAYING')

// Define initial states

const FORCED_POSITION_RECORD = new Record({ requestId: null, time: 0 })

const INITIAL_STATE = new Record({
  data: new Video(),
  errors: null,
  isLoading: false,
  /** Wether the currently logged in user is subscribed to this video's changes */
  isSubscribed: false,
  /** The player type currently displayed */
  player: VIDEO_PLAYER_YOUTUBE,
  /** An offset used to shift all video's timecodes */
  offset: 0,
  /** Information about the current playback status */
  playback: new Record({
    position: null,
    forcedPosition: FORCED_POSITION_RECORD(),
    isPlaying: false
  })()
})

// Some helpers

function sortSpeakers(speakers) {
  return speakers.sortBy(s => s.title + s.full_name)
}

// Bind actions to reducer

const VideoReducer = handleActions(
  {
    [updateVideo]: (state, { payload }) => {
      return state.merge({
        data: payload,
        offset: getTimecodesOffset(payload, state.player)
      })
    },
    [fetchAll]: {
      next: (state, { payload: { speakers, is_subscribed, ...data } }) => {
        speakers = sortSpeakers(new List(speakers.map(s => new Speaker(s))))
        return state.mergeDeep({
          isLoading: false,
          isSubscribed: is_subscribed,
          errors: null,
          data: new Video(data).set('speakers', speakers),
          offset: getTimecodesOffset(data, state.player)
        })
      },
      throw: (state, { payload }) => {
        return state.merge({ errors: payload, isLoading: false })
      }
    },
    [setLoading]: (state, { payload }) => state.set('isLoading', payload),
    [addSpeaker]: (state, { payload }) => {
      return state.updateIn(['data', 'speakers'], s => {
        return sortSpeakers(s.push(new Speaker(payload)))
      })
    },
    [removeSpeaker]: (state, { payload: { id } }) => {
      const speakerIdx = state.data.speakers.findIndex(s => s.id === id)
      if (speakerIdx !== -1) {
        return state.deleteIn(['data', 'speakers', speakerIdx])
      }
      return state
    },
    [updateSpeaker]: (state, { payload }) => {
      const speakerIdx = state.data.speakers.findIndex(s => s.id === payload.id)
      if (speakerIdx !== -1)
        return state
          .mergeIn(['data', 'speakers', speakerIdx], payload)
          .updateIn(['data', 'speakers'], speakers => sortSpeakers(speakers))
      return state
    },
    [setPosition]: (state, { payload }) => {
      return state.setIn(['playback', 'position'], Math.trunc(payload))
    },
    [forcePosition]: (state, { payload }) => {
      return state.update('playback', p => p.mergeDeep({
        position: payload,
        forcedPosition: { time: payload, requestId: uuidv1() }
      })
      )
    },
    [setPlaying]: (state, { payload }) => {
      return state.setIn(['playback', 'isPlaying'], payload)
    },
    [setSubscription]: (state, { payload }) => {
      return state.set('isSubscribed', payload)
    },
    [resetVideoDebate]: () => INITIAL_STATE()
  },
  INITIAL_STATE()
)
export default VideoReducer
