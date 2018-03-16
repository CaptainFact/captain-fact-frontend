import React from 'react'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { flashErrorUnauthenticated } from '../../state/flashes/reducer'
import { hasReputation } from '../../state/users/current_user/selectors'
import { revertVideoDebateUserAction } from '../../state/video_debate/history/effects'
import { TimeSince } from '../Utils/TimeSince'
import UserAppellation from '../Users/UserAppellation'
import { Icon } from '../Utils/Icon'
import ActionDiff from './ActionDiff'
import ActionIcon from './ActionIcon'
import EntityTitle from './EntityTitle'
import { ACTION_DELETE, ACTION_REMOVE, MIN_REPUTATION_RESTORE_ENTITY } from '../../constants'
import { LoadingFrame } from '../Utils/LoadingFrame'


@translate('history')
@connect(
  (state, props) => ({
    lastActionsIds: state.UsersActions.lastActionsIds,
    canRestore: props.showRestore && hasReputation(state, MIN_REPUTATION_RESTORE_ENTITY)
  }),
  {revertVideoDebateUserAction, flashErrorUnauthenticated}
)
class ActionsTable extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {expendedDiffs: new Immutable.List()}
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
        <th>{t('moderation')}</th>
      </tr>
    )
  }

  renderCompareAllButton = isMostlyComparing => {
    let onClick = null
    if (!isMostlyComparing)
      onClick = () => this.setState({expendedDiffs: this.props.actions.map(a => a.id)})
    else
      onClick = () => this.setState({expendedDiffs: this.state.expendedDiffs.clear()})
    return (
      <a className="button"
         title={this.props.t(isMostlyComparing ? 'hideAll' : 'compareAll')}
         onClick={onClick}>
        {this.props.t('changes')}
      </a>
    )
  }

  // ---- Table body ----

  renderBody = () => {
    if (this.props.isLoading)
      return <tr style={{background: 'none'}}><td colSpan={this.getNbCols()}><LoadingFrame/></td></tr>
    return this.props.actions.map(a => this.renderAction(a))
  }

  renderAction = (action) => {
    if (this.state.expendedDiffs.includes(action.id))
      return [this.renderActionLine(action, true), this.renderDiffLine(action)]
    return this.renderActionLine(action)
  }

  renderActionLine(action, isDiffing=false) {
    const { canRestore, showEntity, t } = this.props
    const reversible = canRestore && this.props.lastActionsIds.includes(action.id) &&
      ([ACTION_DELETE, ACTION_REMOVE].includes(action.type))

    return (
      <tr key={action.id}>
        <td><TimeSince time={ action.time }/></td>
        <td>{this.renderUser(action.user)}</td>
        <td><ActionIcon type={action.type}/><strong> { t(`action.${action.type}`) }</strong></td>
        {showEntity && <td><EntityTitle entity={action.entity} entityId={action.entity_id}/></td>}
        <td>
          <a className='button' onClick={() => this.toggleDiff(action, isDiffing)}>
            <Icon size="small" name="indent"/>
            <span>{ t(isDiffing ? 'compare_hide' : 'compare_show') } </span>
          </a>
        </td>
        {canRestore &&
          <td>
            {reversible &&
              <a className="button" onClick={() => this.props.revertVideoDebateUserAction(action)}>
                <Icon size="small" name="undo"/>
                <span>{t('revert')}</span>
              </a>
            }
          </td>
        }
        <td>
          <a className="is-disabled button">
            <Icon size="small" name="check"/>
            <span>{t('main:actions.approve')}</span>
          </a>&nbsp;&nbsp;
          <a key="flag" className="is-disabled button">
            <Icon size="small" name="flag"/>
            <span>{t('main:actions.flag')}</span>
          </a>
        </td>
      </tr>
    )
  }

  renderUser = user =>
    user ?
      <UserAppellation user={user} compact/> :
      <span className="has-text-grey-lighter is-italic">{this.props.t('deletedUser')}</span>

  renderDiffLine = action =>
    <tr key={`${action.id}-diff`}>
      <td colSpan={this.getNbCols()} style={{padding: 0}}>
        <ActionDiff action={action} allActions={this.props.actions}/>
      </td>
    </tr>

  toggleDiff = (action, isDiffing) => {
    if (isDiffing) {
      const actionIdx = this.state.expendedDiffs.findIndex(a => a.id === action.id)
      this.setState({expendedDiffs: this.state.expendedDiffs.delete(actionIdx)})
    }
    else
      this.setState({expendedDiffs: this.state.expendedDiffs.push(action.id)})
  }

  getNbCols = () =>
    7 - !this.props.canRestore - !this.props.showEntity
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
