import { Map, Record, Set } from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import { resetVideoDebate } from '../actions'

export const addFlag = createAction('COMMENTS/ADD_FLAG')

export const fetchAll = createAction('COMMENTS/FETCH_ALL')

const INITIAL_STATE = new Record({
  isLoading: false,
  errors: null,
  comments: new Map(),
  replies: new Map(),
  selfSourcing: new Map(),
  voted: new Map(),
  voting: new Set(),
  myFlags: new Set(),
})

const CommentsReducer = handleActions(
  {
    // Flags
    [addFlag]: (state, { payload }) => state.update('myFlags', (f) => f.add(payload)),
    [resetVideoDebate]: () => INITIAL_STATE(),
  },
  INITIAL_STATE(),
)

export default CommentsReducer
