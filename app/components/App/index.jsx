import React from 'react'
import { connect } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { Helmet } from 'react-helmet'

import i18n from '../../i18n/i18n'
import { FlashMessages, checkExtensionInstall } from '../Utils'
import { fetchCurrentUser } from '../../state/users/current_user/effects'
import Sidebar from './Sidebar'
import { MainModalContainer } from '../Modal/MainModalContainer'
import PublicAchievementUnlocker from '../Users/PublicAchievementUnlocker'


@connect(state => ({locale: state.UserPreferences.locale}), {fetchCurrentUser})
export default class App extends React.PureComponent {
  componentDidMount() {
    this.props.fetchCurrentUser()
  }

  render() {
    return (
      <I18nextProvider i18n={i18n}>
        <div lang={this.props.locale}>
          <Helmet>
            <title>CaptainFact</title>
          </Helmet>
          <MainModalContainer/>
          <div className="columns is-mobile is-gapless">
            <Sidebar className="column is-narrow"/>
            <div id="main-container" className="column">
              {this.props.children}
            </div>
          </div>
          <FlashMessages/>
          <PublicAchievementUnlocker achievementId={4} meetConditionsFunc={checkExtensionInstall}/>
        </div>
      </I18nextProvider>
    )
  }
}
