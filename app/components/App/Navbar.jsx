import { omit } from 'lodash'
import { LogIn } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { withResizeDetector } from 'react-resize-detector'
import { Link, withRouter } from 'react-router-dom'
import Popup from 'reactjs-popup'
import styled, { css, withTheme } from 'styled-components'
import { UserCircle } from 'styled-icons/fa-regular'
import { CaretDown } from 'styled-icons/fa-solid'
import { themeGet } from 'styled-system'

import { ENABLE_PUBLIC_SEARCH } from '../../config'
import { USER_PICTURE_LARGE } from '../../constants'
import NotificationBell from '../LoggedInUser/NotificationBell'
import Notifications from '../LoggedInUser/Notifications'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import NotificationsPopupContent from '../Notifications/NotificationsPopupContent'
import SearchBox from '../Search/SearchBox'
import Container from '../StyledUtils/Container'
import { fadeIn } from '../StyledUtils/Keyframes'
import StyledLink from '../StyledUtils/StyledLink'
import { Span } from '../StyledUtils/Text'
import { Button } from '../ui/button'
import ScoreTag from '../Users/ScoreTag'
import UserAppellation from '../Users/UserAppellation'
import UserMenu from '../Users/UserMenu'
import UserPicture from '../Users/UserPicture'
import { ErrorView } from '../Utils/ErrorView'
import { LoadingFrame } from '../Utils/LoadingFrame'
import Logo from './Logo'
import MenuToggleSwitch from './MenuToggleSwitch'

const NavbarContainer = styled.div`
  position: fixed;
  z-index: 40;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  height: ${themeGet('navbarHeight')}px;
  border-bottom: 1px solid ${themeGet('colors.black.200')};
  box-shadow: 0px 0px 15px rgba(125, 125, 125, 0.25);
  transition: top 0.3s;
  animation: ${fadeIn} 0.3s;
  padding: 0 10px;
`

const UserMenuTrigger = styled.div`
  display: flex;
  align-items: center;
  height: 38px;
  cursor: pointer;

  &:hover {
    color: ${themeGet('colors.black.300')};
  }

  figure {
    max-height: 100%;
    max-width: 38px;
  }
`

const UserMenuEntry = styled((props) => <StyledLink {...omit(props, 'isActive')} />)`
  display: block;
  border-left: 2px solid white;
  background: white;
  font-size: 1em;
  padding: 10px 15px;
  outline: none;

  &:hover,
  &:active,
  &:focus {
    background: ${themeGet('colors.black.50')};
  }

  ${(props) =>
    props.index > 0 &&
    css`
      border-top: 1px solid ${themeGet('colors.black.100')};
    `}

  ${(props) =>
    props.isActive &&
    css`
      border-left: 2px solid ${themeGet('colors.primary')};
    `}
`

const UserHero = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid ${themeGet('colors.black.100')};
  padding: 10px 15px;
`

const UserLoading = styled(UserCircle)`
  animation: ${fadeIn} 0.75s infinite linear alternate;
  margin-right: ${themeGet('space.2')};
`

const StyledPopup = styled(Popup)`
  &-content {
    z-index: 50;
    overflow: hidden;
    background-color: ${themeGet('colors.white')};
    border: 1px solid #d3d3d3;
    border-radius: 5px;
    box-shadow: rgba(150, 150, 150, 0.2) 5px 10px 15px -6px;
  }
`

const NotificationPopup = styled(StyledPopup)`
  &-content {
    width: 95%;

    @media (min-width: 600px) {
      width: 400px;
    }
  }
`
const MenuPopup = styled(StyledPopup)`
  &-content {
    min-width: 200px;
  }
`

const getRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.pathname.startsWith('/login') && !location.pathname.startsWith('/signup')) {
      return location.pathname
    }
  }

  return '/videos'
}

const Navbar = ({
  t,
  theme,
  loggedInUser,
  isAuthenticated,
  loggedInUserLoading,
  location,
  width,
}) => {
  const isMobile = width < 600
  const loginRedirect = getRedirectUrl()
  return (
    <div data-cy="Navbar">
      <Container height={theme.navbarHeight} width={1} />
      <NavbarContainer>
        {/* Left */}
        <div className="flex items-center">
          <Container display="flex" gap={4} alignItems="center" height={theme.navbarHeight - 1}>
            {/* Show X icon only on small device */}
            <MenuToggleSwitch toggleableIcon={width <= 768} />
            {(isAuthenticated ? width >= 425 : width >= 380) && (
              <Link to="/">
                <Logo borderless />
              </Link>
            )}
          </Container>
        </div>
        {/* Center - holds the search bar (hidden on mobile) */}
        {(ENABLE_PUBLIC_SEARCH || location.pathname.startsWith('/search')) && (
          <Container
            display={['none', 'block']}
            position="relative"
            maxWidth="600px"
            flex="1 1"
            mx={2}
          >
            <SearchBox />
          </Container>
        )}
        {/* Right */}
        {loggedInUserLoading ? (
          <UserLoading size={38} title="Loading" />
        ) : (
          <div className="flex">
            {isAuthenticated ? (
              <div className="flex items-center">
                <div className="mr-3">
                  <ScoreTag reputation={loggedInUser.reputation} size="large" withIcon />
                </div>
                <NotificationPopup
                  position="bottom right"
                  offsetX={isMobile ? 75 : 0}
                  contentStyle={{ zIndex: 9999 }}
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
                </NotificationPopup>
                <MenuPopup
                  position="bottom right"
                  contentStyle={{ zIndex: 9999 }}
                  trigger={
                    <UserMenuTrigger>
                      <UserPicture size={36} user={loggedInUser} />
                      <CaretDown size={24} />
                    </UserMenuTrigger>
                  }
                >
                  <div>
                    <UserHero>
                      <UserPicture size={USER_PICTURE_LARGE} user={loggedInUser} />
                      <div className="flex flex-col justify-center">
                        <UserAppellation user={loggedInUser} withoutActions />
                        <Span fontSize="0.8em" color="black.500">
                          {loggedInUser.email}
                        </Span>
                      </div>
                    </UserHero>
                    <UserMenu user={loggedInUser} hasLogout isSelf>
                      {({ Icon, key, route, title, index, isActive, onClick }) => (
                        <UserMenuEntry
                          key={key}
                          to={route}
                          index={index}
                          isActive={isActive}
                          onClick={onClick}
                        >
                          <div className="flex items-center gap-2">
                            <Icon size="1em" />
                            &nbsp;
                            {title}
                          </div>
                        </UserMenuEntry>
                      )}
                    </UserMenu>
                  </div>
                </MenuPopup>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/extension" className="hidden sm:inline-flex" mr={2}>
                  <Button variant="outline">{t('menu.extension')}</Button>
                </Link>
                <Link to={{ pathname: '/login', state: { redirect: loginRedirect } }} mr={2}>
                  <Button className="sm:h-9 sm:px-4 sm:py-2 sm:text-sm text-xs px-2">
                    <LogIn size={16} />
                    {t('menu.login')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </NavbarContainer>
    </div>
  )
}

export default withTheme(
  withLoggedInUser(withTranslation('main')(withRouter(withResizeDetector(Navbar)))),
)
