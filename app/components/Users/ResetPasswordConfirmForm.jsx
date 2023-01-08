import React from 'react'
import { withNamespaces } from 'react-i18next'
import { reduxForm } from 'redux-form'

import * as userAPI from '../../API/http_api/current_user'
import { USER_PICTURE_XLARGE } from '../../constants'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import Alert from '../Utils/Alert'
import { ErrorView } from '../Utils/ErrorView'
import { LoadingFrame } from '../Utils/LoadingFrame'
import UserAppellation from './UserAppellation'
import { UserPasswordField, UserPasswordRepeatField } from './UserFormFields'
import UserPicture from './UserPicture'

// Fields are auto-validated, only validate password and repeat are the same
const validate = (params) => {
  if (params.password) {
    return params.password === params.passwordRepeat ? {} : { passwordRepeat: "Doesn't match" }
  }
  return {}
}

@reduxForm({ form: 'resetPassword', validate })
@withNamespaces('user')
@withLoggedInUser
export default class ResetPasswordConfirmForm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { status: 'waiting_verification', user: null }
  }

  componentDidMount() {
    userAPI
      .resetPasswordVerify(this.props.match.params.token)
      .then((user) => {
        this.setState({ status: 'confirm', user })
      })
      .catch(() => {
        this.setState({ status: 'error', user: 'invalid_token' })
      })
  }

  submitForm(e) {
    userAPI
      .resetPasswordConfirm(this.props.match.params.token, e.password)
      .then((user) => {
        userAPI.signIn('identity', { ...user, password: e.password }).then(({ user, token }) => {
          this.props.updateLoggedInUser(user, token)
        })
        this.setState({ status: 'confirm_success' })
      })
      .catch(() => {
        this.setState({ status: 'error', user: 'reset_failed' })
      })
  }

  renderContent() {
    if (this.state.status === 'error') {
      return <ErrorView error={this.state.user} i18nNS="user:errors.error" canGoBack={false} />
    }

    if (this.state.status === 'verify') {
      return <LoadingFrame />
    }

    if (this.state.status === 'confirm') {
      const user = this.state.user
      return (
        <div>
          <div className="user-box">
            <UserPicture user={user} size={USER_PICTURE_XLARGE} />
            <UserAppellation user={user} withoutActions />
          </div>
          <UserPasswordField t={this.props.t} />
          <UserPasswordRepeatField t={this.props.t} />
          <button type="submit" className="button">
            {this.props.t('resetPassword')}
          </button>
        </div>
      )
    }
    if (this.state.status === 'confirm_success') {
      return <Alert>{this.props.t('resetPasswordSuccess')}</Alert>
    }
  }

  render() {
    return (
      <form
        className="form user-form"
        onSubmit={this.props.handleSubmit(this.submitForm.bind(this))}
      >
        {this.renderContent()}
      </form>
    )
  }
}
