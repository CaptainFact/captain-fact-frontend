import HttpApi from '../../API/http_api'
import { createEffect } from '../utils'
import {
  completeOnboardingStep,
  setOnboardingSteps,
  removeOnboardingStep
} from '../users/current_user/reducer'

export const stepSeen = (stepId) => createEffect(
  HttpApi.post('users/me/onboarding/complete_step', {
    step: stepId
  }), {
    before: completeOnboardingStep(stepId)
  }
)

export const stepUnseen = (stepId) => createEffect(
  HttpApi.post('users/me/onboarding/remove_step', {step: stepId}, {
    then: removeOnboardingStep(stepId)
  })
)

export const resetOnboarding = () => createEffect(
  HttpApi.delete('users/me/onboarding', {
    then: setOnboardingSteps
  })
)
