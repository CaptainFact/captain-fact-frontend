import React from 'react'
import { Link } from 'react-router'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'

const UserAppellation = ({
  t,
  user,
  withoutActions = false,
  compact = false,
  defaultComponent = 'div'
}) => {
  const prettyUsername = user ? `@${user.username}` : t('deletedAccount')
  const hasLink = user && !withoutActions
  const Component = hasLink ? Link : defaultComponent
  const componentProps = hasLink ? { to: `/u/${user.username}` } : {}
  const className = classNames('user-appellation', { deleted: !user })

  if (compact)
    return (
      <Component {...componentProps} className={className} title={name}>
        {prettyUsername}
      </Component>
    )
  return (
    <Component {...componentProps} className={className}>
      <strong className="main-appelation">{user.name || prettyUsername}</strong>
      {user.name && <small className="secondary-appelation"> {prettyUsername}</small>}
    </Component>
  )
}

export default withNamespaces('user')(UserAppellation)
