import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import Joyride from 'react-joyride'

import { isAuthenticated } from '../../state/users/current_user/selectors'
import { uncompletedOnboardingSteps } from '../../state/onboarding/selectors'
import { stepSeen, stepUnseen, tourSkipped } from '../../state/onboarding/effects'


const JOYRIDE_STYLE = {
  beacon: {
    cursor: 'pointer'
  }
}

@connect(state => ({
  onboardingSteps: uncompletedOnboardingSteps(state),
  isAuthenticated: isAuthenticated(state)
}), {
  stepSeen,
  tourSkipped,
  stepUnseen
})
@translate('onboarding')
export default class OnBoarding extends React.PureComponent {
  render() {
    return (
      <Joyride
        ref={c => {this.joyride = c}}
        steps={this.joyrideSteps()}
        locale={this.props.t('joyride', {returnObjects: true})}
        run={this.props.isAuthenticated}
        callback={d => this.joyrideCallback(d)}
        styles={JOYRIDE_STYLE}
        showSkipButton
        continuous
      />
    )
  }

  /**
   * Implement `componentDidCatch` to avoid crashing the whole app if there's
   * a problem in `react-joyride`
   *
   * @param {*} error
   * @param {*} info
   */
  componentDidCatch(error, info) {
    console.error(error)
    console.log(info)
  }

  /**
   * Map onboarding steps from state to an array of step as demanded by
   * `react-joyride`
   */
  joyrideSteps() {
    return Array
      .from(this.props.onboardingSteps.values())
      .map(v => v.toJS())
  }

  /**
   * Called by `react-joyride` when a step is completed.
   * After each step, POST completed_steps (or remove step if backward)
   *
   * @param {*} data
   */
  joyrideCallback(data) {
    console.log(`[OnBoarding] Action: ${data.action} | Lifecycle: ${data.lifecycle} | Step unique id: ${data.step.uniqueId}`)
    if (this.shouldComplete(data))
      this.props.stepSeen(data.step.uniqueId)
    else if (this.shouldReverse(data))
      this.props.stepUnseen(data.step.uniqueId)
    else if (data.type === 'finished' && data.isTourSkipped)
      this.props.tourSkipped()
  }

  shouldComplete({lifecycle, action}) {
    return (action === 'next' && lifecycle === 'complete')
  }

  shouldReverse({action}) {
    return (action === 'prev')
  }
}
