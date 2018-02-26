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
import ActionIcon from './ActionIcon'
import EntityTitle from './EntityTitle'
import { ACTION_DELETE, ACTION_REMOVE } from '../../constants'
import { revertVideoDebateUserAction } from '../../state/video_debate/history/effects'
import { LoadingFrame } from '../Utils/LoadingFrame'


@translate(['history', 'main'])
@connect(
  state => ({lastActionsIds: state.UsersActions.lastActionsIds}),
  {revertVideoDebateUserAction}
)
class ActionsTable extends PureComponent {
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
    const { t, actions, showRestore, showEntity } = this.props
    const isMostlyComparing = this.state.expendedDiffs.count() / actions.count() > 0.5

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

  renderCompareAllButton = isMostlyComparing => {
    let onClick = null
    if (!isMostlyComparing)
      onClick = () => this.setState({expendedDiffs: this.props.actions.map(a => a.id)})
    else
      onClick = () => this.setState({expendedDiffs: this.state.expendedDiffs.clear()})
    console.log(isMostlyComparing)
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
    const {showRestore, showEntity, t, revertVideoDebateUserAction} = this.props
    const reversible = showRestore && this.props.lastActionsIds.includes(action.id) &&
      ([ACTION_DELETE, ACTION_REMOVE].includes(action.type))

    return (
      <tr key={action.id}>
        <td><TimeSince time={ action.time }/></td>
        <td><UserAppellation user={action.user} compact/></td>
        <td><ActionIcon type={action.type}/><strong> { t(`action.${action.type}`) }</strong></td>
        {showEntity && <td><EntityTitle entity={action.entity} entityId={action.entity_id}/></td>}
        <td>
          <a className='button' onClick={() => this.toggleDiff(action, isDiffing)}>
            <Icon size="small" name="indent"/>
            <span>{ t(isDiffing ? 'compare_hide' : 'compare_show') } </span>
          </a>
        </td>
        {showRestore &&
          <td>
            {reversible &&
              <a className="button" onClick={() => revertVideoDebateUserAction(action)}>
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
