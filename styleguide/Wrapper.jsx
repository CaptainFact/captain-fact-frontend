import React, { Component, Fragment } from 'react'
import { ThemeProvider } from 'styled-components'

import theme from '../app/styles/theme'

export default class ThemeWrapper extends Component {
  render() {
    return (
      <Fragment>
        <ThemeProvider theme={theme}>{this.props.children}</ThemeProvider>
      </Fragment>
    )
  }
}
