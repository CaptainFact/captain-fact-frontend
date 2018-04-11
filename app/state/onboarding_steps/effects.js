import HttpApi from '../../API/http_api'
import { createEffect } from '../utils'
import { completeOnboardingStep, skipTour } from '../users/current_user/reducer'

export const stepSeen = (stepId) => createEffect(
  HttpApi.post("/users/me/onboarding", {
    step: stepId
  }), {
    before: completeOnboardingStep(stepId)
  }
)

export const tourSkipped = () => createEffect(
  HttpApi.post("/users/me/onboarding_skip"), {
    before: skipTour()
  }
)
