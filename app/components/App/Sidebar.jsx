import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import capitalize from 'voca/capitalize'
import { Icon } from '../Utils'
import { MOBILE_WIDTH_THRESHOLD, USER_PICTURE_SMALL, MIN_REPUTATION_MODERATION } from '../../constants'
import { LoadingFrame } from '../Utils/LoadingFrame'
import RawIcon from '../Utils/RawIcon'
import ReputationGuard from '../Utils/ReputationGuard'
import LanguageSelector from './LanguageSelector'
import ScoreTag from '../Users/ScoreTag'
import { logout } from '../../state/users/current_user/effects'
import { closeSidebar, toggleSidebar } from '../../state/user_preferences/reducer'
import UserPicture from '../Users/UserPicture'
import i18n from '../../i18n/i18n'
import Logo from './Logo'
import Button from '../Utils/Button'

@connect(state => ({
  CurrentUser: state.CurrentUser.data,
  isLoadingUser: state.CurrentUser.isLoading,
  sidebarExpended: state.UserPreferences.sidebarExpended
}), {logout, toggleSidebar, closeSidebar})
@translate('main')
export default class Sidebar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.MenuListLink = this.MenuListLink.bind(this)
    this.MenuLink = this.MenuLink.bind(this)
    this.closeSideBarIfMobile = this.closeSideBarIfMobile.bind(this)
  }

  closeSideBarIfMobile() {
    if (window.innerWidth <= MOBILE_WIDTH_THRESHOLD)
      this.props.closeSidebar()
  }

  MenuLink({iconName, className, children, ...props}) {
    const classes = classNames(className, {'link-with-icon': !!iconName})
    return (
      <Link className={classes} activeClassName="is-active" onClick={this.closeSideBarIfMobile} {...props}>
        {iconName && <RawIcon name={iconName}/>}
        <span>{children}</span>
      </Link>
    )
  }

  MenuListLink(props) {
    return <li>{this.MenuLink(props)}</li>
  }

  renderUserLinks() {
    const { CurrentUser: {username, reputation}, t } = this.props
    const baseLink = `/u/${username}`
    return (
      <div className="user-section">
        <nav className="level user-quicklinks is-mobile">
          <div className="level-left menu-list">
            <this.MenuLink to={baseLink} className="my-profile-link" onlyActiveOnIndex>
              <div className="current-user-link">
                <UserPicture size={USER_PICTURE_SMALL} user={this.props.CurrentUser}/>
                <span className="username" style={{fontSize: this.usernameFontSize()}}>
                  { username }
                </span>
                <ScoreTag reputation={reputation}/>
              </div>
            </this.MenuLink>
          </div>
          <div className="level-right">
            <Button
              title={this.props.t('menu.logout')}
              onClick={() => this.props.logout()}
            >
              <Icon name="sign-out"/>
            </Button>
          </div>
        </nav>
        <ul className="menu-list user-links">
          <this.MenuListLink to={`${baseLink}/activity`} iconName="tasks">
            { t('menu.myActivity') }
          </this.MenuListLink>
          <this.MenuListLink to={`${baseLink}/settings`} iconName="cog">
            { t('menu.settings')}
          </this.MenuListLink>
        </ul>
      </div>)
  }

  renderConnectLinks() {
    return (
      <div className="connect-register-buttons">
        <Link to="/login" className="button" title="Login / Singup" onClick={this.closeSideBarIfMobile}>
          <Icon size="small" name="sign-in"/>
          <span>{ this.props.t('menu.loginSignup') }</span>
        </Link>
      </div>
    )
  }

  renderUserSection() {
    if (this.props.isLoadingUser)
      return (<div className="user-section"><LoadingFrame size="mini"/></div>)
    if (this.props.CurrentUser.id !== 0)
      return this.renderUserLinks()
    return this.renderConnectLinks()
  }

  render() {
    const { sidebarExpended, className, t } = this.props
    return (
      <aside
        id="sidebar"
        className={`menu ${className} ${sidebarExpended ? 'expended' : ''}`}
      >
        <div className="logo-banner">
          <div className="menu-collapse-button" onClick={() => this.props.toggleSidebar()}>
            <RawIcon name="bars"/>
          </div>
          <Link to="/">
            <Logo borderless/>
          </Link>
        </div>

        <div className="menu-content">
          { this.renderUserSection() }
          <p className="menu-label">{ t('menu.content') }</p>
          {this.renderMenuContent()}
          <p className="menu-label hide-when-collapsed">{ t('menu.language') }</p>
          <LanguageSelector
            className="hide-when-collapsed"
            handleChange={v => i18n.changeLanguage(v)}
            value={i18n.language}
            size="small"
            withIcon
          />

          <p className="menu-label">{ t('menu.other') }</p>
          <ul className="menu-list">
            <li>
              <a
                href="https://opencollective.com/captainfact_io"
                target="_blank"
                rel="noopener noreferrer"
                className="hide-when-collapsed link-with-icon"
              >
                <RawIcon name="heart"/>
                { t('menu.donation') }
              </a>
            </li>
            <this.MenuListLink to="/extension" iconName="puzzle-piece" className="hide-when-collapsed">
              { t('menu.extension') }
            </this.MenuListLink>
            <this.MenuListLink to="/help" iconName="question-circle">
              { t('menu.help') }
            </this.MenuListLink>
          </ul>
        </div>
      </aside>
    )
  }

  renderMenuContent() {
    const t = this.props.t
    return (
      <ul className="menu-list">
        <this.MenuListLink to="/videos" iconName="television" onlyActiveOnIndex>
          { capitalize(t('entities.video_plural')) }
        </this.MenuListLink>
        <ReputationGuard requiredRep={MIN_REPUTATION_MODERATION}>
          <this.MenuListLink to="/moderation" iconName="flag" className="hide-when-collapsed">
            { t('menu.moderation') }
          </this.MenuListLink>
        </ReputationGuard>
      </ul>
    )
  }

  usernameFontSize() {
    return `${1.4 - (this.props.CurrentUser.username.length / 40)}em`
  }
}
