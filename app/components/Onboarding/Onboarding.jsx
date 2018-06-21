import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import Joyride from 'react-joyride'

import { isAuthenticated } from '../../state/users/current_user/selectors'
import { uncompletedOnboardingSteps } from '../../state/onboarding/selectors'
import { stepSeen, tourSkipped } from '../../state/onboarding/effects'


const JOYRIDE_STYLE = {
  beacon: {
    cursor: 'pointer'
  }
}

@connect(state => ({
  onboardingSteps: uncompletedOnboardingSteps(state),
  isAuthenticated: isAuthenticated(state),
  isCompleted: state.CurrentUser.completedOnboarding
}), {
  stepSeen,
  tourSkipped
})
@translate('onboarding')
export default class Onboarding extends React.PureComponent {
  render() {
    console.log(this.props.isAuthenticated, !this.props.isCompleted, this.joyrideSteps())
    if (!this.props.isAuthenticated || this.props.isCompleted)
      return null

    return (
      <Joyride
        ref={c => {this.joyride = c}}
        steps={this.joyrideSteps()}
        locale={this.props.t('joyride', {returnObjects: true})}
        callback={d => this.joyrideCallback(d)}
        styles={JOYRIDE_STYLE}
        showSkipButton
        hideBackButton
        debug
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
    const step = this.props.onboardingSteps.first()
    return step ? [step.toJS()] : []
  }

  /**
   * Called by `react-joyride` when a step is completed.
   * After each step, POST completed_steps (or remove step if backward)
   *
   * @param {*} data
   */
  joyrideCallback(data) {
    if (data.action === 'close')
      this.props.stepSeen(this.props.onboardingSteps.first().uniqueId)
    else if (data.action === 'skip' && data.status === 'skipped')
      this.props.tourSkipped()
  }
}
