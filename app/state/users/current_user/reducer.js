import { Record, Set } from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import User from '../record'

// Actions
export const set = createAction('CURRENT_USER/SET')
export const userLogin = createAction('CURRENT_USER/LOGIN')
export const setLoading = createAction('CURRENT_USER/SET_LOADING')
export const setPosting = createAction('CURRENT_USER/SET_POSTING')
export const reset = createAction('CURRENT_USER/RESET')
export const completeOnboardingStep = createAction('CURRENT_USER/COMPLETE_ONBOARDING_STEP')
export const removeOnboardingStep = createAction('CURRENT_USER/REMOVE_ONBOARDING_STEP')
export const setOnboardingSteps = createAction('CURRENT_USER/SKIP_TOUR')

// Initial reducer state
const INITIAL_STATE = new Record({
  error: null,
  isLoading: false,
  isPosting: false,
  data: new User()
})

// Reducer
const CurrentUserReducer = handleActions({
  [set]: {
    next: (state, {payload}) => (
      state.mergeDeep({
        data: new User(payload),
        error: null,
        isLoading: false
      })
    ),
    throw: (state, {payload}) =>
      state.merge({error: payload, isLoading: false})
  },
  [userLogin]: {
    next: (state, {payload}) => {
      return state.mergeDeep({data: payload || {}, error: null, isPosting: false})
    },
    throw: (state, {payload}) => {
      return state.merge({error: payload, isPosting: false})
    }
  },
  [setLoading]: (state, {payload}) =>
    state.set('isLoading', payload),
  [setPosting]: (state, {payload}) =>
    state.set('isPosting', payload),
  [completeOnboardingStep]: (state, {payload}) =>
    state.updateIn(['data', 'completed_onboarding_steps'], completedSteps =>
      completedSteps.add(payload)
    ),
  [setOnboardingSteps]: (state, {payload}) =>
    state.setIn(['data', 'completed_onboarding_steps'], new Set(payload)),
  [removeOnboardingStep]: (state, {payload}) =>
    state.updateIn(['data', 'completed_onboarding_steps'], s => s.delete(payload)),
  [reset]: () =>
    INITIAL_STATE()
}, INITIAL_STATE())

export default CurrentUserReducer
