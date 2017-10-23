import React from 'react'
import AsyncEffect from './AsyncEffect'
import { ErrorView } from './ErrorView'
import Notification from './Notification'
import { Icon } from './Icon'
import { translate } from 'react-i18next'


@translate('main')
export default class AsyncEffectPage extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { step: 'loading', payload: null }
  }

  onSuccess(payload) {
    if (this.props.onSuccess) {
      payload = this.props.onSuccess(payload)
      if (!payload)
        return
    }
    this.setState({ step: 'success', payload })
  }

  onError(payload) {
    if (this.props.onError) {
      payload = this.props.onError(payload)
      if (!payload)
        return
    }
    this.setState({ step: 'error', payload })
  }

  render() {
    if (this.state.step === 'loading')
      return (
        <AsyncEffect
          effect={this.props.effect}
          onSuccess={this.onSuccess.bind(this)}
          onError={this.onError.bind(this)}
        />
      )
    else if (this.state.step === 'error')
      return (
        <ErrorView
          error={this.state.payload}
          i18nNS={this.props.errorNamespace}
        />
      )
    else if (this.state.step === 'success' && typeof(this.state.payload) === 'string')
      return (
        <div className="message-view">
          <Notification type="success">
            <Icon name="check"/> {this.props.t(this.state.payload)}
          </Notification>
        </div>
      )
    return null
  }
}