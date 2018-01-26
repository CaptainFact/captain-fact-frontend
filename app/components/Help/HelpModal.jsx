import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import Modal from '../Modal/Modal'
import HelpPageContent from './HelpPageContent'


@translate('help')
class HelpModal extends PureComponent {
  render() {
    return (
      <Modal title={this.props.t('pages.achievements')}>
        <HelpPageContent page={this.props.page}/>
      </Modal>
    )
  }
}

HelpModal.propTypes = {
  page: PropTypes.string.isRequired
}

export default HelpModal
