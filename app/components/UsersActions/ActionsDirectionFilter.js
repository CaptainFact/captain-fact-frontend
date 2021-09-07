import React from 'react'
import { Trans, withNamespaces } from 'react-i18next'
import UserAppellation from '../Users/UserAppellation'
import { Link } from 'react-router'

const ActionsDirectionFilter = ({ user, value, t }) => {
  const baseLink = `/u/${user.username}/activity`
  const getLinkProps = (filterValue) => ({
    className: filterValue === value ? 'is-active' : '',
    to: filterValue === 'ALL' ? baseLink : `${baseLink}?direction=${filterValue}`,
  })

  return (
    <div className="panel-tabs">
      <Link {...getLinkProps('ALL')}>{t('actionDirection.all')}</Link>
      <Link {...getLinkProps('AUTHOR')}>
        <Trans i18nKey="actionDirection.authored">
          From <UserAppellation defaultComponent="span" user={user} compact withoutActions />
        </Trans>
      </Link>
      <Link {...getLinkProps('TARGET')}>
        <Trans i18nKey="actionDirection.target">
          Targeting <UserAppellation defaultComponent="span" user={user} compact withoutActions />
        </Trans>
      </Link>
    </div>
  )
}

export default withNamespaces('history')(ActionsDirectionFilter)
