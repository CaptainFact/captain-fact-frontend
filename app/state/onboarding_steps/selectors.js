export const uncompletedOnboardingSteps = state => 
  state.OnboardingSteps.steps
  // state.OnboardingSteps.steps.filter(s => !state.CurrentUser.data.onboarding_completed.includes(s.uniqueId))
