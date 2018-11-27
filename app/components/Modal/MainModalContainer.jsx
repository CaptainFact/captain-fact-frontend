import React from 'react'
import { connect } from 'react-redux'

import { addModal, popModal } from '../../state/modals/reducer'

@connect(
  ({ Modals }) => ({ modal: Modals.first() }),
  { addModal, popModal }
)
export class MainModalContainer extends React.PureComponent {
  renderModal() {
    const { Modal, props } = this.props.modal
    return <Modal {...props} />
  }

  render() {
    return <div id="main-modal-container">{this.props.modal && this.renderModal()}</div>
  }
}
