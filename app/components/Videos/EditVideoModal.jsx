import React from 'react'
import {connect} from 'react-redux'
import {translate} from 'react-i18next'
import { Field, reduxForm } from 'redux-form'

import Modal from '../Modal/Modal'
import {popModal} from '../../state/modals/reducer'
import {Icon} from '../Utils/Icon'
import {flashErrorMsg, flashSuccessMsg} from '../../state/flashes/reducer'
import {FieldWithButton} from '../FormUtils/index'
import {shiftStatements} from '../../state/video_debate/statements/effects'


const TimeShiftForm = reduxForm({form: 'shiftStatements', initialValues: {offset: 0}})(translate('main')(
  ({handleSubmit, t}) =>
    <form onSubmit={handleSubmit}>
      <Field component={FieldWithButton}
             name="offset"
             type="number"
             placeholder="+0s"
             buttonLabel={t('actions.apply')}
             validate={offset => !offset}/>
    </form>
))

@connect(null, {popModal, flashErrorMsg, flashSuccessMsg, shiftStatements})
@translate('videoDebate')
export default class EditVideoModal extends React.PureComponent {
  render() {
    return (
      <Modal
        handleCloseClick={this.props.popModal}
        title={<span><Icon name="pencil"/> {this.props.t('video.edit')}</span>}
      >
        <h4 className="title is-4">{this.props.t('video.shiftStatements')}</h4>
        <TimeShiftForm onSubmit={this.shiftSubmit}/>
      </Modal>
    )
  }

  shiftSubmit = ({offset}) => {
    if (offset) {
      return this.props.shiftStatements(offset).then(() => this.props.popModal())
    }
  }
}
