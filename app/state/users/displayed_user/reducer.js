import { Record } from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import parseDateTime from '../../../lib/parse_datetime'
import User from '../record'

export const setLoading = createAction('DISPLAYED_USER/SET_LOADING')
export const setUser = createAction('DISPLAYED_USER/SET')
export const setError = createAction('DISPLAYED_USER/SET_ERROR')
export const resetUser = createAction('DISPLAYED_USER/RESET')

const INITIAL_STATE = new Record({
  isLoading: false,
  errors: null,
  data: new User(),
})

const DisplayedUserReducer = handleActions(
  {
    [setUser]: {
      next: (state, { payload }) => {
        return state.merge({
          data: new User({
            ...payload,
            registered_at: parseDateTime(payload.registered_at),
          }),
          isLoading: false,
          errors: null,
        })
      },
      throw: (state, { payload }) => state.merge({ errors: payload, isLoading: false }),
    },
    [setError]: (state, { payload }) => state.merge({ errors: payload, isLoading: false }),
    [setLoading]: (state, { payload }) => state.set('isLoading', payload),
    [resetUser]: () => INITIAL_STATE(),
  },
  INITIAL_STATE(),
)

export default DisplayedUserReducer
