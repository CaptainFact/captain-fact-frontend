import { Record, List, Map } from 'immutable'
import { createAction, handleActions } from 'redux-actions'

import OnboardingStep from './record'

export const addStep = createAction('ONBOARDING/ADD_STEP')
export const removeStep = createAction('ONBOARDING/REMOVE_STEP_BY_NAME')
export const disable = createAction('ONBOARDING/DISABLE')
export const enable = createAction('ONBOARDING/ENABLE')

const INITIAL_STATE = new Record({
  steps: new List()
})

const OnboardingStepsReducer = handleActions({
  [addStep]: (state, {payload}) => {
    const step = OnboardingStep(payload)
    const steps = (state.steps.findIndex(s => s.uniqueId === step.uniqueId) === -1) ? state.steps.insert(state.steps.length, step) : state.steps
    return state.set('steps', steps)
  }
}, INITIAL_STATE())

export default OnboardingStepsReducer
