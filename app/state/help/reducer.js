import { Record } from 'immutable'
import { createAction, handleActions } from 'redux-actions'


export const setLoading = createAction('HELP/SET_LOADING')
export const reset = createAction('HELP/RESET')
export const setContent = createAction('HELP/SET_HELP_PAGE')

const INITIAL_STATE = new Record({
  markdownContent: '',
  isLoading: false,
  error: null
})

const HelpReducer = handleActions({
  [setContent]: {
    next: (state, {payload}) => state.merge({
      markdownContent: payload,
      isLoading: false
    }),
    throw: (state, {payload}) => state.merge({error: payload, isLoading: false})
  },
  [setLoading]: (state, {payload}) => state.set('isLoading', payload),
  [reset]: () => INITIAL_STATE()
}, INITIAL_STATE())

export default HelpReducer
