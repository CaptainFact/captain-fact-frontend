import React from "react"
import { translate } from 'react-i18next'
import classNames from 'classnames'

import UserAppellation from "../Users/UserAppellation"
import { TimeSince } from '../Utils/index'
import Tag from '../Utils/Tag'
import ActionDiff from './ActionDiff'
import ActionIcon from './ActionIcon'


@translate('history')
export class UserAction extends React.PureComponent {
  render() {
    const { action, className, t } = this.props
    const { user, type, entity, time } = action

    return (
      <div className={ classNames(className, 'user-action', 'card') }>
        <div className="card-content action-description">
          <Tag type="info"><TimeSince time={ time }/></Tag>
          <Tag className="action-type" type="info">
            <ActionIcon type={type}/>
          </Tag>
          <UserAppellation user={user}/>
          <span className="action-name">
            <strong>{ t(`action.${type}`) }</strong>
          </span>
          <span className="entity-type">
            { t(`this.${entity}`) }
          </span>
        </div>
        <ActionDiff action={action}/>
      </div>
    )
  }
}
