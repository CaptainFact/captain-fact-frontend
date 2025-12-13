import { useQuery } from '@apollo/client'
import { capitalize, get } from 'lodash'
import {
  CircleHelp,
  Flag,
  Heart,
  ListVideo,
  Mail,
  Monitor,
  Moon,
  Puzzle,
  Sun,
  Users,
} from 'lucide-react'
import React from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Discord, Facebook, Github, Mastodon, Twitter } from 'styled-icons/fa-brands'
import { Star } from 'styled-icons/fa-solid'
import { LinkExternal } from 'styled-icons/octicons'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import { useTheme } from '../../hooks/use-theme'
import UserLanguageSelector from '../LoggedInUser/UserLanguageSelector'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { Badge } from '../ui/badge'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import ProgressBar from '../Utils/ProgressBar'
import ReputationGuard from '../Utils/ReputationGuard'

// Daily gain gauge component
const DailyGainGauge = ({ t }) => {
  const { data } = useQuery(loggedInUserTodayReputationGain, {
    fetchPolicy: 'network-only',
    pollInterval: 30000,
  })

  const dailyGain = get(data, 'loggedInUser.todayReputationGain', 0)

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center w-[90%]">
        <Star size={20} className="text-white bg-[#6ba3a7] p-1 rounded-full -mr-px z-[1]" />
        <ProgressBar
          height="7px"
          outerBackgroundColor="#c4c4c4"
          innerBackgroundColor="#6ba3a7"
          max={MAX_DAILY_REPUTATION_GAIN}
          value={dailyGain}
        />
      </div>
      <p className="text-[#858585] dark:text-muted-foreground text-[0.9em]">
        {`${t('menu.dailyGain')} ${dailyGain}/${MAX_DAILY_REPUTATION_GAIN}`}
      </p>
    </div>
  )
}

// Moderation menu item component
const ModerationMenuItem = ({ t }) => {
  const { data } = useQuery(loggedInUserPendingModerationCount, {
    fetchPolicy: 'network-only',
    pollInterval: 25000,
  })

  const pendingCount = get(data, 'loggedInUser.actions_pending_moderation', 0)

  return (
    <li>
      <a
        href="/moderation"
        className="flex items-center px-4 py-2 text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-accent rounded-md hover:text-gray-900 dark:hover:text-foreground"
      >
        <Flag size="1.2em" className="mr-2" />
        {t('menu.moderation')}
        {Boolean(pendingCount) && (
          <Badge className="ml-2" variant="destructive">
            {pendingCount}
          </Badge>
        )}
      </a>
    </li>
  )
}

