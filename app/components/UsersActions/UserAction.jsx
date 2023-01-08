import { Box } from '@rebass/grid'
import classNames from 'classnames'
import React from 'react'
import { Trans, withNamespaces } from 'react-i18next'

import UserAppellation from '../Users/UserAppellation'
import Button from '../Utils/Button'
import { Icon } from '../Utils/Icon'
import { TimeSince } from '../Utils/index'
import Tag from '../Utils/Tag'
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

const UserAction = ({ action, className, t, withoutUser, viewingFrom }) => {
  const [isExpanded, setExpanded] = React.useState(false)
  const { user, type, time } = action
  const reputationChange = getReputationChange(viewingFrom, action)

  return (
    <div className={classNames(className, 'user-action', 'card')}>
      <div className="card-content action-description">
        <Tag type="info">
          <Icon name="clock-o" />
          &nbsp;
          <TimeSince time={time} />
        </Tag>
        <Tag className="action-type" type="info">
          <ActionIcon type={type} />
        </Tag>
        {Boolean(reputationChange) && (
          <Box css={{ display: 'inline-block' }}>
            <ReputationChangeTag reputation={reputationChange} withIcon />
            &nbsp;
          </Box>
        )}
        {!withoutUser && <UserAppellation user={user} />}
        <span className="action-description">{getActionDescription(t, action, viewingFrom)}</span>
        {Boolean(action.changes && action.changes.size) && (
          <Button
            className="is-small"
            onClick={() => setExpanded(!isExpanded)}
            css={{ float: 'right', borderRadius: '100%' }}
            title="Expand"
          >
            +
          </Button>
        )}
      </div>
      {isExpanded && <ActionDiff action={action} />}
    </div>
  )
}

export default withNamespaces('history')(UserAction)
