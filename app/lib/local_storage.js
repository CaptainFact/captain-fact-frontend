/**
 * A map of keys used for local storage.
 */
export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  LOGGED_IN_USER: 'loggedInUser',
  PREFERENCES: 'preferences',
  DISMISS_ADD_VIDEO_INTRODUCTION: 'dismissAddVideoIntroduction',
  DISMISS_FRENCH_NEWS_SUBSCRIPTION: 'dismissFrenchNewsSubscription',
  DISMISS_VIDEO_INTRODUCTION: 'dismissVideoHelp',
  DISMISS_SPEAKER_INTRODUCTION: 'dismissSpeakerIntroduction',
}

/**
 * A helper to get a value from localStorage.
 * Returns the value, or null if no value exists or if storage is unavailable.
 */
export const getFromLocalStorage = (key, defaultValue) => {
  try {
    const value = window.localStorage.getItem(key)
    return typeof value === 'undefined' ? defaultValue : value
  } catch (e) {
    return defaultValue
  }
}

/**
 * A helper to set a value in localStorage.
 * Ignores errors about full, disallowed or unsupported storage.
 */
export const setLocalStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, value)
  } catch (e) {
    // Ignore errors
  }
}

/**
 * A helper to remove an entry in localStorage.
 * Ignores errors about full, disallowed or unsupported storage.
 */
export const removeFromLocalStorage = (key) => {
  try {
    window.localStorage.removeItem(key)
  } catch (e) {
    // Ignore errors
  }
}
