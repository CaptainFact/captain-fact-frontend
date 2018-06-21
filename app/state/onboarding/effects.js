import HttpApi from '../../API/http_api'
import { createEffect } from '../utils'
import {
  completeOnboardingStep,
  setOnboardingSteps,
  set as setUser
} from '../users/current_user/reducer'
import { NB_STEPS_ONBOARDING } from '../../constants'

export const stepSeen = (stepId) => createEffect(
  HttpApi.post('users/me/onboarding/complete_step', {step: stepId}), {
    before: completeOnboardingStep(stepId)
  }
)

export const resetOnboarding = () => createEffect(
  HttpApi.delete('users/me/onboarding'), {
    then: setOnboardingSteps
  }
)


export const tourSkipped = () => createEffect(
  HttpApi.post('users/me/onboarding/complete_steps', {
    steps: Array.from(Array(NB_STEPS_ONBOARDING).keys()).map(i => i + 1)
  }), {
    then: setUser
  }
)
