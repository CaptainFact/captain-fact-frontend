import { Record, List, Map } from 'immutable'

import OnboardingStep from './record'

export const addStep = createAction('ONBOARDING/ADD_STEP')
export const removeStep = createAction('ONBOARDING/REMOVE_STEP_BY_NAME')
export const disable = createAction('ONBOARDING/DISABLE')
export const enable = createAction('ONBOARDING/ENABLE')

const INITIAL_STATE = new Record({
  steps: new List(),
  showOnboarding: false
})

const OnboardingStepsReducer = handleActions({
  [disable]: (state, {payload}) => state.set('showOnboarding', false),
  [enable]: (state, {payload}) => state.set('showOnboarding', true),
  [addStep]: (state, {payload}) => {
    const step = OnboardingStep(payload)
    const steps = state.steps.insert(state.steps.length, step)
    return state.set('steps', steps)
  },
  [removeStep]: (state, {payload}) => state.set('showOnboarding', true)
})