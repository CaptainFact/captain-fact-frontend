import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/css-utils'

const UserAppellation = ({
  t,
  user,
  withoutActions = false,
  compact = false,
  defaultComponent = 'div',
}) => {
  const name = user && user.name
  const prettyUsername = user ? `@${user.username}` : t('deletedAccount')
  const hasLink = user && !withoutActions
  const Component = hasLink ? Link : defaultComponent
  const componentProps = hasLink ? { to: `/u/${user.username}`, rel: 'nofollow' } : {}
  const className = cn('', { deleted: !user }) // TODO(!!!): remove class 'deleted' from here

  if (compact) {
    return (
      <Component {...componentProps} className={className} title={name}>
        {prettyUsername}
      </Component>
    )
  }
  return (
    <Component {...componentProps} className={className} data-cy="user-appellation">
      <strong>{name || prettyUsername}</strong>
      {name && <small> {prettyUsername}</small>}
    </Component>
  )
}

export default withTranslation('user')(UserAppellation)
