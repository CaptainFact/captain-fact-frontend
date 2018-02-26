import { Record, List, Map } from "immutable"
import { createAction, handleActions } from 'redux-actions'
import parseDateTime from '../../lib/parse_datetime'

import UserAction from '../user_actions/record'


export const setLoading = createAction('MODERATION/SET_LOADING')
export const setSubmitting = createAction('MODERATION/SET_SUBMITTING')
export const setItems = createAction('MODERATION/SET_ITEMS')
export const removeItem = createAction('MODERATION/REMOVE_ITEM')

const INITIAL_STATE = new Record({
  isLoading: false,
  isSubmitting: false,
  error: null,
  items: new List()
})

const ModerationReducer = handleActions({
  [setItems]: {
    next: (state, {payload}) => state.merge({
      items: new List(payload.map(prepareAction)),
      isLoading: false
    }),
    throw: (state, action) => state.merge({
      isLoading: false,
      error: action.payload
    })
  },
  [setLoading]: (state, {payload}) => state.set('isLoading', payload),
  [removeItem]: (state, {payload: {id}}) => {
    const moderationId = state.items.findIndex(moderationEntry => moderationEntry.id === id)
    if (moderationId) {
      return state.update('items', i => i.delete(moderationId))
    }
  }
}, INITIAL_STATE())

const prepareAction = (action) => {
  action.time = parseDateTime(action.time)
  action.changes = new Map(action.changes)
  return UserAction(action)
}

export default ModerationReducer
