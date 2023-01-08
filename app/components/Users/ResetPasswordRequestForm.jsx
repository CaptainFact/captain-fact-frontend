import React from 'react'
import { reduxForm } from 'redux-form'
import { withNamespaces } from 'react-i18next'
import { UserEmailField } from './UserFormFields'
import { ErrorView } from '../Utils/ErrorView'
import Alert from '../Utils/Alert'
import { resetPasswordRequest } from '../../API/http_api/current_user'

// Fields are auto-validated, only validate password and repeat are the same
const validate = (params) => {
  if (params.password) {
    return params.password === params.passwordRepeat ? {} : { passwordRepeat: "Doesn't match" }
  }
  return {}
}

@reduxForm({ form: 'resetPassword', validate })
@withNamespaces('user')
export default class ResetPasswordRequestForm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { status: 'ready', payload: null }
  }

  submitForm(e) {
    resetPasswordRequest(e.email).then(
      () => this.setState({ status: 'done' }),
      () => this.setState({ status: 'error', payload: 'reset_failed' })
    )
  }

  renderContent() {
    if (this.state.status === 'error') {
      return <ErrorView error={this.state.payload} i18nNS="user:errors.error" canGoBack={false} />
    }
    if (this.state.status === 'ready') {
      return (
        <div>
          <UserEmailField t={this.props.t} />
          <button type="submit" className="button">
            {this.props.t('resetPassword')}
          </button>
        </div>
      )
    }
    if (this.state.status === 'done') {
      return <Alert>{this.props.t('resetPasswordRequestSuccess')}</Alert>
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
