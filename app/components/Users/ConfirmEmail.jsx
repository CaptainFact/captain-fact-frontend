import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import AsyncEffectPage from '../Utils/AsyncEffectPage'
import { confirmEmail } from '../../state/users/current_user/effects'

@withRouter
@connect(
  null,
  { confirmEmail }
)
@withNamespaces('user')
export default class ConfirmEmail extends React.PureComponent {
  render() {
    return (
      <AsyncEffectPage
        effect={() => this.props.confirmEmail(this.props.params.token)}
        onSuccess={() => 'user:emailConfirmed'}
        errorNamespace="user:errors.error"
      />
    )
  }
}
