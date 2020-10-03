import { Record } from 'immutable'
import { createAction, handleActions } from 'redux-actions'

export const setSubmitting = createAction('VIDEOS/SET_SUBMITTING')
export const reset = createAction('VIDEOS/RESET')

const INITIAL_STATE = new Record({
  isSubmitting: false,
})

const VideosReducer = handleActions(
  {
    [setSubmitting]: (state, { payload }) => state.set('isSubmitting', payload),
    [reset]: () => INITIAL_STATE(),
  },
  INITIAL_STATE()
)

export default VideosReducer
