import React, { Component } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { Router, Route, browserHistory } from 'react-router'
import { I18nextProvider } from 'react-i18next'

import theme from '../app/styles/theme'
import i18n from '../app/i18n/i18n'
import store from '../app/state'

export default class ThemeWrapper extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <ReduxProvider store={store}>
          <I18nextProvider i18n={i18n}>
            <Router history={browserHistory}>
              <Route path="*" component={() => this.props.children} />
            </Router>
          </I18nextProvider>
        </ReduxProvider>
      </ThemeProvider>
    )
  }
}
