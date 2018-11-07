import React from 'react'
import { Link } from 'react-router'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'
import XPBar from './sidebar/XPBar'
import V2Notifications from './sidebar/V2Notifications'

import Logo from '../../assets/logo.svg'
import User from '../../assets/V2/user.svg'

@withNamespaces('main')
export default class Sidebar extends React.PureComponent {
  render() {
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item logo" href="https://bulma.io">
            <img src={Logo} alt=""/>
            <span>Captain Fact</span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">

          <div className="navbar-end">
            <div className="navbar-item">
              <a href="#">VIDEOS</a>
              <a href="#">NOUS SUPPORTER</a>
              <a href="#">EXTENSION NAV</a>
              <XPBar value="220" />
              <V2Notifications count="2" />
              <a href="#">
                <img src={User} className="user" alt="" />
              </a>
            </div>
          </div>
        </div>
      </nav>
    )
  }
}
