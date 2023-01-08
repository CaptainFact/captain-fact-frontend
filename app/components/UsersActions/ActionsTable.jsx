import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'

import { ACTION_DELETE, ACTION_REMOVE } from '../../constants'
import { flashErrorUnauthenticated } from '../../state/flashes/reducer'
import { revertVideoDebateUserAction } from '../../state/video_debate/history/effects'
import UserAppellation from '../Users/UserAppellation'
import Button from '../Utils/Button'
import { Icon } from '../Utils/Icon'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { TimeSince } from '../Utils/TimeSince'
import ActionDiff from './ActionDiff'
import ActionEntityLink from './ActionEntityLink'
import ActionIcon from './ActionIcon'

@withNamespaces('history')
@connect(
  (state) => ({
    lastActionsIds: state.UsersActions.lastActionsIds,
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
    const { t, actions, showEntity } = this.props
    const isMostlyComparing = this.state.expendedDiffs.count() / actions.count() > 0.5

    return (
      <tr>
        <th>{t('when')}</th>
        <th>{t('who')}</th>
        <th>Action</th>
        {showEntity && <th>{t('entity')}</th>}
        <th>{this.renderCompareAllButton(isMostlyComparing)}</th>
        <th>{t('revert')}</th>
      </tr>
    )
  }

  renderCompareAllButton = (isMostlyComparing) => {
    return (
      <Button
        onClick={
          isMostlyComparing
            ? () => this.collapseDiffs()
            : () =>
                this.setState({
                  expendedDiffs: this.props.actions.map((a) => a.id),
                })
        }
      >
        {this.props.t(isMostlyComparing ? 'hideAll' : 'compareAll')}
      </Button>
    )
  }

  collapseDiffs() {
    this.setState((prevState) => ({
      expendedDiffs: prevState.expendedDiffs.clear(),
    }))
  }

  // ---- Table body ----

  renderBody = () => {
    if (this.props.isLoading) {
      return (
        <tr style={{ background: 'none' }}>
          <td colSpan={this.getNbCols()}>
            <LoadingFrame />
          </td>
        </tr>
      )
    }
    return this.props.actions.map((a) => this.renderAction(a))
  }

  renderAction = (action) => {
    if (this.state.expendedDiffs.includes(action.id)) {
      return [this.renderActionLine(action, true), this.renderDiffLine(action)]
    }
    return this.renderActionLine(action)
  }

  renderActionLine(action, isDiffing = false) {
    const { showEntity, t } = this.props
    const isLastActionForEntity = this.props.lastActionsIds.includes(action.id)
    const isReversibleType = [ACTION_DELETE, ACTION_REMOVE].includes(action.type)
    const reversible = isLastActionForEntity && isReversibleType

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
        <td>
          {reversible && (
            <Button onClick={() => this.props.revertVideoDebateUserAction(action)}>
              <Icon size="small" name="undo" />
              <span>{t('revert')}</span>
            </Button>
          )}
        </td>
      </tr>
    )
  }

  renderUser = (user) => <UserAppellation user={user} compact />

  renderDiffLine = (action) => (
    <tr key={`${action.id}-diff`}>
      <td colSpan={this.getNbCols()} style={{ padding: 0 }}>
        <ActionDiff action={action} allActions={this.props.actions} />
      </td>
    </tr>
  )

  toggleDiff = (action, isDiffing) => {
    if (isDiffing) {
      const actionIdx = this.state.expendedDiffs.findIndex((id) => id === action.id)
      this.setState((prevState) => ({
        expendedDiffs: prevState.expendedDiffs.delete(actionIdx),
      }))
    } else {
      this.setState((prevState) => ({
        expendedDiffs: prevState.expendedDiffs.push(action.id),
      }))
    }
  }

  getNbCols = () => 7 - !this.props.showEntity
}

ActionsTable.defaultProps = {
  isLoading: false,
  showRestore: true,
  showEntity: true,
}

ActionsTable.propTypes = {
  actions: PropTypes.instanceOf(Immutable.List).isRequired,
  isLoading: PropTypes.bool,
  showRestore: PropTypes.bool,
  showEntity: PropTypes.bool,
}

export default ActionsTable
