import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import styled, { withTheme, css } from 'styled-components'
import { Flex, Box } from '@rebass/grid'
import { themeGet } from 'styled-system'

import { Menu } from 'styled-icons/boxicons-regular/Menu'
import { Bell } from 'styled-icons/fa-solid/Bell'
import { CaretDown } from 'styled-icons/fa-solid/CaretDown'
import { UserCircle } from 'styled-icons/fa-regular/UserCircle'

import { withNamespaces } from 'react-i18next'
import Popup from 'reactjs-popup'
import Logo from './Logo'
import { toggleSidebar } from '../../state/user_preferences/reducer'
import UserPicture from '../Users/UserPicture'
import { USER_PICTURE_LARGE } from '../../constants'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import UnstyledButton from '../StyledUtils/UnstyledButton'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { fadeIn } from '../StyledUtils/Keyframes'
import UserMenu from '../Users/UserMenu'
import StyledLink from '../StyledUtils/StyledLink'
import Notifications from '../LoggedInUser/Notifications'
import { ErrorView } from '../Utils/ErrorView'
import Message from '../Utils/Message'
import NotificationDetails from '../Notifications/NotificationDetails'
import { TimeSince } from '../Utils/TimeSince'
import Container from '../StyledUtils/Container';

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
  box-shadow: 0px 0px 20px 5px rgba(125, 125, 125, 0.3);
  transition: top 0.3s;
  animation: ${fadeIn} 0.3s;

  .site-logo {
    font-size: 24px;
    margin: 0;
  }
`

const MenuToggleSwitch = styled(Menu)`
  height: 100%;
  width: 45px;
  margin-right: ${themeGet('space.1')};
  cursor: pointer;
  user-select: none;

  &:hover {
    color: ${themeGet('colors.black.500')};
  }
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

const UserMenuEntry = styled(({ isActive, ...props }) => <StyledLink {...props} />)`
  display: block;
  border-left: 2px solid white;
  background: white;

  &:hover {
    background: ${themeGet('colors.black.50')};
  }

  ${props => props.index > 0
    && css`
      border-top: 1px solid ${themeGet('colors.black.100')};
    `}

  ${props => props.isActive
    && css`
      border-left: 2px solid ${themeGet('colors.primary')};
    `}
`

UserMenuEntry.defaultProps = {
  px: 2,
  py: 1
}

const UserLoading = styled(UserCircle)`
  animation: ${fadeIn} 0.75s infinite linear alternate;
  margin-right: ${themeGet('space.2')};
`

const Navbar = ({
  t,
  theme,
  toggleSidebar,
  loggedInUser,
  isAuthenticated,
  loggedInUserLoading,
  hasMenuToggle
}) => {
  return (
    <Box>
      <Container height={theme.navbarHeight} width={1} />
      <NavbarContainer px={2}>
        {/* Left */}
        <Flex alignItems="center">
          {hasMenuToggle && <MenuToggleSwitch onClick={() => toggleSidebar()} />}
          <StyledLink to="/" ml={1}>
            <Logo height={theme.navbarHeight - 25} borderless />
          </StyledLink>
        </Flex>
        {/* Center - will hold the search bar in the future */}
        {/* Right */}
        {loggedInUserLoading ? (
          <UserLoading size={38} title="Loading" />
        ) : (
          <Flex alignItems="center">
            {isAuthenticated ? (
              <React.Fragment>
                <Popup
                  position="bottom right"
                  offsetX={-12}
                  trigger={(
                    <UnstyledButton mr={[3, 4]}>
                      <Bell size={24} />
                    </UnstyledButton>
                  )}
                >
                  <Notifications>
                    {({ loading, error, notifications }) => {
                      if (loading) {
                        return <LoadingFrame />
                      } else if (error) {
                        return <ErrorView error={error} />
                      }

                      return (
                        <Flex flexDirection="column" alignItems="center">
                          <Box mb={3} p={[2, 4]}>
                            {notifications.length === 0 ? (
                              <Message>
                                There's no notification in here yet. They'll start
                                appearing once someone reply to one of your comments or if
                                an action is made on a video you follow.
                              </Message>
                            ) : (
                              <Flex flexDirection="column">
                                {notifications.map(n => (
                                  <NotificationDetails key={n.id} notification={n}>
                                    {({ message, seenAt, insertedAt }) => (
                                      <Flex>
                                        <Box>{message}</Box>
                                        <Box mx={2}>|</Box>
                                        <Box>{seenAt ? 'Seen' : 'Not seen'}</Box>
                                        <Box mx={2}>|</Box>
                                        <Box>
                                          <TimeSince time={insertedAt} />
                                        </Box>
                                      </Flex>
                                    )}
                                  </NotificationDetails>
                                ))}
                              </Flex>
                            )}
                          </Box>
                        </Flex>
                      )
                    }}
                  </Notifications>
                </Popup>
                <Popup
                  position="bottom right"
                  offsetX={-12}
                  trigger={(
                    <UserMenuTrigger>
                      <UserPicture size={USER_PICTURE_LARGE} user={loggedInUser} />
                      <CaretDown size={24} />
                    </UserMenuTrigger>
                  )}
                >
                  <UserMenu user={loggedInUser} isSelf>
                    {({ Icon, key, route, title, index, isActive }) => key !== '/notifications' && (
                      <UserMenuEntry
                        key={key}
                        to={route}
                        index={index}
                        isActive={isActive}
                      >
                        <Box>
                          <Icon size="1em" />
                            &nbsp;
                          {title}
                        </Box>
                      </UserMenuEntry>
                    )
                    }
                  </UserMenu>
                </Popup>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <StyledLink to="/login" className="button is-primary is-outlined" mr={2}>
                  <span>{t('menu.login')}</span>
                </StyledLink>
                <StyledLink display={["none !important", 'inline-flex !important']} to="/extension" className="button is-primary" mr={2} >
                  <span>{t('menu.extension')}</span>
                </StyledLink>
                <Link to="/signup" className="button is-primary">
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

Navbar.defaultProps = {
  hasMenuToggle: true
}

export default withTheme(
  connect(
    null,
    { toggleSidebar }
  )(withLoggedInUser(withNamespaces('main')(Navbar)))
)
