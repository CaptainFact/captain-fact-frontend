import React from 'react'

import { updateUserInfo } from '../../API/http_api/current_user'
import i18n from '../../i18n/i18n'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import LanguageSelector from '../App/LanguageSelector'
import { withLoggedInUser } from './UserProvider'

/**
 * Updates the locale for loggedInUser, notify i18n to refresh the
 * interface.
 */
const UserLanguageSelector = ({ isAuthenticated, updateLoggedInUser, className, size }) => {
  const { locale, changeLocale } = useUserPreferences()

  return (
    <LanguageSelector
      className={className}
      value={locale || i18n.language}
      size={size}
      withIcon
      handleChange={(locale) => {
        changeLocale(locale)
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
