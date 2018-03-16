import React from "react"
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { formValueSelector } from 'redux-form'

import FlagForm from './FlagForm'
import { ModalFormContainer } from '../Modal/ModalFormContainer'
import HttpApi from '../../API/http_api'


const flagFormValueSelector = formValueSelector('flagForm')

@connect(state => ({selectedReason: flagFormValueSelector(state, 'reason')}))
@translate('videoDebate')
export default class ModalFlag extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {isLoading: true, flagsAvailable: 0, error: null}
  }

  componentDidMount() {
    HttpApi.get('users/me/available_flags')
      .then(({flags_available}) =>
        this.setState({isLoading: false, flagsAvailable: flags_available})
      )
      .catch(e => this.setState({isLoading: false, error: e}))
  }

  render() {
    const { isLoading, flagsAvailable } = this.state
    const { t, handleAbort, selectedReason, comment, ...otherProps } = this.props
    const availableStr = t('flagForm.xAvailable', {count: flagsAvailable})
    return (
      <ModalFormContainer handleAbort={handleAbort}
                          handleCloseClick={handleAbort}
                          title={t('flagForm.title')}
                          confirmType="danger"
                          confirmLoading={isLoading}
                          confirmDisabled={!flagsAvailable || !selectedReason}
                          confirmText={`${t('main:actions.flag')} (${availableStr})`}
                          confirmIcon="flag"
                          FormComponent={FlagForm}
                          formProps={{comment: comment}}
                          helpLink="/help/moderation"
                          {...otherProps}
      />
    )
  }
}
