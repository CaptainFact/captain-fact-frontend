const errorsInfos = {
  not_enough_reputation: {
    url: '/help/privileges',
    i18nKey: 'errors:server.not_enough_reputation',
  },
  limit_reached: {
    url: '/help/privileges',
    i18nKey: 'errors:server.limit_reached',
  },
  unauthenticated: {
    url: '/signup',
    i18nKey: 'menu.signup',
  },
  invalid_invitation_token: {
    url: '/signup',
    i18nKey: 'user:invitationOnlyTitle',
  },
  comment_text_contains_url: {
    i18nKey: 'errors:server.comment_text_contains_url',
  },
}

/**
 * Maps noisy server/GraphQL error strings to stable keys understood by {@link getErrorInfo}.
 * E.g. Absinthe may stringify an Ecto.InvalidChangesetError that still embeds the real message.
 */
export function normalizeServerErrorMessage(message) {
  if (typeof message !== 'string') {
    return message
  }
  const lower = message.toLowerCase()
  if (lower.includes('cannot contain urls') && lower.includes('source field')) {
    return 'comment_text_contains_url'
  }
  return message
}

export function getErrorInfo(message) {
  return errorsInfos[message]
}

/**
 * Maps an ApolloError to a stable string key understood by {@link tError}.
 * Inspects graphQLErrors first, then falls back to the top-level message.
 */
export function getApolloErrorKey(apolloError) {
  if (!apolloError) {
    return 'unknown'
  }
  const message = apolloError?.graphQLErrors?.[0]?.message ?? apolloError?.message ?? ''
  const lower = message.toLowerCase()
  if (lower.includes("doesn't exist") || lower.includes('not found')) {
    return 'not_found'
  }
  return 'unknown'
}

export function tError(t, error) {
  return t([`errors:server.${error}`, `errors:client.${error}`, 'errors:server.unknown'])
}
