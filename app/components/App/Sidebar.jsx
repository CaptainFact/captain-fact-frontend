import { Query } from '@apollo/client/react/components'
import { capitalize, get } from 'lodash'
import { CircleHelp, Flag, Heart, ListVideo, Mail, Puzzle, Users } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Discord, Facebook, Github, Mastodon, Twitter } from 'styled-icons/fa-brands'
import { Star } from 'styled-icons/fa-solid'
import { LinkExternal } from 'styled-icons/octicons'

import { cn } from '@/lib/css-utils'

import {
  loggedInUserPendingModerationCount,
  loggedInUserTodayReputationGain,
} from '../../API/graphql_queries'
import {
  MAX_DAILY_REPUTATION_GAIN,
  MIN_REPUTATION_MODERATION,
  TABLET_WIDTH_THRESHOLD,
} from '../../constants'
import { closeSidebar, toggleSidebar } from '../../state/user_preferences/reducer'
import UserLanguageSelector from '../LoggedInUser/UserLanguageSelector'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { Badge } from '../ui/badge'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import ProgressBar from '../Utils/ProgressBar'
import ReputationGuard from '../Utils/ReputationGuard'

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
  font-size: 0.9em;
`

@connect((state) => ({ sidebarExpended: state.UserPreferences.sidebarExpended }), {
  toggleSidebar,
  closeSidebar,
})
@withTranslation('main')
@withLoggedInUser
export default class Sidebar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.MenuListLink = this.MenuListLink.bind(this)
    this.MenuLink = this.MenuLink.bind(this)
    this.closeSideBarIfMobile = this.closeSideBarIfMobile.bind(this)
  }

  closeSideBarIfMobile() {
    if (window.innerWidth <= TABLET_WIDTH_THRESHOLD) {
      this.props.closeSidebar()
    }
  }

  MenuLink({ title, className, children, ...props }) {
    const classes = cn(
      'flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md hover:text-gray-900',
      { 'bg-gray-100': props.isActive },
      className,
    )

    return (
      <NavLink
        className={classes}
        activeClassName="bg-primary/10"
        onClick={this.closeSideBarIfMobile}
        title={title}
        // For `/help/contact`, override the default `isActive` as we would activate both help and contact otherwise
        isActive={
          props.to === '/help'
            ? (match, location) => (location.pathname === '/help/contact' ? false : match)
            : null
        }
        {...props}
      >
        {children}
      </NavLink>
    )
  }

  MenuListLink(props) {
    return <li>{this.MenuLink(props)}</li>
  }

  render() {
    const { sidebarExpended, className, t, isAuthenticated } = this.props
    return (
      <aside
        id="sidebar"
        className={cn(
          'flex flex-col bg-white h-full fixed left-0 top-14 bottom-0 z-50 w-full sm:w-72 shadow-lg transition-transform duration-200 ease-in-out',
          { '-translate-x-full sm:-translate-x-72': !sidebarExpended },
          className,
        )}
      >
        <div className="flex flex-col flex-grow overflow-y-auto p-4">
          <p className={'text-gray-600 uppercase text-sm font-semibold mb-2'}>
            {t('menu.language')}
          </p>
          <UserLanguageSelector className={cn('mb-4')} size="small" />
          {isAuthenticated ? (
            <React.Fragment>
              <p className="text-gray-600 uppercase text-sm font-semibold mb-2">
                {t('menu.yourProfile')}
              </p>
              {this.renderMenuProfile()}
            </React.Fragment>
          ) : null}
          <p className="text-gray-600 uppercase text-sm font-semibold mb-2">
            {t('menu.factChecking')}
          </p>
          {this.renderMenuContent()}
          <p className="text-gray-600 uppercase text-sm font-semibold mb-2 mt-3">
            {t('menu.other')}
          </p>
          <ul>
            <this.MenuListLink to="/help">
              <CircleHelp size="1.2em" className="mr-2" />
              <span>{t('menu.help')}</span>
            </this.MenuListLink>
            <this.MenuListLink to="/help/contact" title={t('menu.contact')}>
              <Mail size="1.2em" className="mr-2" />
              <span>{t('menu.contact')}</span>
            </this.MenuListLink>
            <this.MenuListLink to="/extension">
              <Puzzle size="1.2em" className="mr-2" />
              {t('menu.extension')}
            </this.MenuListLink>
            <ExternalLinkNewTab
              href="https://forum.captainfact.io"
              className={
                'flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md hover:text-gray-900'
              }
            >
              <Users size="1.2em" className="mr-2" />
              {t('menu.forum')}
              <LinkExternal size="0.9em" className="text-gray-500 hover:text-gray-900 ml-2" />
            </ExternalLinkNewTab>
            <ExternalLinkNewTab
              href="https://opencollective.com/captainfact_io"
              className={
                'flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md hover:text-gray-900'
              }
            >
              <Heart size="1.2em" className="mr-2" />
              {t('menu.donation')}&nbsp;
              <LinkExternal size="0.9em" className="text-gray-500 hover:text-gray-900 ml-2" />
            </ExternalLinkNewTab>
          </ul>
          <p className="text-gray-600 uppercase text-sm font-semibold mt-3 mb-2">
            {t('menu.followus')}
          </p>
          <div className={'flex space-x-4 px-4'}>
            <ExternalLinkNewTab href="https://github.com/CaptainFact">
              <Github size="1.5em" className="text-gray-700 hover:text-gray-900" />
            </ExternalLinkNewTab>
            <ExternalLinkNewTab href="https://discord.captainfact.io">
              <Discord size="1.5em" className="text-gray-700 hover:text-gray-900" />
            </ExternalLinkNewTab>
            <ExternalLinkNewTab href="https://twitter.com/CaptainFact_io">
              <Twitter size="1.5em" className="text-gray-700 hover:text-gray-900" />
            </ExternalLinkNewTab>
            <ExternalLinkNewTab href="https://www.facebook.com/CaptainFact.io">
              <Facebook size="1.5em" className="text-gray-700 hover:text-gray-900" />
            </ExternalLinkNewTab>
            <ExternalLinkNewTab href="https://mamot.fr/@CaptainFact">
              <Mastodon size="1.5em" className="text-gray-700 hover:text-gray-900" />
            </ExternalLinkNewTab>
          </div>
        </div>
      </aside>
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
            <div className="flex flex-col items-center">
              <div className="flex items-center w-[90%]">
                <WhiteStar size={20} />
                <ProgressBar
                  height="7px"
                  outerBackgroundColor="#c4c4c4"
                  innerBackgroundColor="#6ba3a7"
                  max={MAX_DAILY_REPUTATION_GAIN}
                  value={dailyGain}
                />
              </div>
              <DailyGainText>
                {`${t('menu.dailyGain')} ${dailyGain}/${MAX_DAILY_REPUTATION_GAIN}`}
              </DailyGainText>
            </div>
          )
        }}
      </Query>
    )
  }

  renderMenuProfile() {
    return (
      <ul className={'space-y-2 mb-4'}>
        <li>{this.renderDailyGainGauge()}</li>
      </ul>
    )
  }

  renderMenuContent() {
    const t = this.props.t
    return (
      <ul>
        <this.MenuListLink to="/videos" strict>
          <ListVideo size="1.2em" className="mr-2" />
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
                <this.MenuListLink to="/moderation">
                  <Flag size="1.2em" className="mr-2" />
                  {t('menu.moderation')}
                  {Boolean(pendingCount) && (
                    <Badge className="ml-2" variant="destructive">
                      {pendingCount}
                    </Badge>
                  )}
                </this.MenuListLink>
              )
            }}
          </Query>
        </ReputationGuard>
      </ul>
    )
  }
}
