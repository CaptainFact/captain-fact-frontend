import { Record } from "immutable"
import { createAction, handleActions } from 'redux-actions'

import User from "../record"

// Actions
export const set = createAction('CURRENT_USER/SET')
export const setLoading = createAction('CURRENT_USER/SET_LOADING')
export const reset = createAction('CURRENT_USER/RESET')

// Reducer

const INITIAL_STATE = new Record({
  error: null,
  isLoading: false,
  data: new User()
})

const CurrentUserReducer = handleActions({
  [set]: {
    next: (state, {payload}) => {
      return state.mergeDeep({data: payload || {}, error: null, isLoading: false})
    },
    throw: (state, {payload}) => {
      return state.merge({error: payload, isLoading: false})
    }
  },
  [setLoading]: (state, {payload}) => state.set('isLoading', payload),
  [reset]: () => INITIAL_STATE()
}, INITIAL_STATE())

export default CurrentUserReducer