import { Record } from 'immutable'
import { createAction, handleActions } from 'redux-actions'
import { MOBILE_WIDTH_THRESHOLD } from '../../constants'


export const toggleSidebar = createAction('USER_PREFERENCES/TOGGLE_SIDEBAR')
export const closeSidebar = createAction('USER_PREFERENCES/CLOSE_SIDEBAR')
export const changeLocale = createAction('USER_PREFERENCES/CHANGE_LOCALE')
export const changeVideosLanguageFilter = createAction('USER_PREFERENCES/CHANGE_VIDEOS_LANGUAGE_FILTER')
export const changeVideosPublisherFilter = createAction('USER_PREFERENCES/CHANGE_VIDEOS_PUBLISHER_FILTER')
export const toggleAutoscroll = createAction('STATEMENTS/TOGGLE_AUTOSCROLL')

export const browserLocale = () =>
  (window.navigator.userLanguage || window.navigator.language || 'en').split('-')[0].toLowerCase()

const isMobile = window.innerWidth <= MOBILE_WIDTH_THRESHOLD

const Preferences = new Record({
  // Disable autoscroll and sidebar expended by default on mobile
  sidebarExpended: !isMobile,
  locale: 'en',
  enableAutoscroll: !isMobile,
  videosLanguageFilter: null,
  videosPublisherFilter: 'All'
})

const loadState = () => {
  let localStoragePrefs = {}
  try {
    localStoragePrefs = JSON.parse(localStorage.preferences)
  } catch (e) {
    localStorage.preferences = JSON.stringify(Preferences())
    localStoragePrefs = {locale: browserLocale()}
  }
  return Preferences().merge(localStoragePrefs)
}

const updateState = (state, key, value) => {
  console.log('update ' + key + '  ' + value)
  state = state.set(key, value)
  localStorage.preferences = JSON.stringify(state.toJSON())
  console.log(state)
  return state
}

const UserPreferencesReducer = handleActions({
  [toggleSidebar]: state => updateState(state, 'sidebarExpended', !state.sidebarExpended),
  [closeSidebar]: state => updateState(state, 'sidebarExpended', false),
  [changeLocale]: (state, {payload}) => updateState(state, 'locale', payload),
  [changeVideosLanguageFilter]: (state, {payload}) => updateState(state, 'videosLanguageFilter', payload),
  [changeVideosPublisherFilter]: (state, {payload}) => updateState(state, 'videosPublisherFilter', payload),
  [toggleAutoscroll]: state => updateState(state, 'enableAutoscroll', !state.enableAutoscroll)
}, loadState())

export default UserPreferencesReducer