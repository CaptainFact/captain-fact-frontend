import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { withRouter } from 'react-router'

import { UserCircle } from 'styled-icons/fa-regular/UserCircle'
import { Activity } from 'styled-icons/feather/Activity'
import { Settings } from 'styled-icons/feather/Settings'
import { Bell } from 'styled-icons/fa-solid/Bell'
import { Rss } from 'styled-icons/feather/Rss'
import { Videos } from 'styled-icons/boxicons-regular/Videos'

const BASE_LINKS = [
  { path: '', i18nKey: 'menu.profile', Icon: UserCircle },
  { path: '/videos', i18nKey: 'menu.addedVideos', Icon: Videos },
  { path: '/activity', i18nKey: 'menu.activity', Icon: Activity }
]

const AUTHENTICATED_LINKS = [
  { path: '/subscriptions', i18nKey: 'menu.subscriptions', Icon: Rss },
  { path: '/notifications', i18nKey: 'menu.notifications', Icon: Bell },
  { path: '/settings', i18nKey: 'menu.settings', Icon: Settings }
]

/**
 * Menu entries for user profile sections.
 */
const UserMenu = ({ t, isSelf, user, children, location }) => {
  const entries = !isSelf ? BASE_LINKS : [...BASE_LINKS, ...AUTHENTICATED_LINKS]
  return entries.map((entry, index) => {
    const route = `/u/${user.username}${entry.path}`
    const isActive = location.pathname === route
    return children({
      key: entry.path,
      Icon: entry.Icon,
      title: t(entry.i18nKey),
      route,
      isActive,
      index
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
  isSelf: PropTypes.bool
}

UserMenu.defaultProps = {
  isSelf: false
}

export default withNamespaces('main')(withRouter(UserMenu))
