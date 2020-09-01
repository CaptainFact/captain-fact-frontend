import React from 'react'
import isPromise from 'is-promise'
import classNames from 'classnames'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'

import Modal from './Modal'
import { Icon } from '../Utils'
import { popModal } from '../../state/modals/reducer'
import { handleFormEffectResponse } from '../../lib/handle_effect_response'

@withNamespaces('main')
@connect(null, { popModal })
export class ModalFormContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { isSubmitting: false }
    this.close = this.close.bind(this)
  }

  handleSubmit(submitFunc) {
    return (data) => {
      const promise = submitFunc(data)
      if (isPromise(promise)) {
        this.setState({ isSubmitting: true })
        return promise.then(
          handleFormEffectResponse({
            onSuccess: () => this.props.popModal(),
            onError: () => this.setState({ isSubmitting: false }),
          })
        )
      }
    }
  }

  close() {
    if (this.props.handleAbort) {
      this.props.handleAbort()
    }
    this.props.popModal()
  }

  renderFormButtons() {
    const confirmType = this.props.confirmType ? `is-${this.props.confirmType}` : 'is-primary'
    const isSubmitting = this.props.isSubmitting || this.state.isSubmitting
    return (
      <div className="form-buttons">
        <a
          type="submit"
          disabled={isSubmitting || this.props.confirmLoading || this.props.confirmDisabled}
          className={classNames('button', confirmType, {
            'is-loading': isSubmitting || this.props.confirmLoading,
          })}
          onClick={() => this.refs.form.submit()}
        >
          <Icon name={this.props.confirmIcon || 'floppy-o'} />
          <div>{this.props.confirmText || this.props.t('actions.save')}</div>
        </a>
        <a
          type="reset"
          className={classNames('button')}
          disabled={isSubmitting}
          onClick={this.close}
        >
          <Icon name="ban" />
          <div>{this.props.t('actions.cancel')}</div>
        </a>
      </div>
    )
  }

  render() {
    const { FormComponent, handleConfirm, className, formProps = {}, ...modalParams } = this.props
    return (
      <Modal
        {...modalParams}
        handleCloseClick={this.close}
        className={classNames('modal-form', className)}
        footer={this.renderFormButtons()}
      >
        <FormComponent ref="form" {...formProps} onSubmit={this.handleSubmit(handleConfirm)} />
      </Modal>
    )
  }
}
