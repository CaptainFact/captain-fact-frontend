import HttpApi from '.'

/** Update user with given changes. Returns the updated user */
export const updateUserInfo = userParams => {
  return HttpApi.put('users/me', userParams)
}

/** Unlocks an achievement that is not protected */
export const unlockPublicAchievement = achievementId => {
  return HttpApi.put(`users/me/achievements/${achievementId}`, achievementId)
}

/** Sign in, then returns an object like {user, token} */
export const signIn = (provider, userParams) => {
  return HttpApi.post(`auth/${provider}/callback`, userParams)
}

/** Register user via identity provider. Use signIn for other providers. */
export const signUp = (userParams, invitationToken) => {
  return HttpApi.post('users', { user: userParams, invitation_token: invitationToken })
}

/** Unlink a third-party account. */
export const unlinkProvider = provider => {
  return HttpApi.delete(`auth/${provider}/link`)
}

/** Request a password reset for given email */
export const resetPasswordRequest = email => {
  return HttpApi.post('users/reset_password/request', { email })
}

/** Check a forgotten password token, returns the user if the token is valid */
export const resetPasswordVerify = confirmToken => {
  return HttpApi.get(`users/reset_password/verify/${confirmToken}`)
}

/** Update user password using forgotten password token */
export const resetPasswordConfirm = (confirmToken, newPassword) => {
  return HttpApi.post('users/reset_password/confirm', {
    token: confirmToken,
    password: newPassword
  })
}

/** Confirm user email */
export const confirmEmail = token => {
  return HttpApi.put(`users/me/confirm_email/${token}`)
}

/** Delete user account (dangerous!) */
export const deleteUserAccount = () => {
  return HttpApi.delete('users/me')
}

/** Request invitation */
export const requestInvitation = (email, locale) => {
  return HttpApi.post('users/request_invitation', { email, locale })
}
