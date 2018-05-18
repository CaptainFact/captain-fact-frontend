import { Record, List } from 'immutable'
import { createAction, handleActions } from 'redux-actions'
import parseDateTime from '../../lib/parse_datetime'

import Video from './record'


export const setLoading = createAction('VIDEOS/SET_LOADING')
export const setSubmitting = createAction('VIDEOS/SET_SUBMITTING')
export const reset = createAction('VIDEOS/RESET')
export const setVideos = createAction('VIDEOS/SET')


const INITIAL_STATE = new Record({
  isLoading: false,
  isSubmitting: false,
  error: null,
  data: new List()
})

const VideosReducer = handleActions({
  [setVideos]: {
    next: (state, {payload}) => state.merge({
      data: new List(payload).map(prepareVideo),
      isLoading: false
    }),
    throw: (state, action) => state.merge({
      isLoading: false,
      error: action.payload
    })
  },
  [setSubmitting]: (state, {payload}) => state.set('isSubmitting', payload),
  [setLoading]: (state, {payload}) => state.set('isLoading', payload),
  [reset]: () => INITIAL_STATE()
}, INITIAL_STATE())


const prepareVideo = (video) => {
  video.posted_at = parseDateTime(video.posted_at)
  return new Video(video).update('speakers', s => new List(s))
}

export default VideosReducer
