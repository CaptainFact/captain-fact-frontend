import React from 'react'
import { Link } from 'react-router'

import { withNamespaces } from 'react-i18next'
import XPBar from './XPBar'
import V2Notifications from './V2Notifications'

import Logo from '../../../assets/logo.svg'
import User from '../../../assets/V2/user.svg'

@withNamespaces('main')
export default class Sidebar extends React.PureComponent {
  render() {
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link className="navbar-item logo" to="/">
            <img src={Logo} alt="" />
            <span>Captain Fact</span>
          </Link>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-end">
            <div className="navbar-item">
              <Link to="/">VIDEOS</Link>
              <Link to="/">NOUS SUPPORTER</Link>
              <Link to="/">EXTENSION NAV</Link>
              <XPBar value="200" />
              <V2Notifications count="2" />
              <Link to="/">
                <img src={User} className="user" alt="" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }
}
