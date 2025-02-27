import 'react'

import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { withRouter } from 'react-router'
import { Videos } from 'styled-icons/boxicons-solid'
import { UserCircle } from 'styled-icons/fa-regular'
import { Bell } from 'styled-icons/fa-solid'
import { Activity, LogOut, Rss, Settings } from 'styled-icons/feather'

const BASE_LINKS = [
  { path: '', i18nKey: 'menu.activity', Icon: Activity },
  { path: '/videos', i18nKey: 'menu.addedVideos', Icon: Videos },
  { path: '/profile', i18nKey: 'menu.profile', Icon: UserCircle },
]

const AUTHENTICATED_LINKS = [
  { path: '/subscriptions', i18nKey: 'menu.subscriptions', Icon: Rss },
  { path: '/notifications', i18nKey: 'menu.notifications', Icon: Bell },
  { path: '/settings', i18nKey: 'menu.settings', Icon: Settings },
]

/**
 * Menu entries for user profile sections.
 */
const UserMenu = ({ t, isSelf, user, children, location, hasLogout }) => {
  const entries = !isSelf ? BASE_LINKS : [...BASE_LINKS, ...AUTHENTICATED_LINKS]

  if (hasLogout) {
    entries.push({
      path: '/logout',
      isRootPath: true,
      i18nKey: 'menu.logout',
      Icon: LogOut,
    })
  }

  return entries.map((entry, index) => {
    const route = entry.isRootPath ? entry.path : `/u/${user.username}${entry.path}`
    const isActive = location.pathname === route
    return children({
      key: entry.path,
      Icon: entry.Icon,
      title: t(entry.i18nKey),
      route,
      isActive,
      index,
    })
  })
}

UserMenu.propTypes = {
  /** User */
  user: PropTypes.shape({ username: PropTypes.string.isRequired }).isRequired,
  /**
   * A render function used to render a single item.
   *
   * Gets passed an object like:
   *
   *    - key: A unique key for this entry. You **must** set the `key` prop if
   *      rendering a React component.
   *    - Icon
   *    - title
   *    - link
   *    - isActive
   */
  children: PropTypes.func.isRequired,
  /** Wether we're displaying the menu for currently logged in user */
  isSelf: PropTypes.bool,
  /** Logout */
  hasLogout: PropTypes.bool,
}

UserMenu.defaultProps = {
  isSelf: false,
}

export default withTranslation('main')(withRouter(UserMenu))
