import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { popModal } from '../../state/modals/reducer'
import Modal from '../Modal/Modal'
import HelpPageContent from './HelpPageContent'

@withTranslation('help')
@connect(null, { popModal })
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
  page: PropTypes.string.isRequired,
}

export default HelpModal
