import React from 'react'
import isPromise from 'is-promise'
import classNames from 'classnames'

import { connect } from 'react-redux'
import Modal from './Modal'
import { Icon } from '../Utils/Icon'
import { popModal } from '../../state/modals/reducer'
import { handleEffectResponse } from '../../lib/handle_effect_response'
import { omit } from 'lodash'

@connect(null, { popModal })
export class ModalConfirm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { isSubmitting: false }
    this.close = this.close.bind(this)
  }

  handleSubmit(v) {
    const promise = this.props.handleConfirm(v)
    if (isPromise(promise)) {
      this.setState({ isSubmitting: true })
      return promise.then(
        handleEffectResponse({
          onSuccess: () => this.props.popModal(),
          onError: () => this.setState({ isSubmitting: false }),
        })
      )
    }
  }

  renderFormButtons() {
    return (
      <div className="form-buttons">
        <a
          className={classNames('button', 'is-danger', {
            'is-loading': this.state.isSubmitting,
          })}
          disabled={this.state.isSubmitting || this.props.confirmDisabled}
          onClick={this.handleSubmit.bind(this)}
        >
          {this.props.confirmIcon && <Icon name={this.props.confirmIcon} />}
          <span>{this.props.confirmText}</span>
        </a>
        <a className="button" disabled={this.state.isSubmitting} onClick={this.close}>
          {this.props.abortIcon && <Icon name={this.props.abortIcon} />}
          <span>{this.props.abortText}</span>
        </a>
      </div>
    )
  }

  close() {
    if (this.props.handleAbort) {
      this.props.handleAbort()
    }
    this.props.popModal()
  }

  render() {
    const { className, content, message, ...props } = this.props
    return (
      <Modal
        className={classNames('modal-confirm', className)}
        handleCloseClick={this.close}
        footer={this.renderFormButtons()}
        {...omit(props, ['handleConfirm'])}
      >
        {content && (
          <div>
            {content}
            {message && <hr />}
          </div>
        )}
        <h3 className="title is-4">{message}</h3>
      </Modal>
    )
  }
}
