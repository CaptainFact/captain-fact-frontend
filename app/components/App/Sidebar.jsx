import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Query } from 'react-apollo'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'
import { get } from 'lodash'
import capitalize from 'voca/capitalize'
import { Flex } from '@rebass/grid'
import styled from 'styled-components'

import { Star } from 'styled-icons/fa-solid'
import { EnvelopeFill } from 'styled-icons/bootstrap'

import { Github } from 'styled-icons/fa-brands'
import { Discord } from 'styled-icons/fa-brands'
import { Twitter } from 'styled-icons/fa-brands'
import { Facebook } from 'styled-icons/fa-brands'
import { Mastodon } from 'styled-icons/fa-brands'

import { LinkExternal } from 'styled-icons/octicons'

import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import {
  loggedInUserPendingModerationCount,
  loggedInUserTodayReputationGain,
} from '../../API/graphql_queries'
import { MOBILE_WIDTH_THRESHOLD, MIN_REPUTATION_MODERATION } from '../../constants'
import RawIcon from '../Utils/RawIcon'
import ReputationGuard from '../Utils/ReputationGuard'
import { closeSidebar, toggleSidebar } from '../../state/user_preferences/reducer'
import UserLanguageSelector from '../LoggedInUser/UserLanguageSelector'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import Tag from '../Utils/Tag'
import ProgressBar from '../Utils/ProgressBar'
import { MAX_DAILY_REPUTATION_GAIN } from '../../constants'

const WhiteStar = styled(Star)`
  color: white;
  background-color: #6ba3a7;
  padding: 4px;
  border-radius: 50%;
  margin-right: -1px;
  z-index: 1;
`
const DailyGainText = styled.p`
  color: #858585;
`
@connect((state) => ({ sidebarExpended: state.UserPreferences.sidebarExpended }), {
  toggleSidebar,
  closeSidebar,
})
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
    if (window.innerWidth <= MOBILE_WIDTH_THRESHOLD) {
      this.props.closeSidebar()
    }
  }

  MenuLink({ title, iconName, customLink, className, children, ...props }) {
    const classes = classNames(className, { 'link-with-icon': !!iconName })
    return (
      <Link
        className={classes}
        activeClassName="is-active"
        onClick={this.closeSideBarIfMobile}
        title={title ? title : children}
        {...props}
      >
        {iconName && <RawIcon name={iconName} />}
        {customLink ? children : <span>{children}</span>}
      </Link>
    )
  }

  MenuListLink(props) {
    return <li>{this.MenuLink(props)}</li>
  }

  render() {
    const { sidebarExpended, className, t, isAuthenticated } = this.props
    return (
      <Flex
        as="aside"
        id="sidebar"
        className={classNames('menu', className, { expended: sidebarExpended })}
        flexDirection="column"
      >
        <div className="menu-content">
          <p className="menu-label hide-when-collapsed">{t('menu.language')}</p>
          <UserLanguageSelector className="hide-when-collapsed" size="small" />
          {isAuthenticated ? (
            <React.Fragment>
              <p className="menu-label">{t('menu.yourProfile')}</p>
              {this.renderMenuProfile()}
            </React.Fragment>
          ) : null}
          <p className="menu-label">{t('menu.factChecking')}</p>
          {this.renderMenuContent()}
          <p className="menu-label">{t('menu.other')}</p>
          <ul className="menu-list">
            <li />
            <this.MenuListLink to="/extension" iconName="puzzle-piece">
              {t('menu.extension')}
            </this.MenuListLink>
            <ExternalLinkNewTab
              href="https://forum.captainfact.io"
              className="hide-when-collapsed link-with-icon"
            >
              <RawIcon name="users" />
              {t('menu.forum')}&nbsp;
              <LinkExternal size="1em" />
            </ExternalLinkNewTab>
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
            <this.MenuListLink
              to="/help/contact"
              title={t('menu.contact')}
              customLink
              className="link-with-icon"
            >
              <i className="styled-icon">
                <EnvelopeFill size="1.2em" />
              </i>
              <span>{t('menu.contact')}</span>
            </this.MenuListLink>
          </ul>
          <p className="menu-label">{t('menu.followus')}</p>
          <div className="hide-when-collapsed social-networks">
            {' '}
            &nbsp; &nbsp;
            <ExternalLinkNewTab href="https://github.com/CaptainFact">
              <Github size="1.5em" /> &nbsp;&nbsp;&nbsp;
            </ExternalLinkNewTab>
            <ExternalLinkNewTab href="https://discord.gg/Z22Vhda">
              <Discord size="1.5em" /> &nbsp;&nbsp;&nbsp;
            </ExternalLinkNewTab>
            <ExternalLinkNewTab href="https://twitter.com/CaptainFact_io">
              <Twitter size="1.5em" /> &nbsp;&nbsp;&nbsp;
            </ExternalLinkNewTab>
            <ExternalLinkNewTab href="https://www.facebook.com/CaptainFact.io">
              <Facebook size="1.5em" /> &nbsp;&nbsp;&nbsp;
            </ExternalLinkNewTab>
            <ExternalLinkNewTab href="https://mamot.fr/@CaptainFact">
              <Mastodon size="1.5em" /> &nbsp;&nbsp;&nbsp;
            </ExternalLinkNewTab>
          </div>
        </div>
      </Flex>
    )
  }

  renderDailyGainGauge() {
    const { t } = this.props

    return (
      <Query
        fetchPolicy="network-only"
        pollInterval={30000}
        query={loggedInUserTodayReputationGain}
      >
        {({ data }) => {
          const dailyGain = get(data, 'loggedInUser.todayReputationGain', 0)

          return (
            <Flex flexDirection="column" alignItems="center">
              <Flex style={{ width: '90%' }} alignItems="center">
                <WhiteStar size={20} />
                <ProgressBar
                  height="7px"
                  outerBackgroundColor="#c4c4c4"
                  innerBackgroundColor="#6ba3a7"
                  max={MAX_DAILY_REPUTATION_GAIN}
                  value={dailyGain}
                />
              </Flex>
              <DailyGainText>
                {`${t('menu.dailyGain')} ${dailyGain}/${MAX_DAILY_REPUTATION_GAIN}`}
              </DailyGainText>
            </Flex>
          )
        }}
      </Query>
    )
  }

  renderMenuProfile() {
    return (
      <ul className="menu-list hide-when-collapsed">
        <li>{this.renderDailyGainGauge()}</li>
      </ul>
    )
  }

  renderMenuContent() {
    const t = this.props.t
    return (
      <ul className="menu-list">
        <this.MenuListLink to="/videos" iconName="television" onlyActiveOnIndex>
          {capitalize(t('entities.videoFactChecking'))}
        </this.MenuListLink>
        <ReputationGuard requiredRep={MIN_REPUTATION_MODERATION}>
          <Query
            fetchPolicy="network-only"
            pollInterval={25000}
            query={loggedInUserPendingModerationCount}
          >
            {({ data }) => {
              const pendingCount = get(data, 'loggedInUser.actions_pending_moderation', 0)
              return (
                <this.MenuListLink to="/moderation" iconName="flag">
                  {t('menu.moderation')}
                  {Boolean(pendingCount) && <Tag type="danger">{pendingCount}</Tag>}
                </this.MenuListLink>
              )
            }}
          </Query>
        </ReputationGuard>
      </ul>
    )
  }
}
