import { Record } from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import User from '../record'
import { NB_STEPS_ONBOARDING } from '../../../constants'

// Actions
export const set = createAction('CURRENT_USER/SET')
export const userLogin = createAction('CURRENT_USER/LOGIN')
export const setLoading = createAction('CURRENT_USER/SET_LOADING')
export const setPosting = createAction('CURRENT_USER/SET_POSTING')
export const reset = createAction('CURRENT_USER/RESET')
export const completeOnboardingStep = createAction('CURRENT_USER/COMPLETE_ONBOARDING_STEP')

// Initial reducer state
const INITIAL_STATE = new Record({
  error: null,
  isLoading: false,
  isPosting: false,
  completedOnboarding: false,
  data: new User()
})

// Utils
function isOnboardingCompleted({completed_onboarding_steps: completed}) {
  return completed && completed.length >= NB_STEPS_ONBOARDING
}

function updateOnboardingSteps(state, updateFunc) {
  const ONBOARDING_PATH = ['data', 'completed_onboarding_steps']
  const updatedUser = state.updateIn(ONBOARDING_PATH, updateFunc)
  const onboardingCompleted = isOnboardingCompleted(updatedUser)
  return updatedUser.set('completedOnboarding', onboardingCompleted)
}

// Reducer
const CurrentUserReducer = handleActions({
  [set]: {
    next: (state, {payload}) => {
      const user = new User(payload)
      const completedOnboarding = isOnboardingCompleted(user)

      return state.mergeDeep({
        data: user,
        error: null,
        isLoading: false,
        completedOnboarding
      })
    },
    throw: (state, {payload}) =>
      state.merge({error: payload, isLoading: false})
  },
  [userLogin]: {
    next: (state, {payload}) =>
      state.mergeDeep({data: payload || {}, error: null, isPosting: false}),
    throw: (state, {payload}) =>
      state.merge({error: payload, isPosting: false})
  },
  [setLoading]: (state, {payload}) =>
    state.set('isLoading', payload),
  [setPosting]: (state, {payload}) =>
    state.set('isPosting', payload),
  [completeOnboardingStep]: (state, {payload}) =>
    updateOnboardingSteps(state, steps => steps.add(payload)),
  [reset]: () =>
    INITIAL_STATE()
}, INITIAL_STATE())

export default CurrentUserReducer
