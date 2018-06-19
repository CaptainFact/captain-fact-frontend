import { Record, Map } from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import OnboardingStep from './record'

export const addStep = createAction('ONBOARDING/ADD_STEP')
export const removeStep = createAction('ONBOARDING/REMOVE_STEP_BY_NAME')
export const disable = createAction('ONBOARDING/DISABLE')
export const enable = createAction('ONBOARDING/ENABLE')

const INITIAL_STATE = new Record({
  steps: new Map()
})

const OnboardingReducer = handleActions({
  [addStep]: (state, {payload: step}) => {
    return state.steps.has(step.uniqueId) ?
      state :
      state.update('steps', steps => steps.set(step.uniqueId, OnboardingStep(step)))
  }
}, INITIAL_STATE())

export default OnboardingReducer
