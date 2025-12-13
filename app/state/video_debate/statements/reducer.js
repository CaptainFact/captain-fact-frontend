import { List, Record } from 'immutable'
import { isUndefined, omitBy } from 'lodash'
import { combineActions, createAction, handleActions } from 'redux-actions'
import { change } from 'redux-form'

import { resetVideoDebate } from '../actions'

export const setScrollTo = createAction('STATEMENTS/SET_SCROLL_TO')
const incrementFormCount = createAction('STATEMENTS/INCREMENT_FORM_COUNT', () => 1)
const decrementFormCount = createAction('STATEMENTS/DECREMENT_FORM_COUNT', () => -1)

// Statement form actions
export const STATEMENT_FORM_NAME = 'StatementForm'
export const changeStatementFormSpeaker = ({ id }) => change(STATEMENT_FORM_NAME, 'speaker_id', id)
export const changeStatementForm = (values) => {
  return (dispatch) => {
    Object.entries(omitBy(values, isUndefined)).forEach(([key, value]) =>
      dispatch(change(STATEMENT_FORM_NAME, key, value)),
    )
  }
}

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
    [setScrollTo]: (state, { payload }) => state.set('scrollTo', payload),
    [combineActions(incrementFormCount, decrementFormCount)]: (state, { payload }) =>
      state.set('formsCount', state.formsCount + payload),
    [resetVideoDebate]: () => INITIAL_STATE(),
  },
  INITIAL_STATE(),
)

export default StatementsReducer
