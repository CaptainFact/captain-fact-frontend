import React from "react"
import { connect } from "react-redux"
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import { Icon } from "../Utils"
import {
  MOBILE_WIDTH_THRESHOLD,
  USER_PICTURE_SMALL,
  MODERATION_REPUTATION_REQUIRED
} from "../../constants"
import { LoadingFrame } from '../Utils/LoadingFrame'
import LanguageSelector from './LanguageSelector'
import capitalize from 'voca/capitalize'
import ScoreTag from '../Users/ScoreTag'
import { logout } from '../../state/users/current_user/effects'
import { hasReputation } from '../../state/users/current_user/selectors'
import { closeSidebar, toggleSidebar } from '../../state/user_preferences/reducer'
import UserPicture from '../Users/UserPicture'
import i18n from '../../i18n/i18n'
import Logo from './Logo'

@connect(state => ({
  CurrentUser: state.CurrentUser.data,
  isLoadingUser: state.CurrentUser.isLoading,
  canAccessModeration: hasReputation(state, MODERATION_REPUTATION_REQUIRED),
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
      <Link className={classes} activeClassName='is-active' onClick={this.closeSideBarIfMobile} {...props}>
        {iconName && <Icon name={iconName} withContainer={false}/>}
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
        <nav className="level user-quicklinks">
          <div className="level-left menu-list">
            <this.MenuLink to={baseLink} className="my-profile-link" onlyActiveOnIndex={true}>
              <div className="current-user-link">
                <UserPicture size={USER_PICTURE_SMALL} user={this.props.CurrentUser}/>
                <h4 className="title is-4" style={{fontSize: this.usernameFontSize()}}>
                  { username }
                </h4>
                <ScoreTag reputation={reputation}/>
              </div>
            </this.MenuLink>
          </div>
          <div className="level-right">
            <a className="button" onClick={() => this.props.logout()}>Logout</a>
          </div>
        </nav>
        <ul className="menu-list user-links">
          <this.MenuListLink to={`${baseLink}/settings`} iconName="cog" children={t('menu.settings')}/>
          <this.MenuListLink to={`${username}/bookmarks`} iconName="bookmark" className="is-disabled">
            { t('menu.myBookmarks') }
          </this.MenuListLink>
          <this.MenuListLink to={`${baseLink}/activity`} iconName="tasks" className="is-disabled">
            { t('menu.myActivity') }
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
    else if (this.props.CurrentUser.id !== 0)
      return this.renderUserLinks();
    else
      return this.renderConnectLinks();
  }

  render() {
    const { sidebarExpended, className, t } = this.props
    return (
      <aside id="sidebar"
        className={`menu ${className} ${sidebarExpended ? 'expended' : ''}`}>
        <div className="logo-banner">
          <div className="menu-collapse-button" onClick={() => this.props.toggleSidebar()}>
            <Icon name="bars" withContainer={false}/>
          </div>
          <Link to="/"><Logo/></Link>
        </div>

        <div className="menu-content">
          { this.renderUserSection() }
          <p className="menu-label">{ t('menu.content') }</p>
          <ul className="menu-list">
            <this.MenuListLink to="/videos" iconName="television" onlyActiveOnIndex={true}>
              { capitalize(t('entities.video_plural')) }
            </this.MenuListLink>
            <this.MenuListLink to="/speakers" iconName="users" className="is-disabled">
              { capitalize(t('entities.speaker_plural')) }
            </this.MenuListLink>
          </ul>

          <p className="menu-label hide-when-collapsed">{ t('menu.language') }</p>
          <LanguageSelector className="hide-when-collapsed"
                            handleChange={v => i18n.changeLanguage(v)}
                            value={i18n.language}
                            size="small" withIcon={true}/>

          <p className="menu-label">{ t('menu.other') }</p>
          <ul className="menu-list">
            {this.props.canAccessModeration ? <this.MenuListLink to="/moderation" iconName="flag" className="hide-when-collapsed">
              { t('menu.moderation') }
            </this.MenuListLink> : ''}
            <this.MenuListLink to="/help/contact" iconName="envelope" className="hide-when-collapsed">
              { t('menu.contact') }
            </this.MenuListLink>
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

  usernameFontSize() {
    return `${1.5 - this.props.CurrentUser.username.length / 20}em`
  }
}
