import React from "react"
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import titleCase from '../../lib/title_case'
import UserAppellation from "../Users/UserAppellation"
import { TimeSince, Icon } from '../Utils/index'
import Tag from '../Utils/Tag'
import { generateDiff } from '../../state/user_actions/reducer'
import { revertVideoDebateUserAction } from '../../state/video_debate/history/effects'
import { isAuthenticated } from '../../state/users/current_user/selectors'
import { flashErrorUnauthenticated } from '../../state/flashes/reducer'
import { ACTION_ADD, ACTION_CREATE, ACTION_DELETE, ACTION_REMOVE, ACTION_UPDATE } from '../../constants'
import { default as UserActionRecord } from '../../state/user_actions/record'


@connect((state, props) => ({
  diff: state.UsersActions.diffs.get(props.action.id),
  speakers: state.VideoDebate.video.data.speakers,
  isAuthenticated: isAuthenticated(state)
}), {generateDiff, revertVideoDebateUserAction, flashErrorUnauthenticated})
@translate(['history', 'main'])
export class UserAction extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {isDiffing: false}
    this.revertAction = this.authenticatedAction(this.revertAction.bind(this))
  }

  render() {
    const { action, diff, className, t } = this.props
    const { user, type, entity, time } = action
    const actionButtons = this.renderActionsButtons()

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
        {actionButtons.length > 0 && <div className="action-buttons card-footer">{actionButtons}</div>}
        {this.state.isDiffing &&
        <div className="action-diff">
          { this.renderDiff(diff) }
        </div>
        }
      </div>
    )
  }

  renderActionsButtons() {
    const t = this.props.t
    let buttons = []
    if (this.canBeDiffed())
      buttons.push(
        <a key="diff" onClick={this.toggleDiff.bind(this)}>
          <Icon size="small" name="indent"/>
          <span>{ t(this.state.isDiffing ? 'compare_hide' : 'compare_show') } </span>
        </a>
      )
    if (!this.props.withoutActions) {
      const { isLatest, type } = this.props.action
      const reversible = isLatest && (type === ACTION_DELETE || type === ACTION_REMOVE)
      if (reversible)
        buttons.push(
          <a key="revert" onClick={this.revertAction}>
            <Icon size="small" name="undo"/>
            <span>Restore</span>
          </a>
        )
      buttons = buttons.concat([
        (
          <a key="approve" className="is-disabled">
            <Icon size="small" name="check"/><span>{t('main:actions.approve')}</span>
          </a>
        ),
        (
          <a key="flag" className="is-disabled">
            <Icon size="small" name="flag"/><span>{t('main:actions.flag')}</span>
          </a>
        )
      ])
    }
    return buttons
  }

  renderDiff(diff) {
    return (
      <div>
        {diff.entrySeq().map(([key, changes]) => (
          <div key={ key } className="diff-entry">
            <span className="diff-key">{ titleCase(UserAction.formatChangeKey(key)) }</span>
            <pre className="diff-view">
              { this.renderKeyDiff(key, changes) }
            </pre>
          </div>
        ))}
      </div>
    )
  }

  renderKeyDiff(key, changes) {
    // Value completely changed, show it like prev -> new
    if (changes.size === 2 && changes.first().removed && changes.last().added)
      return <div>
        <span className="removed">{ this.formatChangeValue(changes.first().value, key) }</span>,
        <span> -> </span>,
        <span className="added">{ this.formatChangeValue(changes.last().value, key) }</span>
      </div>
    // Generate a real diff
    return changes.map((change, idx) => (
      <span key={idx}
            className={ change.added ? 'added' : change.removed ? 'removed' : '' }>
        { this.formatChangeValue(change.value, key) }
      </span>
    ))
  }

  toggleDiff() {
    if (!this.state.isDiffing)
      this.props.generateDiff(this.props.action)
    this.setState({isDiffing: !this.state.isDiffing})
  }

  canBeDiffed() {
    return [ACTION_CREATE, ACTION_ADD, ACTION_UPDATE].includes(this.props.action.type)
  }

  authenticatedAction(func) {
    return () => {
      if (!this.props.isAuthenticated)
        this.props.flashErrorUnauthenticated()
      else
        return func()
    }
  }

  revertAction() {
    return this.props.revertVideoDebateUserAction(this.props.action)
  }

  formatChangeValue(value, key) {
    if (key === "speaker_id") {
      const speaker = this.props.speakers.find(s => s.id === value)
      return speaker ? `${speaker.full_name} (#${speaker.id})` : ""
    }
    return value
  }

  static formatChangeKey(key) {
    return key.replace('_id', '').replace('_', ' ')
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

UserAction.propTypes = {
  action: PropTypes.instanceOf(UserActionRecord).isRequired,
  isLatest: PropTypes.bool,
  className: PropTypes.string,
  /**
   * If set to true Restore, Approve and Flag buttons will not appear. Diff button always appear when available.
   */
  withoutActions: PropTypes.bool
}