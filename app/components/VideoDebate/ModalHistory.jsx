import React from "react"
import { connect } from 'react-redux'
import { List } from 'immutable'
import titleCase from '../../lib/title_case'

import Modal from "../Modal/Modal"
import { Icon } from '../Utils/Icon'
import { joinStatementHistoryChannel, leaveStatementHistoryChannel } from '../../state/video_debate/history/effects'
import { EntityHistory } from '../VideoDebate/EntityHistory'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { popModal } from '../../state/modals/reducer'
import { ENTITY_STATEMENT } from '../../constants'


@connect((state, props) => ({
  actions: state.VideoDebate.history.entitiesActions,
  isLoading: state.VideoDebate.history.isLoading
}), {joinStatementHistoryChannel, leaveStatementHistoryChannel, popModal})
export class ModalHistory extends React.PureComponent {
  componentDidMount() {
    if (this.props.entity === ENTITY_STATEMENT)
      this.props.joinStatementHistoryChannel(this.props.entityId)
  }

  componentWillUnmount() {
    if (this.props.entity === ENTITY_STATEMENT)
      this.props.leaveStatementHistoryChannel()
  }

  render() {
    const { entity, entityId, actions, isLoading, ...props } = this.props
    const entityKey = `${entity}:${entityId}`
    return (
      <Modal className="modal modal-history"
             title={(
               <div>
                 <Icon name="history"/>
                 <span> {titleCase(entity)} #{entityId} history</span>
               </div>
             )}
             handleCloseClick={ this.props.popModal }
             {...props}>
        {isLoading &&
          <LoadingFrame size="mini"/>
        }
        {!isLoading &&
          <EntityHistory key={ `${props.entity}:${props.entityId}` }
                         entityKey={ entityKey }
                         actions={ actions.get(entityKey, new List()) }
                         defaultExpended={ true }/>
        }
      </Modal>
    )
  }
}