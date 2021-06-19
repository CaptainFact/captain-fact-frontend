import { Record } from 'immutable'
import { createAction, handleActions } from 'redux-actions'
import { MOBILE_WIDTH_THRESHOLD, SUPPORTED_LOCALES, ONLY_FEATURED } from '../../constants'
import browserLocale from '../../i18n/browser_locale'
import { setLocalStorage, LOCAL_STORAGE_KEYS, getFromLocalStorage } from '../../lib/local_storage'

export const toggleSidebar = createAction('USER_PREFERENCES/TOGGLE_SIDEBAR')
export const closeSidebar = createAction('USER_PREFERENCES/CLOSE_SIDEBAR')
export const changeLocale = createAction('USER_PREFERENCES/CHANGE_LOCALE')
export const changeVideosLanguageFilter = createAction(
  'USER_PREFERENCES/CHANGE_VIDEOS_LANGUAGE_FILTER'
)
export const setVideosFilter = createAction('USER_PREFERENCES/SET_VIDEOS_FILTER')
export const toggleAutoscroll = createAction('STATEMENTS/TOGGLE_AUTOSCROLL')
export const toggleBackgroundSound = createAction('STATEMENTS/TOGGLE_BACKGROUND_SOUND')
export const commentedStatmentsFilter = createAction('USER_PREFERENCES/COMMENTED_STATEMENTS_FILTER')

const isMobile = window.innerWidth <= MOBILE_WIDTH_THRESHOLD

const Preferences = new Record({
  // Disable autoscroll and sidebar expended by default on mobile
  sidebarExpended: !isMobile,
  locale: browserLocale(),
  enableAutoscroll: !isMobile,
  enableSoundOnBackgroundFocus: true,
  videosLanguageFilter: null,
  videosFilter: ONLY_FEATURED,
  commentedStatements: true,
})

const loadState = () => {
  let localStoragePrefs = {}
  try {
    // Load preferences from localStorage
    localStoragePrefs = JSON.parse(getFromLocalStorage(LOCAL_STORAGE_KEYS.PREFERENCES))
  } catch (e) {
    // Or from default if it fails
    setLocalStorage(LOCAL_STORAGE_KEYS.PREFERENCES, JSON.stringify(Preferences()))
    localStoragePrefs = { locale: browserLocale() }
  }
  // Ensure the locale is valid, use the default otherwise
  const preferences = Preferences().merge(localStoragePrefs)
  if (!SUPPORTED_LOCALES.includes(preferences.locale)) {
    return preferences.set('locale', browserLocale())
  }
  return preferences
}

const updateState = (state, key, value) => {
  state = state.set(key, value)
  setLocalStorage(LOCAL_STORAGE_KEYS.PREFERENCES, JSON.stringify(state.toJSON()))
  return state
}

const UserPreferencesReducer = handleActions(
  {
    [toggleSidebar]: (state) => updateState(state, 'sidebarExpended', !state.sidebarExpended),
    [closeSidebar]: (state) => updateState(state, 'sidebarExpended', false),
    [changeLocale]: (state, { payload }) => updateState(state, 'locale', payload),
    [changeVideosLanguageFilter]: (state, { payload }) =>
      updateState(state, 'videosLanguageFilter', payload),
    [setVideosFilter]: (state, { payload }) => updateState(state, 'videosFilter', payload),
    [toggleAutoscroll]: (state) => updateState(state, 'enableAutoscroll', !state.enableAutoscroll),
    [toggleBackgroundSound]: (state) => {
      return updateState(state, 'enableSoundOnBackgroundFocus', !state.enableSoundOnBackgroundFocus)
    },
    [commentedStatmentsFilter]: (state, { payload }) => updateState(state, 'commentedStatements', payload)
  },
  loadState()
)

export default UserPreferencesReducer
