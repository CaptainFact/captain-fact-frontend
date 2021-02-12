import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router'
import styled, { withTheme, css } from 'styled-components'
import { Flex, Box } from '@rebass/grid'
import { themeGet } from 'styled-system'
import { withResizeDetector } from 'react-resize-detector'
import Popup from 'reactjs-popup'
import { withNamespaces } from 'react-i18next'
import { omit } from 'lodash'

import { Menu } from 'styled-icons/boxicons-regular/Menu'

import { CaretDown } from 'styled-icons/fa-solid/CaretDown'
import { UserCircle } from 'styled-icons/fa-regular/UserCircle'
import { HelpCircle } from 'styled-icons/boxicons-regular/HelpCircle'

import Logo from './Logo'
import { toggleSidebar } from '../../state/user_preferences/reducer'
import UserPicture from '../Users/UserPicture'
import { USER_PICTURE_LARGE } from '../../constants'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { fadeIn } from '../StyledUtils/Keyframes'
import UserMenu from '../Users/UserMenu'
import StyledLink from '../StyledUtils/StyledLink'
import Notifications from '../LoggedInUser/Notifications'
import { ErrorView } from '../Utils/ErrorView'
import Container from '../StyledUtils/Container'
import NotificationsPopupContent from '../Notifications/NotificationsPopupContent'
import NotificationBell from '../LoggedInUser/NotificationBell'
import ScoreTag from '../Users/ScoreTag'

const NavbarContainer = styled(Flex)`
  position: fixed;
  z-index: 9999;
  top: 0;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  height: ${themeGet('navbarHeight')}px;
  border-bottom: 1px solid ${themeGet('colors.black.200')};
  box-shadow: 0px 0px 15px rgba(125, 125, 125, 0.25);
  transition: top 0.3s;
  animation: ${fadeIn} 0.3s;
`

const UserMenuTrigger = styled(Flex)`
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

  &:hover {
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

UserMenuEntry.defaultProps = {
  px: 2,
  py: 1,
}

const ScoreHelpButton = styled(HelpCircle)`
  color: #39b714;
`

const UserLoading = styled(UserCircle)`
  animation: ${fadeIn} 0.75s infinite linear alternate;
  margin-right: ${themeGet('space.2')};
`

const MenuToggleSwitch = styled(Menu)`
  height: 100%;
  width: 45px;
  cursor: pointer;
  user-select: none;

  &:hover {
    color: ${themeGet('colors.black.500')};
  }
`

const basePopupStyle = {
  boxShadow: 'rgba(150, 150, 150, 0.2) 5px 10px 15px -6px',
  filter: 'none',
}

const desktopPopupStyle = { ...basePopupStyle, minWidth: 400 }

const mobilePopupStyle = { ...basePopupStyle, width: '95%' }

const Navbar = ({
  t,
  theme,
  toggleSidebar,
  loggedInUser,
  isAuthenticated,
  loggedInUserLoading,
  location,
  width,
}) => {
  const isMobile = width < 600
  const loginRedirect =
    !location.pathname.startsWith('/login') && !location.pathname.startsWith('/signup')
      ? location.pathname
      : '/videos'

  return (
    <Box data-cy="Navbar">
      <Container height={theme.navbarHeight} width={1} />
      <NavbarContainer px={2}>
        {/* Left */}
        <Flex alignItems="center">
          <Container display="flex" alignItems="center" height={theme.navbarHeight - 1}>
            <MenuToggleSwitch onClick={() => toggleSidebar()} />
            {width >= 425 && (
              <StyledLink className="logo" to="/" ml={1}>
                <Logo height={theme.navbarHeight - 24} borderless />
              </StyledLink>
            )}
          </Container>
        </Flex>
        {/* Center - will hold the search bar in the future */}
        {/* Right */}
        {loggedInUserLoading ? (
          <UserLoading size={38} title="Loading" />
        ) : (
          <Flex>
            {isAuthenticated ? (
              <Flex alignItems="center">
                <StyledLink to="/help/reputation" mr={1}>
                  <ScoreHelpButton size={25} title="Reputation Help Button" />
                </StyledLink>
                <Box mr={[3, 4]}>
                  <ScoreTag reputation={loggedInUser.reputation} size="large" withIcon />
                </Box>
                <Popup
                  position="bottom right"
                  offsetX={isMobile ? 75 : -12}
                  contentStyle={isMobile ? mobilePopupStyle : desktopPopupStyle}
                  trigger={<NotificationBell mr={[3, 4]} />}
                >
                  <Notifications>
                    {({ loading, error, notifications, markAsSeen }) => {
                      if (loading) {
                        return <LoadingFrame size="small" />
                      } else if (error) {
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
                  offsetX={-12}
                  trigger={
                    <UserMenuTrigger>
                      <UserPicture size={USER_PICTURE_LARGE} user={loggedInUser} />
                      <CaretDown size={24} />
                    </UserMenuTrigger>
                  }
                >
                  <UserMenu user={loggedInUser} hasLogout isSelf>
                    {({ Icon, key, route, title, index, isActive, onClick }) => (
                      <UserMenuEntry
                        key={key}
                        to={route}
                        index={index}
                        isActive={isActive}
                        onClick={onClick}
                      >
                        <Box>
                          <Icon size="1em" />
                          &nbsp;
                          {title}
                        </Box>
                      </UserMenuEntry>
                    )}
                  </UserMenu>
                </Popup>
              </Flex>
            ) : (
              <React.Fragment>
                <StyledLink
                  to={{ pathname: '/login', state: { redirect: loginRedirect } }}
                  className="button is-primary is-outlined"
                  mr={2}
                >
                  <span>{t('menu.login')}</span>
                </StyledLink>
                <StyledLink
                  display={['none !important', 'inline-flex !important']}
                  to="/extension"
                  className="button is-primary"
                  mr={2}
                >
                  <span>{t('menu.extension')}</span>
                </StyledLink>
                <Link
                  to={{ pathname: '/signup', state: { redirect: loginRedirect } }}
                  className="button is-primary"
                >
                  <span>{t('menu.signup')}</span>
                </Link>
              </React.Fragment>
            )}
          </Flex>
        )}
      </NavbarContainer>
    </Box>
  )
}

export default withTheme(
  connect(null, { toggleSidebar })(
    withLoggedInUser(withNamespaces('main')(withRouter(withResizeDetector(Navbar))))
  )
)
