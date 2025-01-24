import { ChevronDown, ChevronUp, Clock } from 'lucide-react'
import React from 'react'
import { Trans, withTranslation } from 'react-i18next'

import { cn } from '@/lib/css-utils'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import UserAppellation from '../Users/UserAppellation'
import { TimeSince } from '../Utils/TimeSince'
import ActionDiff from './ActionDiff'
import ActionEntityLink from './ActionEntityLink'
import ActionIcon from './ActionIcon'
import ReputationChangeTag from './ReputationChangeTag'

const getReputationChange = (viewingFrom, action) => {
  if (!viewingFrom) {
    return null
  } else if (viewingFrom.id === action.userId) {
    return action.authorReputationChange
  } else if (viewingFrom.id === action.targetUserId) {
    return action.targetReputationChange
  }
}

const getActionDescription = (t, action, viewingFrom) => {
  const isSystemAction = !action.userId
  const isTarget = viewingFrom && viewingFrom.id === action.targetUserId
  if (isSystemAction) {
    return t(`action.${action.type}`)
  } else if (isTarget && viewingFrom.id === action.userId) {
    const i18nAction = t(`action.${action.type}`) || action.type
    return (
      <Trans t={t} i18nKey="ownAction">
        {{ action: i18nAction }}: <ActionEntityLink action={action} />
      </Trans>
    )
  } else if (isTarget) {
    const i18nAction = t(`actionTarget.${action.type}`) || action.type
    return (
      <Trans t={t} i18nKey="targetedByAction">
        {{ action: i18nAction }} from <UserAppellation user={action.user} /> on{' '}
        <ActionEntityLink action={action} />
      </Trans>
    )
  } else if (!action.targetUser) {
    const i18nAction = t(`action.${action.type}`) || action.type
    return (
      <Trans t={t} i18nKey="authoredActionWithoutTarget">
        {{ action: i18nAction }} <ActionEntityLink action={action} />{' '}
      </Trans>
    )
  } else {
    const i18nAction = t(`action.${action.type}`) || action.type
    return (
      <Trans t={t} i18nKey="authoredActionWithTarget">
        {{ action: i18nAction }} <ActionEntityLink action={action} /> from{' '}
        <UserAppellation user={action.targetUser} />
      </Trans>
    )
  }
}

const UserAction = ({
  action,
  className,
  t,
  withoutUser,
  viewingFrom,
  defaultExpanded = false,
}) => {
  const [isExpanded, setExpanded] = React.useState(defaultExpanded)
  const { user, type, time } = action
  const reputationChange = getReputationChange(viewingFrom, action)

  return (
    <div className={cn(className, 'bg-white rounded-lg shadow-sm p-4 border-b')}>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline">
          <Clock size={12} />
          <span className="ml-1">
            <TimeSince time={time} />
          </span>
        </Badge>

        <Badge variant="outline">
          <ActionIcon type={type} size={12} />
        </Badge>

        {Boolean(reputationChange) && (
          <span className="inline-flex items-center">
            <ReputationChangeTag reputation={reputationChange} withIcon />
          </span>
        )}

        {!withoutUser && <UserAppellation user={user} />}

        <span className="text-gray-700">{getActionDescription(t, action, viewingFrom)}</span>

        {Boolean(action.changes && action.changes.size) && (
          <Button
            size="xs"
            variant="outline"
            onClick={() => setExpanded(!isExpanded)}
            className="ml-auto"
            title="Expand"
          >
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 border-t pt-4">
          <ActionDiff action={action} />
        </div>
      )}
    </div>
  )
}

export default withTranslation('history')(UserAction)
