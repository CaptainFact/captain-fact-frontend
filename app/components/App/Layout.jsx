import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { checkExtensionInstall } from '@/lib/browser-extension'
import { cn } from '@/lib/css-utils'

import { MainModalContainer } from '../Modal/MainModalContainer'
import { Toaster } from '../ui/toaster'
import PublicAchievementUnlocker from '../Users/PublicAchievementUnlocker'
import BackgroundNotifier from './BackgroundNotifier'
import CrashReportPage from './CrashReportPage'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

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

    return (
      <React.Fragment>
        <div lang={locale}>
          {this.renderMetadata()}
          <MainModalContainer />
          <Navbar />
          <Sidebar />
          <div
            className={cn(
              sidebarExpended ? 'sm:pl-[var(--sidebar-width)]' : 'pl-0',
              'transition-all',
            )}
          >
            {!this.state.error ? children : <CrashReportPage error={this.state.error} />}
          </div>
          <BackgroundNotifier />
          <PublicAchievementUnlocker achievementId={4} meetConditionsFunc={checkExtensionInstall} />
        </div>
        <Toaster />
      </React.Fragment>
    )
  }
}
