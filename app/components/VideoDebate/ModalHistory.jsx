import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'

import Modal from '../Modal/Modal'
import { Icon } from '../Utils/Icon'
import {
  joinStatementHistoryChannel,
  leaveStatementHistoryChannel,
} from '../../state/video_debate/history/effects'
import { popModal } from '../../state/modals/reducer'
import { ENTITY_STATEMENT } from '../../constants'
import ActionsTable from '../UsersActions/ActionsTable'
import { reset } from '../../state/user_actions/reducer'
import { startCase } from 'lodash'

@connect(
  (state) => ({
    actions: state.UsersActions.actions,
    isLoading: state.UsersActions.isLoading,
  }),
  { joinStatementHistoryChannel, leaveStatementHistoryChannel, popModal, reset }
)
@withNamespaces('history')
export class ModalHistory extends React.PureComponent {
  componentDidMount() {
    if (this.props.entity === ENTITY_STATEMENT) {
      this.props.joinStatementHistoryChannel(this.props.entityId)
    }
  }

  componentWillUnmount() {
    if (this.props.entity === ENTITY_STATEMENT) {
      this.props.leaveStatementHistoryChannel()
    }
    this.props.reset()
  }

  render() {
    const { entity, entityId, actions, isLoading, t, ...props } = this.props
    return (
      <Modal
        className="modal modal-history"
        title={this.renderTitle(t, entity, entityId)}
        handleCloseClick={this.props.popModal}
        {...props}
      >
        <ActionsTable
          actions={actions}
          isLoading={isLoading}
          showRestore={false}
          showEntity={false}
        />
      </Modal>
    )
  }

  renderTitle = (t, entity, entityId) => (
    <div>
      <Icon name="history" />
      <span>
        {' '}
        {startCase(t(`entities.${entity}`))} #{entityId}
      </span>
    </div>
  )
}
