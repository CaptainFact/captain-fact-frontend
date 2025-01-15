import React from 'react'
import { withTranslation } from 'react-i18next'
import { reduxForm } from 'redux-form'

import * as userAPI from '../../API/http_api/current_user'
import { USER_PICTURE_XLARGE } from '../../constants'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
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
@withTranslation('user')
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

  render() {
    return (
      <form
        className="max-w-md mx-auto p-6"
        onSubmit={this.props.handleSubmit(this.submitForm.bind(this))}
      >
        {this.renderContent()}
      </form>
    )
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
        <div className="px-2 my-12">
          <Card className="max-w-[500px] mx-auto">
            <CardHeader>
              <CardTitle>{this.props.t('resetPassword')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-3">
                <UserPicture user={user} size={USER_PICTURE_XLARGE} />
                <UserAppellation user={user} withoutActions />
              </div>
              <div className="flex flex-col gap-3 border-t pt-4 mt-4">
                <UserPasswordField t={this.props.t} />
                <UserPasswordRepeatField t={this.props.t} />
                <Button type="submit" variant="outline">
                  {this.props.t('resetPassword')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
    if (this.state.status === 'confirm_success') {
      return <div className="px-2 my-12">{this.props.t('resetPasswordSuccess')}</div>
    }
  }
}
