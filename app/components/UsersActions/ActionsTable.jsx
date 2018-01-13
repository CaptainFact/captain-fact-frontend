import React, { PureComponent } from 'react'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { TimeSince } from '../Utils/TimeSince'
import UserAppellation from '../Users/UserAppellation'
import { Icon } from '../Utils/Icon'
import ActionDiff from './ActionDiff'
import { generateAllDiffs, generateDiff, hideAllDiffs, hideDiff } from '../../state/user_actions/reducer'
import EntityTitle from './EntityTitle'
import { ACTION_DELETE, ACTION_REMOVE } from '../../constants'
import { revertVideoDebateUserAction } from '../../state/video_debate/history/effects'
import { LoadingFrame } from '../Utils/LoadingFrame'


const ACTIONS_ICONS = [
  "plus",     // Create
  "times",    // Remove
  "pencil",   // Update
  "times",    // Delete
  "plus",     // Add
  "undo"      // Restore
]

@translate(['history', 'main'])
@connect(
  state => ({diffs: state.UsersActions.diffs, lastActionsIds: state.UsersActions.lastActionsIds}),
  {generateDiff, hideDiff, generateAllDiffs, hideAllDiffs, revertVideoDebateUserAction}
)
class ActionsTable extends PureComponent {
  render() {
    const availableDiffs = new Immutable.List(this.props.diffs.keys())
    return (
      <table className="actions-list table">
        <thead>{this.renderHeader(availableDiffs)}</thead>
        <tbody>{this.renderBody(availableDiffs)}</tbody>
      </table>
    )
  }

  // ---- Table header ----

  renderHeader = availableDiffs => {
    const { t, actions, showRestore, showEntity } = this.props
    const isMostlyComparing = availableDiffs.count() / actions.count() > 0.5
    return (
      <tr>
        <th>{t('when')}</th>
        <th>{t('who')}</th>
        <th>Action</th>
        {showEntity && <th>{t('entity')}</th>}
        <th>{this.renderCompareAllButton(isMostlyComparing)}</th>
        {showRestore && <th>{t('revert')}</th>}
        <th>{t('moderation')}</th>
      </tr>
    )
  }

  renderCompareAllButton = isMostlyComparing =>
    <a className="button" title={this.props.t(isMostlyComparing ? 'hideAll' : 'compareAll')}
       onClick={isMostlyComparing ? this.props.hideAllDiffs : this.props.generateAllDiffs}>
      {this.props.t('changes')}
    </a>

  // ---- Table body ----

  renderBody = (availableDiffs) => {
    if (this.props.isLoading)
      return <tr style={{background: 'none'}}><td colSpan={this.getNbCols()}><LoadingFrame/></td></tr>
    return this.props.actions.map(a => this.renderAction(availableDiffs, a))
  }

  renderAction = (availableDiffs, action) => {
    if (availableDiffs.includes(action.id))
      return [this.renderActionLine(action, true), this.renderDiffLine(action)]
    return this.renderActionLine(action)
  }

  renderActionLine(action, isDiffing=false) {
    const {showRestore, showEntity, t, revertVideoDebateUserAction} = this.props
    const reversible = showRestore && this.props.lastActionsIds.includes(action.id) &&
      ([ACTION_DELETE, ACTION_REMOVE].includes(action.type))

    return (
      <tr key={action.id}>
        <td><TimeSince time={ action.time }/></td>
        <td><UserAppellation user={action.user} compact/></td>
        <td>{this.renderActionIcon(action.type)}<strong>{ t(`action.${action.type}`) }</strong></td>
        {showEntity && <td><EntityTitle entity={action.entity} entityId={action.entity_id}/></td>}
        <td>
          <a className='button' onClick={() => this.toggleDiff(action, isDiffing)}>
            <Icon size="small" name="indent"/>
            <span>{ t(isDiffing ? 'compare_hide' : 'compare_show') } </span>
          </a>
        </td>
        {showRestore && <td>{reversible &&
          <a className="button" onClick={() => revertVideoDebateUserAction(action)}>
            <Icon size="small" name="undo"/>
            <span>{t('revert')}</span>
          </a>
        }</td>}
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

  renderDiffLine = action =>
    <tr key={`${action.id}-diff`}>
      <td colSpan={this.getNbCols()} style={{padding: 0}}>
        <ActionDiff action={action} diff={this.props.diffs.get(action.id)}/>
      </td>
    </tr>

  renderActionIcon = type =>
    type <= ACTIONS_ICONS.length ? <Icon name={ACTIONS_ICONS[type - 1]} size="mini"/> : null

  toggleDiff = (action, isDiffing) =>
    isDiffing ? this.props.hideDiff(action) : this.props.generateDiff(action)

  getNbCols = () =>
    7 - !this.props.showRestore - !this.props.showEntity
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
