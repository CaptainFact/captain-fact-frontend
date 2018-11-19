import { Record } from 'immutable'
import { createAction, handleActions } from 'redux-actions'
import { ALL_VIDEOS, MOBILE_WIDTH_THRESHOLD } from '../../constants'
import browserLocale from '../../i18n/browser_locale'


export const toggleSidebar = createAction('USER_PREFERENCES/TOGGLE_SIDEBAR')
export const closeSidebar = createAction('USER_PREFERENCES/CLOSE_SIDEBAR')
export const changeLocale = createAction('USER_PREFERENCES/CHANGE_LOCALE')
export const changeVideosLanguageFilter = createAction('USER_PREFERENCES/CHANGE_VIDEOS_LANGUAGE_FILTER')
export const setVideosOnlyFromPartners = createAction('USER_PREFERENCES/VIDEOS_ONLY_FROM_PATNERS')
export const toggleAutoscroll = createAction('STATEMENTS/TOGGLE_AUTOSCROLL')
export const toggleBackgroundSound = createAction(
  'STATEMENTS/TOGGLE_BACKGROUND_SOUND'
)

const isMobile = window.innerWidth <= MOBILE_WIDTH_THRESHOLD

const Preferences = new Record({
  // Disable autoscroll and sidebar expended by default on mobile
  sidebarExpended: !isMobile,
  locale: 'en',
  enableAutoscroll: !isMobile,
  enableSoundOnBackgroundFocus: true,
  videosLanguageFilter: null,
  videosOnlyFromPartners: ALL_VIDEOS
})

const loadState = () => {
  let localStoragePrefs = {}
  try {
    localStoragePrefs = JSON.parse(localStorage.preferences)
  } catch (e) {
    localStorage.preferences = JSON.stringify(Preferences())
    localStoragePrefs = { locale: browserLocale() }
  }
  return Preferences().merge(localStoragePrefs)
}

const updateState = (state, key, value) => {
  state = state.set(key, value)
  localStorage.preferences = JSON.stringify(state.toJSON())
  return state
}

const UserPreferencesReducer = handleActions(
  {
    [toggleSidebar]: state => updateState(state, 'sidebarExpended', !state.sidebarExpended),
    [closeSidebar]: state => updateState(state, 'sidebarExpended', false),
    [changeLocale]: (state, { payload }) => updateState(state, 'locale', payload),
    [changeVideosLanguageFilter]: (state, { payload }) => updateState(state, 'videosLanguageFilter', payload),
    [setVideosOnlyFromPartners]: (state, { payload }) => updateState(state, 'videosOnlyFromPartners', payload),
    [toggleAutoscroll]: state => updateState(state, 'enableAutoscroll', !state.enableAutoscroll),
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
