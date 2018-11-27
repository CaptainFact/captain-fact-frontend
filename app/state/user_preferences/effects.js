import { updateInfo } from '../users/current_user/effects'
import { changeLocale } from './reducer'
import { isAuthenticated } from '../users/current_user/selectors'

const currentUserLocale = state => state.CurrentUser.data.locale

export const fetchLocale = locale => (dispatch, getState) => {
  const state = getState()
  if (isAuthenticated(state) && locale && currentUserLocale(state) !== locale)
    dispatch(updateInfo({ locale }))
  dispatch(changeLocale(locale))
}
