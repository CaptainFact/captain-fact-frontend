import HttpApi from '../../../API/http_api'
import { set as setCurrentUser, setLoading, reset, setPosting, userLogin } from './reducer'
import { setUser as setDisplayedUser } from '../displayed_user/reducer'
import { createEffect } from '../../utils'


// ---- Public API ----

// Auth / register / login functions

export const fetchCurrentUser = () => (dispatch, getState) => {
  if (!HttpApi.hasToken)
    return null
  dispatch(setLoading(true))
  dispatch(setCurrentUser(HttpApi.get('users/me').then(r => {
    // Save user locale on server when authenticating if not already set
    if (r.locale === null)
      dispatch(updateInfo({locale: getState().UserPreferences.locale}))
    return r
  }).catch(error => {
    if (error === 'unauthorized') // Token expired
      HttpApi.resetToken()
    throw error
  })
  ))
}

export const register = ({user, invitation_token}) =>
  userConnect(HttpApi.post('users', {user, invitation_token}))

export const login = ({provider, params}) =>
  userConnect(HttpApi.post(`auth/${provider}/callback`, params))

// Ask for an invitation

export const requestInvitation = user => createEffect(
  HttpApi.post('users/request_invitation', user)
)

// Update user

export const updateInfo = user => createEffect(
  HttpApi.put('users/me', user), {
    before: setPosting(true),
    then: updatedUser => (dispatch, getState) => {
      if (getState().DisplayedUser.data.id === updatedUser.id)
        dispatch(setDisplayedUser(updatedUser))
      return updatedUser
    },
    after: [setPosting(false), setCurrentUser]
  }
)

export const unlinkProvider = provider => createEffect(
  HttpApi.delete(`auth/${provider}/link`), {
    before: setPosting(true),
    then: user => (dispatch, getState) => {
      if (getState().DisplayedUser.data.id === user.id)
        dispatch(setDisplayedUser(user))
      return user
    },
    after: userLogin
  }
)

// Confirm email

export const confirmEmail = token =>
  createEffect(HttpApi.put(`users/me/confirm_email/${token}`))

// Reset password

export const resetPasswordRequest = ({email}) =>
  createEffect(HttpApi.post('users/reset_password/request', {email}))

export const resetPasswordVerify = token =>
  createEffect(HttpApi.get(`users/reset_password/verify/${token}`))

export const resetPasswordConfirm = ({password, token}) =>
  createEffect(HttpApi.post('users/reset_password/confirm', {password, token}))

// Logout / delete

export const logout = () =>
  resetUser(HttpApi.delete('auth'))

export const deleteAccount = () =>
  resetUser(HttpApi.delete('users/me'))

// Achievements
export const unlockPublicAchievement = achievementId => createEffect(
  HttpApi.put(`users/me/achievements/${achievementId}`, achievementId), {
    then: user => (dispatch, getState) => {
      if (getState().DisplayedUser.data.id === user.id)
        dispatch(setDisplayedUser(user))
      dispatch(setCurrentUser(user))
      return user
    },
  }
)

// ---- Private functions ----

const userConnect = promise => createEffect(
  promise, {
    before: setPosting(true),
    then: ({token, user}) => () => {
      HttpApi.setAuthorizationToken(token)
      return user
    },
    after: userLogin
  }
)

const resetUser = promise => createEffect(
  promise, {
    before: setLoading(true),
    then: () => () => HttpApi.resetToken(),
    after: reset
  }
)
