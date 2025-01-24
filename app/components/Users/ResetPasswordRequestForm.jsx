import React from 'react'
import { withTranslation } from 'react-i18next'
import { reduxForm } from 'redux-form'

import { resetPasswordRequest } from '../../API/http_api/current_user'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ErrorView } from '../Utils/ErrorView'
import { UserEmailField } from './UserFormFields'

// Fields are auto-validated, only validate password and repeat are the same
const validate = (params) => {
  if (params.password) {
    return params.password === params.passwordRepeat ? {} : { passwordRepeat: "Doesn't match" }
  }
  return {}
}

@reduxForm({ form: 'resetPassword', validate })
@withTranslation('user')
export default class ResetPasswordRequestForm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { status: 'ready', payload: null }
  }

  submitForm(e) {
    resetPasswordRequest(e.email).then(
      () => this.setState({ status: 'done' }),
      () => this.setState({ status: 'error', payload: 'reset_failed' }),
    )
  }

  renderContent() {
    if (this.state.status === 'error') {
      return <ErrorView error={this.state.payload} i18nNS="user:errors.error" canGoBack={false} />
    }
    if (this.state.status === 'ready') {
      return (
        <div className="space-y-4">
          <UserEmailField t={this.props.t} />
          <Button type="submit" variant="outline">
            {this.props.t('resetPassword')}
          </Button>
        </div>
      )
    }
    if (this.state.status === 'done') {
      return this.props.t('resetPasswordRequestSuccess')
    }
  }

  render() {
    return (
      <div className="px-2 my-12">
        <Card className="max-w-[500px] mx-auto">
          <CardHeader>
            <CardTitle>{this.props.t('resetPassword')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={this.props.handleSubmit(this.submitForm.bind(this))}>
              {this.renderContent()}
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }
}
