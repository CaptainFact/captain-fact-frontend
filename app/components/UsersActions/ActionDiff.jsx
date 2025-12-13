import { diffWordsWithSpace } from 'diff'
import { startCase } from 'lodash'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import {
  ACTION_DELETE,
  ACTION_REMOVE,
  ACTION_RESTORE,
  ENTITY_SPEAKER,
  ENTITY_STATEMENT,
} from '../../constants'
import { speakerURL } from '../../lib/cf_routes'
import formatSeconds from '../../lib/seconds_formatter'
import { getEntityIdKey } from '../../lib/user_action_entity_id'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

class ActionDiff extends PureComponent {
  render() {
    const allActions = this.props.allActions || [this.props.action]
    const diff = this.generateDiff(allActions, this.props.action)
    if (Object.keys(diff).length === 0) {
      return null
    }

    return (
      <div className="p-3 text-left text-sm bg-slate-800 shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.3)] rounded-sm">
        {Object.entries(diff).map(([key, changes]) => (
          <div key={key} className="mb-3 last:mb-0">
            <div className="inline-block mr-2 font-medium min-w-[70px] text-amber-400 align-top text-xs uppercase tracking-wide">
              {startCase(this.formatChangeKey(key))}&nbsp;
            </div>
            <span className="inline-block max-w-full whitespace-pre-wrap break-words">
              {this.renderKeyDiff(key, changes)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  renderKeyDiff(key, changes) {
    // Value completely changed, show it like prev -> new
    if (changes.length === 2 && changes[0].removed && changes[1].added) {
      return (
        <div>
          <span className="px-1 py-0.5 bg-red-900/50 line-through opacity-60">
            {this.formatChangeValue(changes[0].value, key)}
          </span>
          <span className="mx-1 text-slate-400">→</span>
          <span className="px-1 py-0.5 bg-emerald-800/50">
            {this.formatChangeValue(changes[1].value, key)}
          </span>
        </div>
      )
    }
    // Generate a real diff
    return changes.map((change, idx) => (
      <span
        key={idx}
        className={`text-slate-200 ${
          change.added
            ? 'px-1 py-0.5 bg-emerald-800/50'
            : change.removed
              ? 'px-1 py-0.5 bg-red-900/50 line-through opacity-60 whitespace-normal'
              : ''
        }`}
      >
        {this.formatChangeValue(change.value, key)}
      </span>
    ))
  }

  formatChangeKey(key) {
    return key.replace('_id', '').replace('_', ' ')
  }

  formatChangeValue(value, key) {
    if (key === 'speaker_id' && value) {
      return (
        <Link to={speakerURL(value)} className="text-white underline">
          #{value}
        </Link>
      )
    } else if (['is_draft', 'unlisted'].includes(key) && !value) {
      return 'No'
    } else if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }

    return value
  }

  generateDiff(allActions, action) {
    // Filter to get only actions referencing the same entity
    const idKey = getEntityIdKey(action.entity)
    const entityActions = !idKey
      ? []
      : allActions.filter((a) => {
          return a.entity === action.entity && a[idKey] === action[idKey]
        })

    // Get previous state
    const actionIdx = entityActions.findIndex((a) => a.id === action.id)
    let prevState = {}
    if (actionIdx + 1 < entityActions.length) {
      prevState = this.buildReferenceEntity(entityActions.slice(actionIdx + 1))
    }

    // Build changes object like key: [diffs]
    const diff = {}
    const actionChanges = this.getActionChanges(action, prevState)
    for (const [key, newValue] of Object.entries(actionChanges)) {
      const valueDiff = this.diffEntry(key, prevState[key], newValue)
      diff[key] = valueDiff
    }
    return diff
  }

  getActionChanges(action, prevState) {
    if ([ACTION_DELETE, ACTION_REMOVE].includes(action.type)) {
      const result = {}
      for (const key in prevState) {
        result[key] = null
      }
      return result
    }
    if (action.type === ACTION_RESTORE) {
      return prevState
    }
    // Parse JSON string if needed
    try {
      if (typeof action.changes === 'string') {
        return JSON.parse(action.changes) || {}
      }
      return action.changes || {}
    } catch (e) {
      // If parsing fails, return empty object
      return {}
    }
  }

  completeReference(reference, actions, keysToStore) {
    // Let's look for the most recent entries
    for (const action of actions) {
      // Parse JSON string if needed
      let changes
      try {
        if (typeof action.changes === 'string') {
          changes = JSON.parse(action.changes) || {}
        } else {
          changes = action.changes || {}
        }
      } catch (e) {
        // If parsing fails, use empty object
        changes = {}
      }
      if (Object.keys(changes).length === 0) {
        continue
      }
      for (let idx = keysToStore.length - 1; idx >= 0; idx--) {
        const key = keysToStore[idx]
        if (!(key in changes)) {
          continue
        }
        // Yihaa ! Changes contains a value for key
        reference[key] = changes[key]
        keysToStore.splice(idx, 1)
        if (keysToStore.length === 0) {
          return reference
        }
      }
    }
    return reference
  }

  buildReferenceEntity(actions, base = null) {
    const entity = actions[0].entity
    if (entity === ENTITY_STATEMENT) {
      return this.buildReferenceStatement(actions, base)
    }
    if (entity === ENTITY_SPEAKER) {
      return this.buildReferenceSpeaker(actions, base)
    }
    return {}
  }

  buildReferenceStatement(actions, base = null) {
    if (!base) {
      base = { id: actions[actions.length - 1].statementId }
    }
    return this.completeReference(base, actions, ['text', 'time', 'speaker_id'])
  }

  buildReferenceSpeaker(actions, base = null) {
    if (!base) {
      base = { id: actions[0].speakerId }
    }
    return this.completeReference(base, actions, ['full_name', 'title'])
  }

  diffEntry(key, prevValue, newValue) {
    if (!prevValue && newValue) {
      return [{ added: true, value: this.formatValue(key, newValue) }]
    }

    // Format numbers like prevNumber -> newNumber
    if (typeof newValue === 'number') {
      prevValue = this.formatValue(key, prevValue)
      newValue = this.formatValue(key, newValue)

      // Generate diff
      if (prevValue) {
        return [
          { removed: true, value: prevValue },
          { added: true, value: newValue },
        ]
      }
      return [{ added: true, value: newValue }]
    }
    // Do a string diff
    return diffWordsWithSpace((prevValue || '').toString(), newValue ? newValue.toString() : '')
  }

  formatValue(key, value) {
    if (!value) {
      return value
    }
    // Format time like 0:42 -> 1:35
    if (key === 'time') {
      return formatSeconds(value)
    }
    if (key === 'source' || key === 'url') {
      return (
        <ExternalLinkNewTab className="text-neutral-200 underline" href={value}>
          {value}
        </ExternalLinkNewTab>
      )
    }
    return value
  }
}

export default ActionDiff
