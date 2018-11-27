import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import PropTypes from 'prop-types'

import Modal from '../Modal/Modal'
import HelpPageContent from './HelpPageContent'
import { popModal } from '../../state/modals/reducer'

@withNamespaces('help')
@connect(
  null,
  { popModal }
)
class HelpModal extends PureComponent {
  render() {
    return (
      <Modal title={this.props.t('pages.achievements')}>
        <HelpPageContent page={this.props.page} onLinkClick={this.props.popModal} />
      </Modal>
    )
  }
}

HelpModal.propTypes = {
  page: PropTypes.string.isRequired
}

export default HelpModal
