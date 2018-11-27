import React from 'react'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'

import { flashErrorUnauthenticated } from '../../state/flashes/reducer'
import { hasReputation } from '../../state/users/current_user/selectors'
import { revertVideoDebateUserAction } from '../../state/video_debate/history/effects'
import { TimeSince } from '../Utils/TimeSince'
import UserAppellation from '../Users/UserAppellation'
import { Icon } from '../Utils/Icon'
import ActionDiff from './ActionDiff'
import ActionIcon from './ActionIcon'
import ActionEntityLink from './ActionEntityLink'
import {
  ACTION_DELETE,
  ACTION_REMOVE,
  MIN_REPUTATION_RESTORE_ENTITY
} from '../../constants'
import { LoadingFrame } from '../Utils/LoadingFrame'
import Button from '../Utils/Button'

@withNamespaces('history')
@connect(
  (state, props) => ({
    lastActionsIds: state.UsersActions.lastActionsIds,
    canRestore: props.showRestore && hasReputation(state, MIN_REPUTATION_RESTORE_ENTITY)
  }),
  { revertVideoDebateUserAction, flashErrorUnauthenticated }
)
class ActionsTable extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { expendedDiffs: new Immutable.List() }
  }

  render() {
    return (
      <table className="actions-list table">
        <thead>{this.renderHeader()}</thead>
        <tbody>{this.renderBody()}</tbody>
      </table>
    )
  }

  // ---- Table header ----

  renderHeader = () => {
    const { t, actions, canRestore, showEntity } = this.props
    const isMostlyComparing = this.state.expendedDiffs.count() / actions.count() > 0.5

    return (
      <tr>
        <th>{t('when')}</th>
        <th>{t('who')}</th>
        <th>Action</th>
        {showEntity && <th>{t('entity')}</th>}
        <th>{this.renderCompareAllButton(isMostlyComparing)}</th>
        {canRestore && <th>{t('revert')}</th>}
        {/* <th>{t('moderation')}</th> */}
      </tr>
    )
  }

  renderCompareAllButton = isMostlyComparing => {
    return (
      <Button
        onClick={
          isMostlyComparing
            ? () => this.collapseDiffs()
            : () =>
                this.setState({
                  expendedDiffs: this.props.actions.map(a => a.id)
                })
        }
      >
        {this.props.t(isMostlyComparing ? 'hideAll' : 'compareAll')}
      </Button>
    )
  }

  collapseDiffs() {
    this.setState(prevState => ({
      expendedDiffs: prevState.expendedDiffs.clear()
    }))
  }

  // ---- Table body ----

  renderBody = () => {
    if (this.props.isLoading)
      return (
        <tr style={{ background: 'none' }}>
          <td colSpan={this.getNbCols()}>
            <LoadingFrame />
          </td>
        </tr>
      )
    return this.props.actions.map(a => this.renderAction(a))
  }

  renderAction = action => {
    if (this.state.expendedDiffs.includes(action.id))
      return [this.renderActionLine(action, true), this.renderDiffLine(action)]
    return this.renderActionLine(action)
  }

  renderActionLine(action, isDiffing = false) {
    const { canRestore, showEntity, t } = this.props
    const reversible =
      canRestore &&
      this.props.lastActionsIds.includes(action.id) &&
      [ACTION_DELETE, ACTION_REMOVE].includes(action.type)

    return (
      <tr key={action.id}>
        <td>
          <TimeSince time={action.time} />
        </td>
        <td>{this.renderUser(action.user)}</td>
        <td>
          <ActionIcon type={action.type} />
          <strong> {t(`action.${action.type}`)}</strong>
        </td>
        {showEntity && (
          <td>
            <ActionEntityLink action={action} />
          </td>
        )}
        <td>
          <Button onClick={() => this.toggleDiff(action, isDiffing)}>
            <Icon size="small" name="indent" />
            <span>{t(isDiffing ? 'compare_hide' : 'compare_show')} </span>
          </Button>
        </td>
        {canRestore && (
          <td>
            {reversible && (
              <Button onClick={() => this.props.revertVideoDebateUserAction(action)}>
                <Icon size="small" name="undo" />
                <span>{t('revert')}</span>
              </Button>
            )}
          </td>
        )}
        {/* <td> */}
        {/* <a className="button" disabled> */}
        {/* <Icon size="small" name="check"/> */}
        {/* <span>{t('main:actions.approve')}</span> */}
        {/* </a>&nbsp;&nbsp; */}
        {/* <a className="button" disabled> */}
        {/* <Icon size="small" name="flag"/> */}
        {/* <span>{t('main:actions.flag')}</span> */}
        {/* </a> */}
        {/* </td> */}
      </tr>
    )
  }

  renderUser = user => <UserAppellation user={user} compact />

  renderDiffLine = action => (
    <tr key={`${action.id}-diff`}>
      <td colSpan={this.getNbCols()} style={{ padding: 0 }}>
        <ActionDiff action={action} allActions={this.props.actions} />
      </td>
    </tr>
  )

  toggleDiff = (action, isDiffing) => {
    if (isDiffing) {
      const actionIdx = this.state.expendedDiffs.findIndex(id => id === action.id)
      this.setState(prevState => ({
        expendedDiffs: prevState.expendedDiffs.delete(actionIdx)
      }))
    } else
      this.setState(prevState => ({
        expendedDiffs: prevState.expendedDiffs.push(action.id)
      }))
  }

  getNbCols = () => 7 - !this.props.canRestore - !this.props.showEntity
}

ActionsTable.defaultProps = {
  isLoading: false,
  showRestore: true,
  showEntity: true
}

ActionsTable.propTypes = {
  actions: PropTypes.instanceOf(Immutable.List).isRequired,
  isLoading: PropTypes.bool,
  showRestore: PropTypes.bool,
  showEntity: PropTypes.bool
}

export default ActionsTable
