import { Record } from 'immutable'
import { createAction, handleActions } from 'redux-actions'
import { ALL_VIDEOS, MOBILE_WIDTH_THRESHOLD, SUPPORTED_LOCALES } from '../../constants'
import browserLocale from '../../i18n/browser_locale'

export const toggleSidebar = createAction('USER_PREFERENCES/TOGGLE_SIDEBAR')
export const closeSidebar = createAction('USER_PREFERENCES/CLOSE_SIDEBAR')
export const changeLocale = createAction('USER_PREFERENCES/CHANGE_LOCALE')
export const changeVideosLanguageFilter = createAction(
  'USER_PREFERENCES/CHANGE_VIDEOS_LANGUAGE_FILTER'
)
export const setVideosOnlyFromPartners = createAction(
  'USER_PREFERENCES/VIDEOS_ONLY_FROM_PATNERS'
)
export const toggleAutoscroll = createAction('STATEMENTS/TOGGLE_AUTOSCROLL')
export const toggleBackgroundSound = createAction('STATEMENTS/TOGGLE_BACKGROUND_SOUND')

const Preferences = new Record({
  sidebarExpended: false,
  locale: 'en',
  enableAutoscroll: true,
  enableSoundOnBackgroundFocus: true,
  videosLanguageFilter: null,
  videosOnlyFromPartners: ALL_VIDEOS
})

const loadState = () => {
  let localStoragePrefs = {}
  try {
    // Load preferences from localStorage
    localStoragePrefs = JSON.parse(localStorage.preferences)
  } catch (e) {
    // Or from default if it fails
    if (typeof localStorage !== 'undefined') {
      localStorage.preferences = JSON.stringify(Preferences())
    }
    localStoragePrefs = { locale: browserLocale() }
  }

  // Disable autoscroll and sidebar expended by default on mobile
  const defaults = {}
  if (typeof window !== 'undefined') {
    const isMobile = window.innerWidth <= MOBILE_WIDTH_THRESHOLD
    defaults.sidebarExpended = !isMobile
    defaults.enableAutoscroll = !isMobile
  }

  const preferences = Preferences()
    .merge(defaults)
    .merge(localStoragePrefs)

  // Ensure the locale is valid, use the default otherwise
  if (!SUPPORTED_LOCALES.includes(preferences.locale)) {
    return preferences.set('locale', browserLocale())
  }
  return preferences
}

const updateState = (state, key, value) => {
  state = state.set(key, value)
  if (typeof localStorage !== 'undefined') {
    localStorage.preferences = JSON.stringify(state.toJSON())
  }
  return state
}

const UserPreferencesReducer = handleActions(
  {
    [toggleSidebar]: state =>
      updateState(state, 'sidebarExpended', !state.sidebarExpended),
    [closeSidebar]: state => updateState(state, 'sidebarExpended', false),
    [changeLocale]: (state, { payload }) => updateState(state, 'locale', payload),
    [changeVideosLanguageFilter]: (state, { payload }) =>
      updateState(state, 'videosLanguageFilter', payload),
    [setVideosOnlyFromPartners]: (state, { payload }) =>
      updateState(state, 'videosOnlyFromPartners', payload),
    [toggleAutoscroll]: state =>
      updateState(state, 'enableAutoscroll', !state.enableAutoscroll),
    [toggleBackgroundSound]: state => {
      return updateState(
        state,
        'enableSoundOnBackgroundFocus',
        !state.enableSoundOnBackgroundFocus
      )
    }
  },
  loadState()
)

export default UserPreferencesReducer
