import React, { PureComponent } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/i18n'


class Layout extends PureComponent {
  componentDidMount() {
    this.props.componentDidMount()
  }

  render() {
    const { children, locale } = this.props

    return <I18nextProvider i18n={i18n}>
      <main lang={locale}>
        {children}
      </main>
    </I18nextProvider>
  }
}

export default Layout