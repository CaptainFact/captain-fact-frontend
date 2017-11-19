import { Record, List, Map } from 'immutable'
import { createAction, handleActions, combineActions } from 'redux-actions'
import { diffWordsWithSpace } from 'diff'

import parseDateTime from '../../lib/parseDateTime'
import formatSeconds from "../../lib/seconds_formatter"
import UserAction from "./record"
import Statement from '../video_debate/statements/record'
import Speaker from '../speakers/record'
import {ENTITY_SPEAKER, ENTITY_STATEMENT} from '../../constants'
import { resetVideoDebate } from '../video_debate/actions'

export const setLoading = createAction('VIDEO_DEBATE_HISTORY/SET_LOADING')
export const reset = createAction('VIDEO_DEBATE_HISTORY/RESET')
export const fetchAll = createAction('VIDEO_DEBATE_HISTORY/FETCH')
export const addAction = createAction('VIDEO_DEBATE_HISTORY/ADD_ACTION')
export const generateDiff = createAction('VIDEO_DEBATE_HISTORY/GENERATE_DIFF')

const INITIAL_STATE = new Record({
  entitiesActions: new Map(),
  referenceEntities: new Map(),
  diffs: new Map(),
  isLoading: false,
  errors: null
})

const UsersActionsReducer = handleActions({
  [setLoading]: (state, {payload}) => state.set('isLoading', payload),
  [fetchAll]: {
    next: (state, {payload: {actions}}) => {
      const preparedActions = new List(actions.map(a => prepareAction(a)))
      const entitiesActions = preparedActions
        .sortBy(a => -a.time)
        .groupBy(a => entityKeyFromAction(a))
        .sortBy(actions => -actions.first().time)

      return state.merge({
        entitiesActions: entitiesActions,
        referenceEntities: buildReferenceEntities(entitiesActions),
        isLoading: false,
        errors: null
      })
    },
    throw: (state, {payload}) => state.merge({isLoading: false, errors: payload})
  },
  [addAction]: (state, {payload}) => {
    // /!\ Assumes that action is more recent than any other action previously stored
    const action = prepareAction(payload)
    const entityKey = entityKeyFromAction(action)
    return state.withMutations(state =>
      state
        .update('entitiesActions', e => e.withMutations(entitiesActions =>
          entitiesActions
            .update(entityKey, actions => actions.insert(0, action))
            .sortBy(actions => -actions.first().time)
        ))
        .updateIn(['referenceEntities', entityKey], reference =>
          buildReferenceEntity(new List([action]), reference)
        )
    )
  },
  [generateDiff]: (state, {payload}) => {
    // If diff already exists, do nothing
    if (state.diffs.has(payload.id))
      return state

    const entityActions = state.entitiesActions.get(`${payload.entity}:${payload.entity_id}`)
    const actionIdx = entityActions.findIndex(a => a.id === payload.id)
    // Get previous state
    let prevState = new Map()
    if (actionIdx + 1 < entityActions.size) {
      prevState = buildReferenceEntity(entityActions.slice(actionIdx + 1))
    }
    // Build changes object like key: [diffs]
    const diff = new Map().withMutations(diff => {
      for (let [key, newValue] of payload.changes.entrySeq()) {
        const valueDiff = diffEntry(key, prevState.get(key), newValue)
        diff.set(key, new List(valueDiff))
      }
    })
    return state.setIn(['diffs', payload.id], diff)
  },
  [combineActions(reset, resetVideoDebate)]: () => INITIAL_STATE()
}, INITIAL_STATE())
export default UsersActionsReducer


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

function buildReferenceStatement(actions, base=null) {
  if (!base)
    base = new Statement({ id: actions.last().entity_id, })
  return completeReference(base, actions, ['text', 'time', 'speaker_id'])
}

function buildReferenceSpeaker(actions, base=null) {
  if (!base)
    base = new Speaker({ id: actions.first().entity_id })
  return completeReference(base, actions, ['full_name', 'title'])
}

function buildReferenceEntity(actions, base=null) {
  const entity = actions.first().entity
  if (entity === ENTITY_STATEMENT)
    return buildReferenceStatement(actions, base)
  else if (entity === ENTITY_SPEAKER)
    return buildReferenceSpeaker(actions, base)
}

function buildReferenceEntities(entitiesActions) {
  return new Map().withMutations(references => {
    for (let [entity_key, actions] of entitiesActions.entrySeq()) {
      references.set(entity_key, buildReferenceEntity(actions))
    }
    return references
  })
}

function prepareAction(action) {
  action.time = parseDateTime(action.time)
  action.changes = new Map(action.changes)
  return UserAction(action)
}

function diffEntry(key, prevValue, newValue) {
  // Format numbers like prevNumber -> newNumber
  if (typeof(newValue) === "number") {
    // Format time like 0:42 -> 1:35
    if (key === "time") {
      prevValue = prevValue ? formatSeconds(prevValue) : ""
      newValue = formatSeconds(newValue)
    }
    // Generate diff
    if (prevValue)
      return [
        {removed: true, value: prevValue},
        {added: true, value: newValue}
      ]
    else
      return [{added: true, value: newValue}]
  }
  // Do a string diff
  return diffWordsWithSpace((prevValue || "").toString(), newValue ? newValue.toString() : "")
}

export function entityKeyFromAction(action) {
  return `${action.entity}:${action.entity_id}`
}


