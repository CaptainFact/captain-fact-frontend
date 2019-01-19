import React from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import Navbar from './Navbar'

/**
 * A basic layout without Sidebar.
 */
class SimpleLayout extends React.PureComponent {
  render() {
    const { locale, children } = this.props

    return (
      <div lang={locale}>
        <Helmet>
          <title>CaptainFact</title>
        </Helmet>
        <Navbar hasMenuToggle={false} />
        {children}
      </div>
    )
  }
}

export default connect(state => ({
  locale: state.UserPreferences.locale,
  sidebarExpended: state.UserPreferences.sidebarExpended
}))(SimpleLayout)
