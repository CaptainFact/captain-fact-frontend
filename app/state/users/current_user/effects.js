import HttpApi from '../../../API/http_api'
import { set as setCurrentUser, setLoading, reset } from './reducer'
import { setUser as setDisplayedUser } from '../displayed_user/reducer'
import { createEffect } from '../../utils'


// ---- Public API ----

// Auth / register / login functions

export const authenticate = () => dispatch => {
  if (!HttpApi.hasToken)
    return null
  dispatch(setLoading(true))
  dispatch(setCurrentUser(HttpApi.get('auth').catch(error => {
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
  HttpApi.post('auth/request_invitation', user)
)

// Update user

export const updateInfo = user => createEffect(
  HttpApi.put("users/me", user), {
    before: setLoading(true),
    then: user => (dispatch, getState) => {
      if (getState().DisplayedUser.data.id === user.id)
        dispatch(setDisplayedUser(user))
      return user
    },
    after: setCurrentUser
  }
)

// Confirm email

export const confirmEmail = token =>
  createEffect(HttpApi.put(`users/me/confirm_email/${token}`))

// Reset password

export const resetPasswordRequest = ({email}) =>
  createEffect(HttpApi.post('auth/reset_password/request', {email}))

export const resetPasswordVerify = token =>
  createEffect(HttpApi.get(`auth/reset_password/verify/${token}`))

export const resetPasswordConfirm = ({password, token}) =>
  createEffect(HttpApi.post('auth/reset_password/confirm', {password, token}))

// Logout / delete

export const logout = () =>
  resetUser(HttpApi.delete("auth"))

export const deleteAccount = () =>
  resetUser(HttpApi.delete("users/me"))


// ---- Private functions ----

const userConnect = promise => createEffect(
  promise, {
    before: setLoading(true),
    then: ({token, user}) => () => {
      HttpApi.setAuthorizationToken(token)
      return user
    },
    after: setCurrentUser
  }
)

const resetUser = promise => createEffect(
  promise, {
    before: setLoading(true),
    then: () => () => HttpApi.resetToken(),
    after: reset
  }
)