// Theme selector component for sidebar
const ThemeSelector = () => {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation('main')

  const themes = [
    { value: 'auto', label: t('theme.auto'), Icon: Monitor },
    { value: 'light', label: t('theme.light'), Icon: Sun },
    { value: 'dark', label: t('theme.dark'), Icon: Moon },
  ]

  return (
    <TooltipProvider delayDuration={50}>
      <div className="flex gap-1 w-full mb-4">
        {themes.map(({ value, label, Icon }) => (
          <Tooltip key={value}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setTheme(value)}
                className={cn(
                  'flex-1 flex items-center justify-center p-2 rounded-md outline-none transition-colors',
                  theme === value
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-white dark:bg-background text-gray-700 dark:text-foreground hover:bg-[#f5f7fa] dark:hover:bg-accent active:bg-[#f5f7fa] dark:active:bg-accent focus:bg-[#f5f7fa] dark:focus:bg-accent',
                )}
                aria-label={label}
              >
                <Icon size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

@connect(() => ({}))
@withTranslation('main')
@withLoggedInUser
class Sidebar extends React.PureComponent {
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
      'flex items-center px-4 py-2 text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-accent rounded-md hover:text-gray-900 dark:hover:text-foreground',
      { 'bg-gray-100 dark:bg-accent': props.isActive },
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
    const { sidebarExpended, toggleSidebar, closeSidebar, className, t, isAuthenticated } =
      this.props
    return (
      <aside
        id="sidebar"
        className={cn(
          'flex flex-col bg-white dark:bg-[hsl(0,0%,12%)] h-full fixed left-0 top-14 bottom-0 z-50 w-full sm:w-72 shadow-lg transition-transform duration-200 ease-in-out',
          { '-translate-x-full sm:-translate-x-72': !sidebarExpended },
          className,
        )}
      >
        <div className="flex flex-col flex-grow overflow-y-auto p-4">
          <p
            className={
              'text-gray-600 dark:text-muted-foreground uppercase text-sm font-semibold mb-2'
            }
          >
            {t('menu.language')}
          </p>
          <UserLanguageSelector className={cn('mb-4')} size="small" />
          <p className="text-gray-600 dark:text-muted-foreground uppercase text-sm font-semibold mb-2">
            {t('theme.title')}
          </p>
          <ThemeSelector />
          {isAuthenticated ? (
            <React.Fragment>
              <p className="text-gray-600 dark:text-muted-foreground uppercase text-sm font-semibold mb-2 mt-3">
                {t('menu.yourProfile')}
              </p>
              {this.renderMenuProfile()}
            </React.Fragment>
          ) : null}
          <p className="text-gray-600 dark:text-muted-foreground uppercase text-sm font-semibold mb-2">
            {t('menu.factChecking')}
          </p>
          {this.renderMenuContent()}
          <p className="text-gray-600 dark:text-muted-foreground uppercase text-sm font-semibold mb-2 mt-3">
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
                'flex items-center px-4 py-2 text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-accent rounded-md hover:text-gray-900 dark:hover:text-foreground'
              }
            >
              <Users size="1.2em" className="mr-2" />
              {t('menu.forum')}
              <LinkExternal
                size="0.9em"
                className="text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground ml-2"
              />
            </ExternalLinkNewTab>
            <ExternalLinkNewTab
              href="https://opencollective.com/captainfact_io"
              className={
                'flex items-center px-4 py-2 text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-accent rounded-md hover:text-gray-900 dark:hover:text-foreground'
              }
            >
              <Heart size="1.2em" className="mr-2" />
              {t('menu.donation')}&nbsp;
              <LinkExternal
                size="0.9em"
                className="text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground ml-2"
              />
            </ExternalLinkNewTab>
          </ul>
          <p className="text-gray-600 dark:text-muted-foreground uppercase text-sm font-semibold mt-3 mb-2">
            {t('menu.followus')}
          </p>
          <div className={'flex space-x-4 px-4'}>
            <ExternalLinkNewTab href="https://github.com/CaptainFact">
              <Github
                size="1.5em"
                className="text-gray-700 dark:text-foreground hover:text-gray-900 dark:hover:text-foreground"
              />
            </ExternalLinkNewTab>
            <ExternalLinkNewTab href="https://discord.captainfact.io">
              <Discord
                size="1.5em"
                className="text-gray-700 dark:text-foreground hover:text-gray-900 dark:hover:text-foreground"
              />
            </ExternalLinkNewTab>
            <ExternalLinkNewTab href="https://twitter.com/CaptainFact_io">
              <Twitter
                size="1.5em"
                className="text-gray-700 dark:text-foreground hover:text-gray-900 dark:hover:text-foreground"
              />
            </ExternalLinkNewTab>
            <ExternalLinkNewTab href="https://www.facebook.com/CaptainFact.io">
              <Facebook
                size="1.5em"
                className="text-gray-700 dark:text-foreground hover:text-gray-900 dark:hover:text-foreground"
              />
            </ExternalLinkNewTab>
            <ExternalLinkNewTab href="https://mamot.fr/@CaptainFact">
              <Mastodon
                size="1.5em"
                className="text-gray-700 dark:text-foreground hover:text-gray-900 dark:hover:text-foreground"
              />
            </ExternalLinkNewTab>
          </div>
        </div>
      </aside>
    )
  }

  renderDailyGainGauge() {
    const { t } = this.props
    return <DailyGainGauge t={t} />
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
          <ModerationMenuItem t={t} />
        </ReputationGuard>
      </ul>
    )
  }
}

const SidebarWithPreferences = (props) => {
  const { sidebarExpended, toggleSidebar, closeSidebar } = useUserPreferences()
  return (
    <Sidebar
      {...props}
      sidebarExpended={sidebarExpended}
      toggleSidebar={toggleSidebar}
      closeSidebar={closeSidebar}
    />
  )
}

export default SidebarWithPreferences
