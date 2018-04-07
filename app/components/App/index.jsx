import React from "react"
import { connect } from "react-redux"
import { I18nextProvider } from 'react-i18next'
import Joyride from 'react-joyride'
import { Helmet } from 'react-helmet'

import i18n from '../../i18n/i18n'
import { FlashMessages } from "../Utils"
import { fetchCurrentUser } from '../../state/users/current_user/effects'
import { stepSeen } from '../../state/onboarding_steps/effects'
import { uncompletedOnboardingSteps } from '../../state/onboarding_steps/selectors'
import { default as Sidebar } from "./Sidebar"
import { MainModalContainer } from "../Modal/MainModalContainer"
import PublicAchievementUnlocker from '../Users/PublicAchievementUnlocker'

@connect(state => ({
  locale: state.UserPreferences.locale,
  onboardingSteps: uncompletedOnboardingSteps(state),
  lastAddedStep: state.OnboardingSteps.lastAddedStep
}), {
  fetchCurrentUser: fetchCurrentUser,
  stepSeen: stepSeen
})
export default class App extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      joyrideSteps: []
    }
    this.joyrideCallback = this.joyrideCallback.bind(this)
  }

  componentDidMount() {
    this.props.fetchCurrentUser()
  }

  componentDidUpdate(prevProps, prevState) {
    // if a new step is pushed, notify joyride instance
    if (prevProps.lastAddedStep != this.props.lastAddedStep) {
      this.setState(currentState => {
        currentState.joyrideSteps = currentState.joyrideSteps.concat([this.props.lastAddedStep.toJS()])
      })
      this.forceUpdate()
    }
  }

  render() {
    const { joyrideSteps } = this.state
    console.log("in render : joyridesteps", joyrideSteps)

    return (
      <I18nextProvider i18n={i18n}>   
        <div lang={this.props.locale}>
          <Helmet>
            <title>CaptainFact</title>
          </Helmet>
          <MainModalContainer/>
          <Joyride
            ref={c => (this.joyride = c)}
            type="single"
            steps={joyrideSteps}
            run={true}
            callback={this.joyrideCallback}
          />
          <div className="columns is-mobile is-gapless">
            <Sidebar className="column is-narrow"/>
            <div id="main-container" className="column">
              {this.props.children}
            </div>
          </div>
          <FlashMessages/>
          <PublicAchievementUnlocker achievementId={4} meetConditionsFunc={this.checkExtensionInstall}/>
        </div>
      </I18nextProvider>
    )
  }

  joyrideCallback(data) {
    // step:after = after each step
    if (data.action === 'close' && data.type === 'step:after') {
      this.props.stepSeen(data.step.uniqueId)
    }
    // finished = all steps complete
  }

  /**
   * Extension content scripts load after CaptainFact. We could have created a message
   * interface to communicate between the two but as our need is very basic for now
   * (detecting if extension is installed) we wait 5 seconds and check.
   * @returns {Promise}
   */
  checkExtensionInstall() {
    return new Promise(fulfill => {
      setTimeout(() => fulfill(!!document.getElementById('captainfact-extension-installed')), 5000)
    })
  }
}
