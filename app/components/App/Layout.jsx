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

@connect((state) => ({
  locale: state.UserPreferences.locale,
  sidebarExpended: state.UserPreferences.sidebarExpended,
}))
export default class Layout extends React.PureComponent {
  state = { error: null }

  /** Called when app crashes */
  static getDerivedStateFromError(error) {
    return { error }
  }

  renderMetadata() {
    return (
      <Helmet>
        <title>CaptainFact</title>
        <meta property="og:title" content="CaptainFact.io" />
        <meta
          property="og:description"
          content="Collaborative, real-time fact checking. Free and open source."
        />
        <meta property="og:image" content="https://captainfact.io/assets/img/banner.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image" content="https://captainfact.io/assets/img/CaptainFact.png" />
        <meta property="og:image:width" content="100" />
        <meta property="og:image:height" content="100" />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="1502183533135523" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CaptainFact_io" />
        <meta name="twitter:image" content="https://captainfact.io/assets/img/banner_twitter.png" />
      </Helmet>
    )
  }

  render() {
    const { locale, sidebarExpended, children } = this.props
    const mainContainerClass = sidebarExpended ? undefined : 'expended'

    return (
      <div id="main-layout" lang={locale}>
        {this.renderMetadata()}
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
    return new Promise((fulfill) => {
      setTimeout(() => fulfill(!!document.getElementById('captainfact-extension-installed')), 5000)
    })
  }
}
