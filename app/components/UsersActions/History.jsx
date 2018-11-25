import React from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import { withNamespaces } from 'react-i18next'

import UserAction from './UserAction'

/**
 * Display a list of `UserAction` record as an history
 */
@withNamespaces('main')
export class History extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { isExpended: props.defaultExpended || false }
  }

  render() {
    const { actions } = this.props
    const { isExpended } = this.state

    if (actions.size === 0) return <div />

    const latestAction = actions.first()
    const oldActions = actions.rest()

    return (
      <div className="user-actions-history">
        <div className="latest-action">
          <UserAction key={latestAction.id} action={latestAction} isLatest />
        </div>
        {actions.size > 1 && (
          <a
            className="expend-old-actions"
            onClick={() => this.setState({ isExpended: !isExpended })}
          >
            {isExpended
              ? 'Hide'
              : `Show full history (${actions.size - 1} elements)`}
          </a>
        )}
        {isExpended && (
          <div className="old-actions">
            {oldActions.map(action => (
              <div key={action.id}>
                <div className="separator" />
                <UserAction action={action} isLatest={false} />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

History.propTypes = {
  /**
   * A list of `UserAction` records
   */
  actions: PropTypes.instanceOf(Immutable.List).isRequired,
  /**
   * Define is history get expended or collapsed on first render (default: false)
   */
  defaultExpended: PropTypes.bool
}
