import React from "react"
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import titleCase from 'voca/title_case'
import UserAppellation from "../Users/UserAppellation"
import { TimeSince, Icon } from '../Utils/index'
import Tag from '../Utils/Tag'
import { generateDiff } from '../../state/user_actions/reducer'
import { revertVideoDebateUserAction } from '../../state/video_debate/history/effects'
import { isAuthenticated } from '../../state/users/current_user/selectors'
import { flashErrorUnauthenticated } from '../../state/flashes/reducer'
import { ACTION_ADD, ACTION_CREATE, ACTION_DELETE, ACTION_REMOVE, ACTION_UPDATE } from '../../constants'
import { default as UserActionRecord } from '../../state/user_actions/record'


// @connect((state, props) => ({
//   diff: state.UsersActions.diffs.get(props.action.id),
//   speakers: state.VideoDebate.video.data.speakers,
//   isAuthenticated: isAuthenticated(state)
// }), {generateDiff, revertVideoDebateUserAction, flashErrorUnauthenticated})
@translate(['history', 'main'])
export class UserAction extends React.PureComponent {
  render() {
    const { action, className, t } = this.props
    const { user, type, entity, time } = action

    return (
      <div className={ classNames(className, 'user-action', 'card') }>
        <div className="card-content action-description">
          <Tag type="info"><TimeSince time={ time }/></Tag>
          { UserAction.getActionTag(type) }
          <UserAppellation user={user}/>
          <span className="action-name">
            <strong>{ t(`action.${type}`) }</strong>
          </span>
          <span className="entity-type">
            { t(`this.${entity}`) }
          </span>
        </div>
      </div>
    )
  }

  static getActionTag(type) {
    const actionsIcons = [
      "plus",     // Create
      "times",    // Remove
      "pencil",   // Update
      "times",    // Delete
      "plus",     // Add
      "undo"      // Restore
    ]
    if (type > actionsIcons.length)
      return null
    return (
      <Tag className="action-type" type="info">
        <Icon name={actionsIcons[type - 1]} size="mini"/>
      </Tag>
    )
  }
}

// try to remove later
UserAction.propTypes = {
  action: PropTypes.instanceOf(UserActionRecord).isRequired,
  isLatest: PropTypes.bool,
  className: PropTypes.string,
  /**
   * If set to true Restore, Approve and Flag buttons will not appear. Diff button always appear when available.
   */
  withoutActions: PropTypes.bool
}