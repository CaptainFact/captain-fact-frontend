const errorsInfos = {
  not_enough_reputation: { url: '/help/privileges' },
  limit_reached: { url: '/help/privileges' },
  unauthenticated: { url: '/signup', i18nKey: 'menu.signup' },
  invalid_invitation_token: {
    url: '/signup',
    i18nKey: 'user:invitationOnlyTitle'
  }
}

export function getErrorInfo(message) {
  return errorsInfos[message]
}

export function tError(t, error) {
  return t([`errors:server.${error}`, `errors:client.${error}`, 'errors:server.unknown'])
}
