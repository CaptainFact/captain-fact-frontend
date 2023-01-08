import React from 'react'

import { updateUserInfo } from '../../API/http_api/current_user'
import i18n from '../../i18n/i18n'
import LanguageSelector from '../App/LanguageSelector'
import { withLoggedInUser } from './UserProvider'

/**
 * Updates the locale for loggedInUser, notify i18n to refresh the
 * interface.
 */
const UserLanguageSelector = ({ isAuthenticated, updateLoggedInUser, className, size }) => {
  return (
    <LanguageSelector
      className={className}
      value={i18n.language}
      size={size}
      withIcon
      handleChange={(locale) => {
        i18n.changeLanguage(locale)
        if (isAuthenticated) {
          return updateUserInfo({ locale }).then((user) => {
            updateLoggedInUser(user)
          })
        }
      }}
    />
  )
}

export default withLoggedInUser(UserLanguageSelector)
