import { LogIn } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { withResizeDetector } from 'react-resize-detector'
import { Link, withRouter } from 'react-router-dom'
import Popup from 'reactjs-popup'
import { UserCircle } from 'styled-icons/fa-regular'
import { CaretDown } from 'styled-icons/fa-solid'

import { ENABLE_PUBLIC_SEARCH } from '../../config'
import { USER_PICTURE_LARGE } from '../../constants'
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
  return (
    <div data-cy="Navbar">
      <div className="h-[60px] w-full" />
      <div className="fixed z-40 top-0 w-full flex justify-between items-center bg-white h-[60px] border-b border-[#dadada] shadow-[0px_0px_15px_rgba(125,125,125,0.25)] transition-[top] duration-300 animate-fadeInUp px-2.5">
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
          <div className="flex">
            {isAuthenticated ? (
              <div className="flex items-center">
                <div className="mr-3">
                  <ScoreTag reputation={loggedInUser.reputation} size="large" withIcon />
                </div>
                <Popup
                  position="bottom right"
                  offsetX={isMobile ? 75 : 0}
                  contentStyle={{
                    zIndex: 9999,
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d3d3d3',
                    borderRadius: '5px',
                    boxShadow: 'rgba(150, 150, 150, 0.2) 5px 10px 15px -6px',
                    width: isMobile ? '95%' : '400px',
                  }}
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
                  contentStyle={{
                    zIndex: 9999,
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d3d3d3',
                    borderRadius: '5px',
                    boxShadow: 'rgba(150, 150, 150, 0.2) 5px 10px 15px -6px',
                    minWidth: '200px',
                  }}
                  trigger={
                    <div className="flex items-center h-[38px] cursor-pointer hover:text-[#c2c2c2] [&_figure]:max-h-full [&_figure]:max-w-[38px]">
                      <UserPicture size={36} user={loggedInUser} />
                      <CaretDown size={24} />
                    </div>
                  }
                >
                  <div>
                    <div className="flex items-center gap-2 border-b border-[#e7e7e7] px-[15px] py-2.5">
                      <UserPicture size={USER_PICTURE_LARGE} user={loggedInUser} />
                      <div className="flex flex-col justify-center">
                        <UserAppellation user={loggedInUser} withoutActions />
                        <span className="text-[0.8em] text-[#252525]">{loggedInUser.email}</span>
                      </div>
                    </div>
                    <UserMenu user={loggedInUser} hasLogout isSelf>
                      {({ Icon, key, route, title, index, isActive, onClick }) => (
                        <Link
                          key={key}
                          to={route}
                          onClick={onClick}
                          className={cn(
                            'block border-l-2 border-white bg-white text-base px-[15px] py-2.5 outline-none hover:bg-[#f5f7fa] active:bg-[#f5f7fa] focus:bg-[#f5f7fa]',
                            index > 0 && 'border-t border-[#e7e7e7]',
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
