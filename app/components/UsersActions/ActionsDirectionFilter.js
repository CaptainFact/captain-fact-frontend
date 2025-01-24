import React from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/css-utils'

import { TabsList, TabsTrigger } from '../ui/tabs'
import UserAppellation from '../Users/UserAppellation'

const ActionsDirectionFilter = ({ user, value }) => {
  const baseLink = `/u/${user.username}`
  const getLinkProps = (filterValue) => ({
    className: cn('text-black hover:text-black'),
    to: filterValue === 'ALL' ? baseLink : `${baseLink}?direction=${filterValue}`,
  })

  return (
    <TabsList value={value}>
      <Link {...getLinkProps('ALL')}>
        <TabsTrigger value="ALL">
          <Trans i18nKey="history:actionDirection.all">All</Trans>
        </TabsTrigger>
      </Link>
      <Link {...getLinkProps('AUTHOR')}>
        <TabsTrigger value="AUTHOR">
          <Trans i18nKey="history:actionDirection.authored" parent="span">
            From&nbsp;
            <UserAppellation defaultComponent="span" user={user} compact withoutActions />
          </Trans>
        </TabsTrigger>
      </Link>
      <Link {...getLinkProps('TARGET')}>
        <TabsTrigger value="TARGET">
          <Trans i18nKey="history:actionDirection.target" parent="span">
            Targeting&nbsp;
            <UserAppellation defaultComponent="span" user={user} compact withoutActions />
          </Trans>
        </TabsTrigger>
      </Link>
    </TabsList>
  )
}

export default ActionsDirectionFilter
