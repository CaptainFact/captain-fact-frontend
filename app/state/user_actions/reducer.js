import { Record, List, Map } from 'immutable'
import { createAction, handleActions, combineActions } from 'redux-actions'

import parseDateTime from '../../lib/parse_datetime'
import UserAction from './record'
import { resetVideoDebate } from '../video_debate/actions'
import { getEntityIDFromAction } from '../../lib/user_action_entity_id'

export const setLoading = createAction('VIDEO_DEBATE_HISTORY/SET_LOADING')
export const reset = createAction('VIDEO_DEBATE_HISTORY/RESET')
export const fetchAll = createAction('VIDEO_DEBATE_HISTORY/FETCH')
export const addAction = createAction('VIDEO_DEBATE_HISTORY/ADD_ACTION')

const INITIAL_STATE = new Record({
  actions: new List(),
  lastActionsIds: new List(),
  isLoading: true,
  errors: null
})

const UsersActionsReducer = handleActions(
  {
    [setLoading]: (state, { payload }) => state.set('isLoading', payload),
    [fetchAll]: {
      next: (state, { payload: { actions } }) => {
        const preparedActions = new List(actions.map(prepareAction))
        const sortedActions = preparedActions.sortBy(a => -a.time)

        return state.merge({
          actions: sortedActions,
          lastActionsIds: getLastActions(sortedActions),
          isLoading: false,
          errors: null
        })
      },
      throw: (state, { payload }) => state.merge({ isLoading: false, errors: payload })
    },
    [addAction]: (state, { payload }) => {
      const action = prepareAction(payload)
      const actions = state.actions.insert(0, action).sortBy(a => -a.time)
      return state.set('actions', actions).set('lastActionsIds', getLastActions(actions))
    },
    [combineActions(reset, resetVideoDebate)]: () => INITIAL_STATE()
  },
  INITIAL_STATE()
)
export default UsersActionsReducer

function getLastActions(actions) {
  const lastActionsMap = {}
  actions.forEach(action => {
    const entityKey = `${action.entity}:${getEntityIDFromAction(action)}`
    if (!lastActionsMap[entityKey]) lastActionsMap[entityKey] = action.id
  })
  return List(Object.values(lastActionsMap))
}

function prepareAction(action) {
  return UserAction({
    ...action,
    time: parseDateTime(action.time),
    changes: new Map(action.changes)
  })
}
