import React from "react"
import { connect } from 'react-redux'
import titleCase from '../../lib/title_case'

import UserAppellation from "../Users/UserAppellation"
import { TimeSince, Icon } from '../Utils'
import classNames from 'classnames'
import iterateWithSeparators from '../../lib/iterate_with_separators'
import Tag from '../Utils/Tag'
import { generateDiff } from '../../state/video_debate/history/reducer'
import { revertVideoDebateHistoryEntry } from '../../state/video_debate/history/effects'
import { translate } from 'react-i18next'
import {isAuthenticated} from '../../state/users/current_user/selectors'
import {flashErrorUnauthenticated} from '../../state/flashes/reducer'
import {ACTION_ADD, ACTION_CREATE, ACTION_DELETE, ACTION_REMOVE, ACTION_UPDATE} from '../../constants'


@connect((state, props) => ({
  diff: state.VideoDebate.history.diffs.get(props.action.id),
  speakers: state.VideoDebate.video.data.speakers,
  isAuthenticated: isAuthenticated(state)
}), {generateDiff, revertVideoDebateHistoryEntry, flashErrorUnauthenticated})
@translate(['history', 'main'])
export class HistoryEntry extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {isDiffing: false}

    this.revertAction = this.authenticatedAction(this.revertAction.bind(this))
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
    return this.props.revertVideoDebateHistoryEntry(this.props.action)
  }

  render() {
    const { action, diff, className, isLatest, t } = this.props
    const { user, type, entity, time } = action
    const reversible = isLatest && (type === ACTION_DELETE || type === ACTION_REMOVE)

    return (
      <div className={ classNames(className, 'action') }>
        <div className="action-description">
          <Tag type="info"><TimeSince time={ time }/></Tag>
          { HistoryEntry.getActionTag(type) }
          <UserAppellation user={user}/>
          <span className="action-name">
            <strong>{ t(`action.${type}`) }</strong>
          </span>
          <span className="entity-type">
            { t(`this.${entity}`) }
          </span>
        </div>
        <div className="action-buttons">
          {this.canBeDiffed() &&
          <a onClick={this.toggleDiff.bind(this)}>
            <Icon size="small" name="indent"/>
            <span>{ t(this.state.isDiffing ? 'compare_hide' : 'compare_show') } </span>
          </a>
          }
          {reversible &&
          <a onClick={this.revertAction}>
            <Icon size="small" name="undo"/>
            <span>Restore</span>
          </a>
          }
          <a className="is-disabled">
            <Icon size="small" name="check"/>
            <span>{t('main:actions.approve')}</span>
          </a>
          <a className="is-disabled">
            <Icon size="small" name="flag"/>
            <span>{t('main:actions.flag')}</span>
          </a>
        </div>
        {this.state.isDiffing &&
        <div className="action-diff">
          { this.renderDiff(diff) }
        </div>
        }
      </div>
    )
  }

  renderDiff(diff) {
    return (
      <div>
        {diff.entrySeq().map(([key, changes]) => (
          <div key={ key } className="diff-entry">
            <span className="diff-key">{ titleCase(HistoryEntry.formatChangeKey(key)) }</span>
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