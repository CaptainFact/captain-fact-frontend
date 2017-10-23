import React from 'react'
import { withRouter } from 'react-router'
import AsyncEffectPage from '../Utils/AsyncEffectPage'
import { confirmEmail } from '../../state/users/current_user/effects'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'


@withRouter
@connect(null, {confirmEmail})
@translate('user')
export default class ConfirmEmail extends React.PureComponent {
  render() {
    return (
      <AsyncEffectPage
        effect={() => this.props.confirmEmail(this.props.params.token)}
        onSuccess={() => "user:emailConfirmed"}
        errorNamespace="user:errors.error"
      />
    )
  }
}