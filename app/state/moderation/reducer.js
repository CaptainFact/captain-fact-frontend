import { Record, List } from "immutable"
import { createAction, handleActions } from 'redux-actions'
import parseDateTime from '../../lib/parseDateTime'

import UserAction from '../user_actions/record'


export const setLoading = createAction('MODERATION/SET_LOADING')
export const setSubmitting = createAction('MODERATION/SET_SUBMITTING')
export const setEntries = createAction('MODERATION/SET_ENTRIES')

const INITIAL_STATE = new Record({
  isLoading: false,
  isSubmitting: false,
  error: null,
  data: new List()
})

const ModerationReducer = handleActions({
  [setEntries]: {
    next: (state, {payload}) => state.merge({
      data: new List(payload).map(prepareModerationEntry),
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

const prepareAction = (action) => {
  action.time = parseDateTime(action.time)
  action.changes = new Map(action.changes)
  return UserAction(action)
}

export default ModerationReducer
