import React, { PureComponent } from 'react'
import { Map, List } from 'immutable'
import { diffWordsWithSpace } from 'diff'
import titleCase from 'voca/title_case'

import {
  ACTION_DELETE, ACTION_REMOVE, ACTION_RESTORE, ENTITY_SPEAKER,
  ENTITY_STATEMENT, ENTITY_VIDEO
} from '../../constants'
import parseDateTime from '../../lib/parse_datetime'
import formatSeconds from '../../lib/seconds_formatter'
import UserAction from '../../state/user_actions/record'
import EntityTitle from './EntityTitle'


class ActionDiff extends PureComponent {
  render() {
    const allActions = this.props.allActions || new List([this.props.action])
    const diff = this.generateDiff(allActions, this.props.action)
    return (
      <div className="action-diff">
        {diff.entrySeq().map(([key, changes]) => (
          <div key={ key } className="diff-entry">
            <span className="diff-key">
              { titleCase(this.formatChangeKey(key)) }
            </span>
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

  formatChangeKey(key) {
    return key.replace('_id', '').replace('_', ' ')
  }

  formatChangeValue(value, key) {
    if (key === "speaker_id")
      return <EntityTitle entity={ENTITY_SPEAKER} entityId={value} withPrefix={false}/>
    return value
  }

  generateDiff(allActions, action) {
    const entityActions = allActions.filter(a =>
      a.entity_id === action.entity_id && a.entity === action.entity
    )
    const actionIdx = entityActions.findIndex(a => a.id === action.id)
    // Get previous state
    let prevState = new Map()
    if (actionIdx + 1 < entityActions.size)
      prevState = this.buildReferenceEntity(entityActions.slice(actionIdx + 1))

    // Build changes object like key: [diffs]
    console.log(this.getActionChanges(action, prevState))
    return new Map().withMutations(diff => {
      for (let [key, newValue] of this.getActionChanges(action, prevState).entrySeq()) {
        const valueDiff = this.diffEntry(key, prevState.get(key), newValue)
        diff.set(key, new List(valueDiff))
      }
    })
  }

  getActionChanges(action, prevState) {
    console.log(action)
    if ([ACTION_DELETE, ACTION_REMOVE].includes(action.type))
      return prevState.map(() => null)
    else if (action.type === ACTION_RESTORE)
      return prevState
    return action.changes
  }

  completeReference(reference, actions, keysToStore) {
    return reference.withMutations(reference => {
      // Let's look for the most recent entries
      for (let action of actions) {
        if (action.changes.size === 0)
          continue
        for (let [idx, key] of keysToStore.entries()) {
          if (!(action.changes.has(key)))
            continue
          // Yihaa ! Changes contains a value for key
          reference.set(key, action.changes.get(key))
          delete(keysToStore[idx])
          if (keysToStore.length === 0)
            return reference
        }
      }
      return reference
    })
  }

  buildReferenceEntity(actions, base=null) {
    const entity = actions.first().entity
    if (entity === ENTITY_STATEMENT)
      return this.buildReferenceStatement(actions, base)
    else if (entity === ENTITY_SPEAKER)
      return this.buildReferenceSpeaker(actions, base)
    else if (entity === ENTITY_VIDEO)
      return this.buildReferenceVideo(actions, base)
  }

  buildReferenceVideo(actions, base=null) {
    return new Map()
  }

  buildReferenceStatement(actions, base=null) {
    if (!base)
      base = new Map({ id: actions.last().entity_id })
    return this.completeReference(base, actions, ['text', 'time', 'speaker_id'])
  }

  buildReferenceSpeaker(actions, base=null) {
    if (!base)
      base = new Map({ id: actions.first().entity_id })
    return this.completeReference(base, actions, ['full_name', 'title'])
  }

  prepareAction(action) {
    action.time = parseDateTime(action.time)
    action.changes = new Map(action.changes)
    return UserAction(action)
  }

  diffEntry(key, prevValue, newValue) {
    if (prevValue === newValue)
      return [{added: true, value: this.formatValue(key, newValue)}]

    // Format numbers like prevNumber -> newNumber
    if (typeof(newValue) === "number") {
      // Format time like 0:42 -> 1:35
      prevValue = this.formatValue(key, prevValue)
      newValue = this.formatValue(key, newValue)

      // Generate diff
      if (prevValue)
        return [{removed: true, value: prevValue}, {added: true, value: newValue}]
      else
        return [{added: true, value: newValue}]
    }
    // Do a string diff
    return diffWordsWithSpace((prevValue || "").toString(), newValue ? newValue.toString() : "")
  }

  formatValue(key, value) {
    if (key === "time")
      return value ? formatSeconds(value) : ""
    return value
  }

}

export default ActionDiff
