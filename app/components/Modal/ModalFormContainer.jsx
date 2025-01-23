import isPromise from 'is-promise'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { cn } from '@/lib/css-utils'

import { handleFormEffectResponse } from '../../lib/handle_effect_response'
import { popModal } from '../../state/modals/reducer'
import { Button } from '../ui/button'
import Modal from './Modal'

@withTranslation('main')
@connect(null, { popModal })
export class ModalFormContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { isSubmitting: false }
    this.close = this.close.bind(this)
    this.formRef = React.createRef()
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
          }),
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
    const isSubmitting = this.props.isSubmitting || this.state.isSubmitting
    return (
      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          disabled={isSubmitting || this.props.confirmLoading || this.props.confirmDisabled}
          loading={isSubmitting || this.props.confirmLoading}
          onClick={() => this.formRef.current?.submit()}
          variant="destructive"
        >
          <div>{this.props.confirmText || this.props.t('actions.save')}</div>
        </Button>
        <Button type="reset" variant="outline" disabled={isSubmitting} onClick={this.close}>
          <div>{this.props.t('actions.cancel')}</div>
        </Button>
      </div>
    )
  }

  render() {
    const { FormComponent, handleConfirm, className, formProps = {}, ...modalParams } = this.props
    return (
      <Modal
        {...modalParams}
        handleCloseClick={this.close}
        className={cn('modal-form', className)}
        footer={this.renderFormButtons()}
      >
        <FormComponent
          ref={this.formRef}
          {...formProps}
          onSubmit={this.handleSubmit(handleConfirm)}
        />
      </Modal>
    )
  }
}
