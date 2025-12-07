import { LogIn } from 'lucide-react'
import React, { useMemo } from 'react'
import { withTranslation } from 'react-i18next'
import { withResizeDetector } from 'react-resize-detector'
import { Link, withRouter } from 'react-router-dom'
import Popup from 'reactjs-popup'
import { UserCircle } from 'styled-icons/fa-regular'
import { CaretDown } from 'styled-icons/fa-solid'

import { ENABLE_PUBLIC_SEARCH } from '../../config'
import { USER_PICTURE_LARGE } from '../../constants'
import { useTheme } from '../../hooks/use-theme'
import { cn } from '../../lib/css-utils'
import NotificationBell from '../LoggedInUser/NotificationBell'
import Notifications from '../LoggedInUser/Notifications'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import NotificationsPopupContent from '../Notifications/NotificationsPopupContent'
import SearchBox from '../Search/SearchBox'
import { Button } from '../ui/button'
import ScoreTag from '../Users/ScoreTag'
import UserAppellation from '../Users/UserAppellation'
import UserMenu from '../Users/UserMenu'
import UserPicture from '../Users/UserPicture'
import { ErrorView } from '../Utils/ErrorView'
import { LoadingFrame } from '../Utils/LoadingFrame'
import Logo from './Logo'
import MenuToggleSwitch from './MenuToggleSwitch'

const getRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.pathname.startsWith('/login') && !location.pathname.startsWith('/signup')) {
      return location.pathname
    }
  }

  return '/videos'
}

const Navbar = ({ t, loggedInUser, isAuthenticated, loggedInUserLoading, location, width }) => {
  const isMobile = width < 600
  const loginRedirect = getRedirectUrl()
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === 'dark'

  const notificationsPopupStyle = useMemo(
    () => ({
      zIndex: 9999,
      overflow: 'hidden',
      backgroundColor: isDarkMode ? 'hsl(0, 0%, 12%)' : '#ffffff',
      border: isDarkMode ? '1px solid hsl(0, 0%, 20%)' : '1px solid #d3d3d3',
      borderRadius: '5px',
      boxShadow: isDarkMode
        ? 'rgba(0, 0, 0, 0.3) 5px 10px 15px -6px'
        : 'rgba(150, 150, 150, 0.2) 5px 10px 15px -6px',
      width: isMobile ? '95%' : '400px',
    }),
    [isDarkMode, isMobile],
  )

  const userMenuPopupStyle = useMemo(
    () => ({
      zIndex: 9999,
      overflow: 'hidden',
      backgroundColor: isDarkMode ? 'hsl(0, 0%, 12%)' : '#ffffff',
      border: isDarkMode ? '1px solid hsl(0, 0%, 20%)' : '1px solid #d3d3d3',
      borderRadius: '5px',
      boxShadow: isDarkMode
        ? 'rgba(0, 0, 0, 0.3) 5px 10px 15px -6px'
        : 'rgba(150, 150, 150, 0.2) 5px 10px 15px -6px',
      minWidth: '200px',
    }),
    [isDarkMode],
  )

  return (
    <div data-cy="Navbar">
      <div className="h-[60px] w-full" />
      <div className="fixed z-40 top-0 w-full flex justify-between items-center bg-white dark:bg-background h-[60px] border-b border-[#dadada] dark:border-border shadow-[0px_0px_15px_rgba(125,125,125,0.25)] dark:shadow-[0px_0px_15px_rgba(0,0,0,0.25)] transition-[top] duration-300 animate-fadeInUp px-2.5">
        {/* Left */}
        <div className="flex items-center">
          <div className="flex gap-4 items-center h-[59px]">
            {/* Show X icon only on small device */}
            <MenuToggleSwitch toggleableIcon={width <= 768} />
            {(isAuthenticated ? width >= 425 : width >= 380) && (
              <Link to="/">
                <Logo borderless />
              </Link>
            )}
          </div>
        </div>
        {/* Center - holds the search bar (hidden on mobile) */}
        {(ENABLE_PUBLIC_SEARCH || location.pathname.startsWith('/search')) && (
          <div className="hidden md:block relative max-w-[600px] flex-1 mx-2">
            <SearchBox />
          </div>
        )}
        {/* Right */}
        {loggedInUserLoading ? (
          <UserCircle
            size={38}
            title="Loading"
            className="animate-[fadeIn_0.75s_infinite_linear_alternate] mr-2 opacity-50"
          />
        ) : (
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center">
                <div className="mr-3">
                  <ScoreTag reputation={loggedInUser.reputation} size="large" withIcon />
                </div>
                <Popup
                  position="bottom right"
                  offsetX={isMobile ? 75 : 0}
                  contentStyle={notificationsPopupStyle}
                  trigger={<NotificationBell mr={[3, 4]} />}
                >
                  <Notifications>
                    {({ loading, error, notifications, markAsSeen }) => {
                      if (loading) {
                        return <LoadingFrame size="small" />
                      } else if (error) {
                        // eslint-disable-next-line no-console
                        console.error(error)
                        return <ErrorView error={error} />
                      }

                      return (
                        <NotificationsPopupContent
                          notifications={notifications}
                          user={loggedInUser}
                          markAsSeen={markAsSeen}
                        />
                      )
                    }}
                  </Notifications>
                </Popup>
                <Popup
                  position="bottom right"
                  contentStyle={userMenuPopupStyle}
                  trigger={
                    <div className="flex items-center h-[38px] cursor-pointer hover:text-[#c2c2c2] dark:hover:text-gray-400 [&_figure]:max-h-full [&_figure]:max-w-[38px]">
                      <UserPicture size={36} user={loggedInUser} />
                      <CaretDown size={24} />
                    </div>
                  }
                >
                  <div className="bg-background">
                    <div className="flex items-center gap-2 border-b border-[#e7e7e7] dark:border-border px-[15px] py-2.5 dark:bg-slate-900 bg-slate-100">
                      <UserPicture size={USER_PICTURE_LARGE} user={loggedInUser} />
                      <div className="flex flex-col justify-center">
                        <UserAppellation user={loggedInUser} withoutActions />
                        <span className="text-[0.8em] text-[#252525] dark:text-muted-foreground">
                          {loggedInUser.email}
                        </span>
                      </div>
                    </div>
                    <UserMenu user={loggedInUser} hasLogout isSelf>
                      {({ Icon, key, route, title, index, isActive, onClick }) => (
                        <Link
                          key={key}
                          to={route}
                          onClick={onClick}
                          className={cn(
                            'block border-l-2 border-white dark:border-background bg-white dark:bg-background text-base px-[15px] py-2.5 outline-none text-gray-700 dark:text-foreground hover:bg-[#f5f7fa] dark:hover:bg-accent active:bg-[#f5f7fa] dark:active:bg-accent focus:bg-[#f5f7fa] dark:focus:bg-accent',
                            index > 0 && 'border-t border-[#e7e7e7] dark:border-border',
                            isActive && 'border-l-2 border-primary',
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Icon size="1em" />
                            &nbsp;
                            {title}
                          </div>
                        </Link>
                      )}
                    </UserMenu>
                  </div>
                </Popup>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/extension" className="hidden sm:inline-flex">
                  <Button variant="outline">{t('menu.extension')}</Button>
                </Link>
                <Link to={{ pathname: '/login', state: { redirect: loginRedirect } }}>
                  <Button className="sm:h-9 sm:px-4 sm:py-2 sm:text-sm text-xs px-2">
                    <LogIn size={16} />
                    {t('menu.login')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default withLoggedInUser(withTranslation('main')(withRouter(withResizeDetector(Navbar))))
