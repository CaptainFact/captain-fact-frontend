import { Record } from 'immutable'

const OnboardingStep = new Record({
  uniqueId: 0,
  title: '',
  text: '',
  selector: '',
  position: '',
  style: null
})

export default OnboardingStep
