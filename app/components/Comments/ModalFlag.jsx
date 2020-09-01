import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { formValueSelector } from 'redux-form'

import FlagForm from './FlagForm'
import { ModalFormContainer } from '../Modal/ModalFormContainer'
import HttpApi from '../../API/http_api'

const flagFormValueSelector = formValueSelector('flagForm')

@connect((state) => ({ selectedReason: flagFormValueSelector(state, 'reason') }))
@withNamespaces('videoDebate')
export default class ModalFlag extends React.PureComponent {
  state = { isLoading: true, flagsAvailable: 0, error: null }

  componentDidMount() {
    HttpApi.get('users/me/available_flags')
      .then(({ flags_available }) =>
        this.setState({ isLoading: false, flagsAvailable: flags_available })
      )
      .catch((e) => this.setState({ isLoading: false, error: e }))
  }

  render() {
    const { isLoading, flagsAvailable } = this.state
    const { t, handleAbort, selectedReason, comment, initialReason, ...otherProps } = this.props
    return (
      <ModalFormContainer
        handleAbort={handleAbort}
        handleCloseClick={handleAbort}
        title={t('flagForm.title')}
        confirmType="danger"
        confirmLoading={isLoading}
        confirmDisabled={!flagsAvailable || !selectedReason}
        confirmText={this.renderConfirmText(t, flagsAvailable)}
        confirmIcon="flag"
        FormComponent={FlagForm}
        formProps={{ comment, initialValues: { reason: initialReason } }}
        helpLink="/help/moderation"
        {...otherProps}
      />
    )
  }

  renderConfirmText(t, flagsAvailable) {
    return (
      <span>
        {t('main:actions.flag')}{' '}
        {flagsAvailable === -1 ? null : (
          <small>({t('flagForm.xAvailable', { count: flagsAvailable })})</small>
        )}
      </span>
    )
  }
}
