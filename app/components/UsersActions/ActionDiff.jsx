import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'

import titleCase from '../../lib/title_case'
import { ENTITY_SPEAKER } from '../../constants'
import EntityTitle from './EntityTitle'


class ActionDiff extends PureComponent {
  render() {
    return (
      <div className="action-diff">
        {this.props.diff.entrySeq().map(([key, changes]) => (
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
}

ActionDiff.propTypes = {
  diff: PropTypes.instanceOf(Immutable.Map).isRequired
}

export default ActionDiff
