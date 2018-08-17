import React from 'react'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import UserAppellation from '../Users/UserAppellation'
import { TimeSince } from '../Utils/index'
import Tag from '../Utils/Tag'
import ActionDiff from './ActionDiff'
import ActionIcon from './ActionIcon'
import { Icon } from '../Utils/Icon'
import EntityLink from './EntityLink'


const UserAction = ({ action, className, t, withoutUser }) => {
  const { user, type, entity, entityId, time, targetUser, context } = action

  return (
    <div className={classNames(className, 'user-action', 'card')}>
      <div className="card-content action-description">
        <Tag type="info">
          <Icon name="clock-o"/>
          &nbsp;
          <TimeSince time={time}/>
        </Tag>
        <Tag className="action-type" type="info">
          <ActionIcon type={type}/>
        </Tag>
        {!withoutUser && <UserAppellation user={user}/>}
        <span className="action-name">
          <strong>
            { t('madeAction', {action: `$t(action.${type})`}) }
          </strong>
        </span>
        <span className="entity-type">
          <EntityLink entity={entity} entityId={entityId} context={context} />
        </span>
        {targetUser
          && <span>de <UserAppellation user={targetUser}/></span>
        }
      </div>
      <ActionDiff action={action}/>
    </div>
  )
}

export default translate('history')(UserAction)
