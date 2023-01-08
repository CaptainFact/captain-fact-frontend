import { Record, List } from 'immutable'
import { combineActions, createAction, handleActions } from 'redux-actions'
import { change, destroy } from 'redux-form'

import Statement from './record'
import { resetVideoDebate } from '../actions'
import { orderBy } from 'lodash'

export const fetchStatements = createAction('STATEMENTS/FETCH')
export const setLoading = createAction('STATEMENTS/SET_LOADING')
export const setSubmitting = createAction('STATEMENTS/SET_SUBMITTING')
export const add = createAction('STATEMENTS/ADD')
export const update = createAction('STATEMENTS/UPDATE')
export const updateAll = createAction('STATEMENTS/UPDATE_ALL')
export const remove = createAction('STATEMENTS/REMOVE')
export const setScrollTo = createAction('STATEMENTS/SET_SCROLL_TO')
export const incrementFormCount = createAction('STATEMENTS/INCREMENT_FORM_COUNT', () => 1)
export const decrementFormCount = createAction('STATEMENTS/DECREMENT_FORM_COUNT', () => -1)

// Statement form actions
export const STATEMENT_FORM_NAME = 'StatementForm'
export const changeStatementFormSpeaker = ({ id }) => change(STATEMENT_FORM_NAME, 'speaker_id', id)
export const closeStatementForm = () => destroy(STATEMENT_FORM_NAME)

const INITIAL_STATE = new Record({
  isLoading: false,
  isSubmitting: false,
  errors: null,
  data: new List(),
  scrollTo: null,
  formsCount: 0,
})

const StatementsReducer = handleActions(
  {
    [fetchStatements]: {
      next: (state, { payload }) =>
        state.merge({
          isLoading: false,
          data: new List(
            orderBy(
              payload.map((s) => new Statement(s)),
              ['time', 'id']
            )
          ),
        }),
      throw: (state, { payload }) => state.merge({ isLoading: false, errors: payload }),
    },
    [setLoading]: (state, isLoading) => state.set('isLoading', isLoading),
    [setSubmitting]: (state, { payload }) => state.set('isSubmitting', payload),
    [add]: (state, { payload }) => {
      const statementIdx = getInsertPosition(state.data, payload)
      const statement = new Statement(payload)
      return state.update('data', (statements) => statements.insert(statementIdx, statement))
    },
    [update]: (state, { payload }) => {
      const statementIdx = state.data.findIndex((s) => s.id === payload.id)
      if (statementIdx !== -1) {
        return state.update('data', (data) => {
          data = data.delete(statementIdx)
          const newStatementIdx = getInsertPosition(data, payload)
          return data.insert(newStatementIdx, new Statement(payload))
        })
      }
      return state
    },
    [updateAll]: (state, { payload }) => {
      return state.update('data', (data) =>
        data.withMutations((statements) => {
          // Update all statements
          for (const newStatement of payload) {
            const statementIdx = statements.findIndex((s) => s.id === newStatement.id)
            if (statementIdx !== -1) {
              statements.update(statementIdx, (oldStatement) => {
                return oldStatement.merge(newStatement)
              })
            }
          }
          // Re-sort them
          return statements.sortBy((st) => st.time)
        })
      )
    },
    [remove]: (state, { payload: { id } }) => {
      const statementIdx = state.data.findIndex((s) => s.id === id)
      if (statementIdx !== -1) {
        return state.update('data', (data) => data.delete(statementIdx))
      }
      return state
    },
    [setScrollTo]: (state, { payload }) => state.set('scrollTo', payload),
    [combineActions(incrementFormCount, decrementFormCount)]: (state, { payload }) =>
      state.set('formsCount', state.formsCount + payload),
    [resetVideoDebate]: () => INITIAL_STATE(),
  },
  INITIAL_STATE()
)

function getInsertPosition(data, newStatement) {
  const position = data.findIndex((st) => newStatement.time < st.time)
  return position !== -1 ? position : data.size
}

export default StatementsReducer
