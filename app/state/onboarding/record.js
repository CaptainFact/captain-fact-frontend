import { Record } from 'immutable'

const OnboardingStep = new Record({
  uniqueId: -1,
  title: '',
  content: '',
  target: '',
  placement: 'auto'
})

export default OnboardingStep
