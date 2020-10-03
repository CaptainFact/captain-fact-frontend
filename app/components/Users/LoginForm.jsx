import React from 'react'
import { reduxForm, SubmissionError } from 'redux-form'
import { Link, withRouter } from 'react-router'
import { withNamespaces } from 'react-i18next'
import { get } from 'lodash'

import ThirdPartyAuthList from './ThirdPartyAuthList'
import { emailOrUsernameField, passwordField, submitButton } from './UserFormFields'
import Alert from '../Utils/Alert'
import { tError } from '../../lib/errors'
import { signIn } from '../../API/http_api/current_user'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'

@reduxForm({ form: 'loginForm' })
@withRouter
@withNamespaces('user')
@withLoggedInUser
export default class LoginForm extends React.PureComponent {
  state = {
    error: null,
  }

  redirect() {
    const pathName = get(this.props.router, 'location.state.redirect', '/videos')
    this.props.router.replace(pathName)
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.redirect()
    }
  }

  componentDidUpdate() {
    // Redirect when logged in
    if (this.props.isAuthenticated) {
      this.redirect()
    }
  }

  render() {
    const { handleSubmit, updateLoggedInUser, valid, t } = this.props
    const { error } = this.state

    return (
      <form
        className="form user-form"
        onSubmit={handleSubmit((user) => {
          return signIn('identity', user)
            .then(({ user, token }) => {
              updateLoggedInUser(user, token)
            })
            .catch((e) => {
              if (typeof e === 'string') {
                this.setState({ error: e })
              }
              throw new SubmissionError(e)
            })
        })}
      >
        {error && <Alert type="danger">{tError(t, error)}</Alert>}
        <div>
          <strong>
            {t('needAnAccountQuestion')} <Link to="/signup">{t('signup')}</Link>{' '}
          </strong>
          <Link to="/reset_password" style={{ float: 'right' }}>
            {t('forgottenPassword')}
          </Link>
        </div>
        <hr />
        {emailOrUsernameField(t)}
        {passwordField(t)}
        {submitButton(t('login'), valid)}
        <ThirdPartyAuthList />
      </form>
    )
  }
}
