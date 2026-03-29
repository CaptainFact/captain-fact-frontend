import React, { createContext, useContext, useEffect, useState } from 'react'

import { ONLY_FEATURED, SUPPORTED_LOCALES, TABLET_WIDTH_THRESHOLD } from '../constants'
import browserLocale from '../i18n/browser_locale'
import i18n from '../i18n/i18n'
import { getFromLocalStorage, LOCAL_STORAGE_KEYS, setLocalStorage } from '../lib/local_storage'

const loadPreferences = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= TABLET_WIDTH_THRESHOLD

  const defaultPreferences = {
    // Disable autoscroll and sidebar expended by default on mobile
    sidebarExpended: !isMobile,
    locale: browserLocale(),
    enableAutoscroll: !isMobile,
    enableSoundOnBackgroundFocus: true,
    videosLanguageFilter: null,
    videosFilter: ONLY_FEATURED,
  }

  let localStoragePrefs = {}
  try {
    // Load preferences from localStorage
    const stored = getFromLocalStorage(LOCAL_STORAGE_KEYS.PREFERENCES)
    if (stored) {
      localStoragePrefs = JSON.parse(stored)
    }
  } catch {
    // Or from default if it fails
    setLocalStorage(LOCAL_STORAGE_KEYS.PREFERENCES, JSON.stringify(defaultPreferences))
    localStoragePrefs = { locale: browserLocale() }
  }
  // Merge with defaults
  const preferences = { ...defaultPreferences, ...localStoragePrefs }
  // Ensure the locale is valid, use the default otherwise
  if (!SUPPORTED_LOCALES.includes(preferences.locale)) {
    preferences.locale = browserLocale()
  }
  return preferences
}

const UserPreferencesContext = createContext(null)

export const UserPreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(() => loadPreferences())

  // Sync to localStorage whenever preferences change
  useEffect(() => {
    setLocalStorage(LOCAL_STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences))
  }, [preferences])

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const toggleAutoscroll = () => {
    setPreferences((prev) => ({ ...prev, enableAutoscroll: !prev.enableAutoscroll }))
  }

  const toggleBackgroundSound = () => {
    setPreferences((prev) => ({
      ...prev,
      enableSoundOnBackgroundFocus: !prev.enableSoundOnBackgroundFocus,
    }))
  }

  const toggleSidebar = () => {
    setPreferences((prev) => ({ ...prev, sidebarExpended: !prev.sidebarExpended }))
  }

  const closeSidebar = () => {
    setPreferences((prev) => ({ ...prev, sidebarExpended: false }))
  }

  const changeLocale = (locale) => {
    if (SUPPORTED_LOCALES.includes(locale)) {
      setPreferences((prev) => ({ ...prev, locale }))
      i18n.changeLanguage(locale)
    }
  }

  // Sync locale changes to i18n
  useEffect(() => {
    if (preferences.locale && i18n.language !== preferences.locale) {
      i18n.changeLanguage(preferences.locale)
    }
  }, [preferences.locale])

  const changeVideosLanguageFilter = (filter) => {
    setPreferences((prev) => ({ ...prev, videosLanguageFilter: filter }))
  }

  const setVideosFilter = (filter) => {
    setPreferences((prev) => ({ ...prev, videosFilter: filter }))
  }

  const value = {
    ...preferences,
    toggleAutoscroll,
    toggleBackgroundSound,
    toggleSidebar,
    closeSidebar,
    changeLocale,
    changeVideosLanguageFilter,
    setVideosFilter,
    updatePreference,
  }

  return <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>
}

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext)
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider')
  }
  return context
}
