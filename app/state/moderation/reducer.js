import { Record, Map } from 'immutable'
import { createAction, handleActions } from 'redux-actions'
import parseDateTime from '../../lib/parse_datetime'

import ModerationEntry from './record'


export const setLoading = createAction('MODERATION/SET_LOADING')
export const setModerationEntry = createAction('MODERATION/SET_ITEM')
export const removeModerationEntry = createAction('MODERATION/REMOVE_ITEM')

const INITIAL_STATE = new Record({
  isLoading: false,
  error: null,
  entry: null
})

const ModerationReducer = handleActions({
  [setModerationEntry]: {
    next: (state, {payload}) => (!payload ?
      state.set('isLoading', false) :
      state.merge({
        entry: prepareEntry(payload),
        isLoading: false
      })),
    throw: (state, action) => state.merge({
      isLoading: false,
      error: action.payload
    })
  },
  [setLoading]: (state, {payload}) => state.set('isLoading', payload),
  [removeModerationEntry]: (state) => state.set('entry', null)
}, INITIAL_STATE())

const prepareEntry = (entry) => {
  entry.action.time = parseDateTime(entry.action.time)
  entry.action.changes = new Map(entry.action.changes)
  return ModerationEntry(entry)
}

export default ModerationReducer
