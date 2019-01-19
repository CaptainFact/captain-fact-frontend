import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'
import capitalize from 'voca/capitalize'
import { Flex } from '@rebass/grid'

import { LinkExternal } from 'styled-icons/octicons/LinkExternal'

import { MOBILE_WIDTH_THRESHOLD, MIN_REPUTATION_MODERATION } from '../../constants'
import RawIcon from '../Utils/RawIcon'
import ReputationGuard from '../Utils/ReputationGuard'
import { closeSidebar, toggleSidebar } from '../../state/user_preferences/reducer'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import UserLanguageSelector from '../LoggedInUser/UserLanguageSelector'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

@connect(
  state => ({ sidebarExpended: state.UserPreferences.sidebarExpended }),
  { toggleSidebar, closeSidebar }
)
@withNamespaces('main')
@withLoggedInUser
export default class Sidebar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.MenuListLink = this.MenuListLink.bind(this)
    this.MenuLink = this.MenuLink.bind(this)
    this.closeSideBarIfMobile = this.closeSideBarIfMobile.bind(this)
  }

  closeSideBarIfMobile() {
    if (window.innerWidth <= MOBILE_WIDTH_THRESHOLD) this.props.closeSidebar()
  }

  MenuLink({ iconName, className, children, ...props }) {
    const classes = classNames(className, { 'link-with-icon': !!iconName })
    return (
      <Link
        className={classes}
        activeClassName="is-active"
        onClick={this.closeSideBarIfMobile}
        title={children}
        {...props}
      >
        {iconName && <RawIcon name={iconName} />}
        <span>{children}</span>
      </Link>
    )
  }

  MenuListLink(props) {
    return <li>{this.MenuLink(props)}</li>
  }

  render() {
    const { sidebarExpended, className, t } = this.props
    return (
      <Flex
        as="aside"
        id="sidebar"
        className={classNames('menu', className, { expended: sidebarExpended })}
        flexDirection="column"
        justifyContent="space-between"
      >
        <div className="menu-content">
          <p className="menu-label hide-when-collapsed">{t('menu.language')}</p>
          <UserLanguageSelector className="hide-when-collapsed" size="small" />
          <p className="menu-label">{t('menu.content')}</p>
          {this.renderMenuContent()}
          <p className="menu-label">{t('menu.other')}</p>
          <ul className="menu-list">
            <li />
            <this.MenuListLink
              to="/extension"
              iconName="puzzle-piece"
              className="hide-when-collapsed"
            >
              {t('menu.extension')}
            </this.MenuListLink>
            <ExternalLinkNewTab
              href="https://opencollective.com/captainfact_io"
              className="hide-when-collapsed link-with-icon"
            >
              <RawIcon name="heart" />
              {t('menu.donation')}&nbsp;
              <LinkExternal size="1em" />
            </ExternalLinkNewTab>
            <this.MenuListLink to="/help" iconName="question-circle">
              {t('menu.help')}
            </this.MenuListLink>
          </ul>
        </div>
      </Flex>
    )
  }

  renderMenuContent() {
    const t = this.props.t
    return (
      <ul className="menu-list">
        <this.MenuListLink to="/videos" iconName="television" onlyActiveOnIndex>
          {capitalize(t('entities.video_plural'))}
        </this.MenuListLink>
        <ReputationGuard requiredRep={MIN_REPUTATION_MODERATION}>
          <this.MenuListLink to="/moderation" iconName="flag">
            {t('menu.moderation')}
          </this.MenuListLink>
        </ReputationGuard>
      </ul>
    )
  }
}
