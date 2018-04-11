import { Record } from "immutable"
import { createAction, handleActions } from 'redux-actions'

import User from "../record"

// Actions
export const set = createAction('CURRENT_USER/SET')
export const userLogin = createAction('CURRENT_USER/LOGIN')
export const setLoading = createAction('CURRENT_USER/SET_LOADING')
export const setPosting = createAction('CURRENT_USER/SET_POSTING')
export const reset = createAction('CURRENT_USER/RESET')
export const completeOnboardingStep = createAction('CURRENT_USER/COMPLETE_ONBOARDING_STEP')
export const skipTour = createAction('CURRENT_USER/SKIP_TOUR')

// Reducer

const INITIAL_STATE = new Record({
  error: null,
  isLoading: false,
  isPosting: false,
  data: new User()
})

const CurrentUserReducer = handleActions({
  [set]: {
    next: (state, {payload}) => {
      return state.merge({data: new User(payload) || {}, error: null, isLoading: false})
    },
    throw: (state, {payload}) => {
      return state.merge({error: payload, isLoading: false})
    }
  },
  [userLogin]: {
    next: (state, {payload}) => {
      return state.mergeDeep({data: payload || {}, error: null, isPosting: false})
    },
    throw: (state, {payload}) => {
      return state.merge({error: payload, isPosting: false})
    }
  },
  [setLoading]: (state, {payload}) => state.set('isLoading', payload),
  [setPosting]: (state, {payload}) => state.set('isPosting', payload),
  [completeOnboardingStep]: (state, {payload}) => state.updateIn(['data', 'onboarding_completed'], completedSteps => completedSteps.push(payload)),
  [skipTour]: (state, {payload}) => state.updateIn(['data', 'onboarding_skipped'], onboarding_skipped => true),
  [reset]: () => INITIAL_STATE()
}, INITIAL_STATE())

export default CurrentUserReducer