import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { reduxForm, SubmissionError } from 'redux-form'

import { toastError } from '@/lib/toasts'

import { signUp } from '../../API/http_api/current_user'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { SignInUpContainer } from './SignInUpContainer'
import { renderAllUserFields, submitButton, validatePasswordRepeat } from './UserFormFields'

@withRouter
@withTranslation('user')
@reduxForm({ form: 'signupForm', validate: validatePasswordRepeat })
@connect((state) => ({ locale: state.UserPreferences.locale }))
@withLoggedInUser
class SignupForm extends React.PureComponent {
  componentDidUpdate(prevProps) {
    // Redirect to user profile when logged in
    if (this.props.isAuthenticated && !prevProps.isAuthenticated) {
      this.props.history.push(`/u/${this.props.loggedInUser.username}`)
    }
  }

  submit(user) {
    const searchParams = new URLSearchParams(location.search)
    const invitationToken = searchParams.get('invitation_token')
    return signUp({ ...user, locale: this.props.locale }, invitationToken)
      .then(({ user, token }) => {
        this.props.updateLoggedInUser(user, token)
      })
      .catch((e) => {
        if (typeof e === 'string') {
          toastError(e)
        } else {
          throw new SubmissionError(e)
        }
      })
  }

  render() {
    const { valid, t } = this.props

    return (
      <SignInUpContainer>
        <form onSubmit={this.props.handleSubmit(this.submit.bind(this))}>
          <div className="mb-4">
            <strong>{t('alreadyHaveAccountQuestion')}</strong>{' '}
            <span className="ml-1">
              <Link to="login">{t('login')}</Link>
            </span>
          </div>
          <hr className="mb-6" />
          <div className="space-y-4">{renderAllUserFields(t)}</div>
          <p className="text-sm text-gray-600 mb-6 mt-4">
            {t('iAgreeAndAcceptedPrivacy')}{' '}
            <Link to="/help/privacy" className="underline">
              {t('privacyLinkLabel')}
            </Link>
            .
          </p>
          <div className="mt-6">
            {submitButton(t('signup'), valid, {
              loading: this.props.submitting,
            })}
          </div>
        </form>
      </SignInUpContainer>
    )
  }
}

export default SignupForm
