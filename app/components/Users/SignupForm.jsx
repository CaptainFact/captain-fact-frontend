import React from 'react'
import { reduxForm, SubmissionError } from 'redux-form'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router'
import { withNamespaces } from 'react-i18next'

import { renderAllUserFields, submitButton, validatePasswordRepeat } from './UserFormFields'
import ThirdPartyAuthList from './ThirdPartyAuthList'
import Alert from '../Utils/Alert'
import Message from '../Utils/Message'
import InvitationRequestForm from './InvitationRequestForm'
import { errorToFlash } from '../../state/flashes/reducer'
import { INVITATION_SYSTEM } from '../../config'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { signUp } from '../../API/http_api/current_user'

const SignupForm = ({ location, t }) => {
  if (!INVITATION_SYSTEM || location.query.invitation_token) {
    return (
      <RealSignupForm
        initialValues={{
          invitation_token: location.query.invitation_token,
        }}
      />
    )
  }
  return (
    <div className="user-form">
      <Message type="warning" header={t('invitationOnlyTitle')}>
        <div>
          {t('invitationOnlyBody')}
          <hr />
          <InvitationRequestForm />
        </div>
      </Message>
    </div>
  )
}

export default withRouter(withNamespaces('user')(SignupForm))

@withRouter
@withNamespaces('user')
@reduxForm({ form: 'signupForm', validate: validatePasswordRepeat })
@connect((state) => ({ locale: state.UserPreferences.locale }), { errorToFlash })
@withLoggedInUser
class RealSignupForm extends React.PureComponent {
  UNSAFE_componentWillReceiveProps(props) {
    // Redirect to user profile when logged in
    if (props.isAuthenticated) {
      props.router.push(`/u/${props.loggedInUser.username}`)
    }
  }

  submit({ invitation_token, ...user }) {
    return signUp({ ...user, locale: this.props.locale }, invitation_token)
      .then(({ user, token }) => {
        this.props.updateLoggedInUser(user, token)
      })
      .catch((e) => {
        if (typeof e === 'string') {
          this.props.errorToFlash(e)
        } else {
          throw new SubmissionError(e)
        }
      })
  }

  render() {
    const { valid, error, t } = this.props

    return (
      <form className="form user-form" onSubmit={this.props.handleSubmit(this.submit.bind(this))}>
        {error && <Alert type="danger">{error}</Alert>}
        <strong>
          {t('alreadyHaveAccountQuestion')} <Link to="login">{t('login')}</Link>
        </strong>
        <hr />
        {renderAllUserFields(valid, t)}
        {submitButton(t('signup'), valid)}
        <ThirdPartyAuthList />
      </form>
    )
  }
}
