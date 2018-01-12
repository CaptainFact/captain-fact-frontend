import { Record, List, Map } from 'immutable'
import { createAction, handleActions, combineActions } from 'redux-actions'
import { diffWordsWithSpace } from 'diff'

import parseDateTime from '../../lib/parse_datetime'
import formatSeconds from "../../lib/seconds_formatter"
import UserAction from "./record"
import { ACTION_DELETE, ACTION_REMOVE, ACTION_RESTORE, ENTITY_SPEAKER, ENTITY_STATEMENT } from '../../constants'
import { resetVideoDebate } from '../video_debate/actions'

export const setLoading = createAction('VIDEO_DEBATE_HISTORY/SET_LOADING')
export const reset = createAction('VIDEO_DEBATE_HISTORY/RESET')
export const fetchAll = createAction('VIDEO_DEBATE_HISTORY/FETCH')
export const addAction = createAction('VIDEO_DEBATE_HISTORY/ADD_ACTION')
export const generateDiff = createAction('VIDEO_DEBATE_HISTORY/GENERATE_DIFF')
export const hideDiff = createAction('VIDEO_DEBATE_HISTORY/HIDE_DIFF')
export const generateAllDiffs = createAction('VIDEO_DEBATE_HISTORY/GENERATE_ALL_DIFF')
export const hideAllDiffs = createAction('VIDEO_DEBATE_HISTORY/HIDE_ALL_DIFF')

const INITIAL_STATE = new Record({
  actions: new List(),
  lastActionsIds: new List(),
  diffs: new Map(),
  isLoading: true,
  errors: null
})

const UsersActionsReducer = handleActions({
  [setLoading]: (state, {payload}) => state.set('isLoading', payload),
  [fetchAll]: {
    next: (state, {payload: {actions}}) => {
      const preparedActions = new List(actions.map(a => prepareAction(a))).sortBy(a => -a.time)

      return state.merge({
        actions: preparedActions,
        lastActionsIds: getLastActions(preparedActions),
        isLoading: false,
        errors: null
      })
    },
    throw: (state, {payload}) => state.merge({isLoading: false, errors: payload})
  },
  [addAction]: (state, {payload}) => {
    const action = prepareAction(payload)
    const actions = state.actions.insert(0, action).sortBy(a => -a.time)
    return state.set('actions', actions).set('lastActionsIds', getLastActions(actions))
  },
  [generateDiff]: (state, {payload}) => {
    const diff = generateDiffForAction(state, payload)
    return diff ? state.setIn(['diffs', payload.id], diff) : state
  },
  [hideDiff]: (state, {payload}) => {
    if (state.diffs.has(payload.id))
      return state.update('diffs', diffs => diffs.remove(payload.id))
    return state
  },
  [generateAllDiffs]: state => {
    const diffs = state.diffs.withMutations(allDiffs => {
      state.actions.forEach(action => {
        const diff = generateDiffForAction(state, action)
        if (diff)
          allDiffs.set(action.id, diff)
      })
      return allDiffs
    })
    return state.set('diffs', diffs)
  },
  [hideAllDiffs]: state => state.set('diffs', new Map()),
  [combineActions(reset, resetVideoDebate)]: () => INITIAL_STATE()
}, INITIAL_STATE())
export default UsersActionsReducer

function getLastActions(actions) {
  const lastActionsMap = {}
  actions.forEach(action => {
    const entityKey = `${action.entity}:${action.entity_id}`
    if (!lastActionsMap[entityKey])
      lastActionsMap[entityKey] = action.id
  })
  return List(Object.values(lastActionsMap))
}

function generateDiffForAction(state, action) {
  // If diff already exists, do nothing
  if (state.diffs.has(action.id))
    return null

  const entityActions = state.actions.filter(a =>
    a.entity_id === action.entity_id && a.entity === action.entity
  )
  const actionIdx = entityActions.findIndex(a => a.id === action.id)
  // Get previous state
  let prevState = new Map()
  if (actionIdx + 1 < entityActions.size)
    prevState = buildReferenceEntity(entityActions.slice(actionIdx + 1))

  // Build changes object like key: [diffs]
  return new Map().withMutations(diff => {
    for (let [key, newValue] of getActionChanges(action, prevState).entrySeq()) {
      const valueDiff = diffEntry(key, prevState.get(key), newValue)
      diff.set(key, new List(valueDiff))
    }
  })
}

function getActionChanges(action, prevState) {
  if ([ACTION_DELETE, ACTION_REMOVE].includes(action.type))
    return prevState.map(() => null)
  else if (action.type === ACTION_RESTORE)
    return prevState
  return action.changes
}

function completeReference(reference, actions, keysToStore) {
  return reference.withMutations(reference => {
    // Let's look for the most recent entries
    for (let action of actions) {
      if (action.changes.size === 0)
        continue
      for (let [idx, key] of keysToStore.entries()) {
        if (!(action.changes.has(key)))
          continue
        // Yihaa ! Changes contains a value for key
        reference.set(key, action.changes.get(key))
        delete(keysToStore[idx])
        if (keysToStore.length === 0)
          return reference
      }
    }
    return reference
  })
}

function buildReferenceEntity(actions, base=null) {
  const entity = actions.first().entity
  if (entity === ENTITY_STATEMENT)
    return buildReferenceStatement(actions, base)
  else if (entity === ENTITY_SPEAKER)
    return buildReferenceSpeaker(actions, base)
}

function buildReferenceStatement(actions, base=null) {
  if (!base)
    base = new Map({ id: actions.last().entity_id })
  return completeReference(base, actions, ['text', 'time', 'speaker_id'])
}

function buildReferenceSpeaker(actions, base=null) {
  if (!base)
    base = new Map({ id: actions.first().entity_id })
  return completeReference(base, actions, ['full_name', 'title'])
}

function prepareAction(action) {
  action.time = parseDateTime(action.time)
  action.changes = new Map(action.changes)
  return UserAction(action)
}

function diffEntry(key, prevValue, newValue) {
  if (prevValue === newValue)
    return [{added: true, value: formatValue(key, newValue)}]

  // Format numbers like prevNumber -> newNumber
  if (typeof(newValue) === "number") {
    // Format time like 0:42 -> 1:35
    prevValue = formatValue(key, prevValue)
    newValue = formatValue(key, newValue)

    // Generate diff
    if (prevValue)
      return [{removed: true, value: prevValue}, {added: true, value: newValue}]
    else
      return [{added: true, value: newValue}]
  }
  // Do a string diff
  return diffWordsWithSpace((prevValue || "").toString(), newValue ? newValue.toString() : "")
}

function formatValue(key, value) {
  if (key === "time")
    return value ? formatSeconds(value) : ""
  return value
}

