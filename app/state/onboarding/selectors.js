export const uncompletedOnboardingSteps = state =>
  state.Onboarding.steps.filter((_, id) =>
    !state.CurrentUser.data.completed_onboarding_steps.includes(id)
  )
