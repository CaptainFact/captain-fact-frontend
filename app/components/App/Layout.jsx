import React from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { FlashMessages } from '../Utils'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { MainModalContainer } from '../Modal/MainModalContainer'
import PublicAchievementUnlocker from '../Users/PublicAchievementUnlocker'
import BackgroundNotifier from './BackgroundNotifier'
import CrashReportPage from './CrashReportPage'

@connect(state => ({
  locale: state.UserPreferences.locale,
  sidebarExpended: state.UserPreferences.sidebarExpended
}))
export default class Layout extends React.PureComponent {
  state = { error: null }

  /** Called when app crashes */
  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    const { locale, sidebarExpended, children } = this.props
    const mainContainerClass = sidebarExpended ? undefined : 'expended'

    return (
      <div id="main-layout" lang={locale}>
        <Helmet>
          <title>CaptainFact</title>
        </Helmet>
        <MainModalContainer />
        <FlashMessages />
        <Navbar />
        <Sidebar />
        <div id="main-container" className={mainContainerClass}>
          {!this.state.error ? children : <CrashReportPage error={this.state.error} />}
        </div>
        <BackgroundNotifier />
        <PublicAchievementUnlocker
          achievementId={4}
          meetConditionsFunc={this.checkExtensionInstall}
        />
      </div>
    )
  }

  /**
   * Extension content scripts load after CaptainFact. We could have created a message
   * interface to communicate between the two but as our need is very basic for now
   * (detecting if extension is installed) we wait 5 seconds and check.
   * @returns {Promise}
   */
  checkExtensionInstall() {
    return new Promise(fulfill => {
      setTimeout(
        () => fulfill(!!document.getElementById('captainfact-extension-installed')),
        5000
      )
    })
  }
}
