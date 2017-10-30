import React from "react"
import { connect } from "react-redux"
import { I18nextProvider } from 'react-i18next'

import { default as Sidebar } from "./Sidebar"
import { FlashMessages } from "../Utils"
import { MainModalContainer } from "../Modal/MainModalContainer"
import i18n from '../../i18n'
import { authenticate } from '../../state/users/current_user/effects'


@connect(state => ({locale: state.UserPreferences.locale}), {authenticate})
export default class App extends React.PureComponent {
  componentDidMount() {
    this.props.authenticate()
  }

  render() {
    return (
      <I18nextProvider i18n={i18n}>
        <div lang={this.props.locale}>
          <MainModalContainer />
          <div className="columns is-mobile is-gapless">
            <Sidebar className="column is-narrow"/>
            <div id="main-container" className="column">
              {this.props.children}
            </div>
          </div>
          <FlashMessages/>
        </div>
      </I18nextProvider>
    )
  }
}
