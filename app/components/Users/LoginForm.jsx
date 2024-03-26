import { get } from 'lodash'
import React from 'react'
import { withNamespaces } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'
import { reduxForm, SubmissionError } from 'redux-form'

import { signIn } from '../../API/http_api/current_user'
import { tError } from '../../lib/errors'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import Alert from '../Utils/Alert'
import { submitButton, UserEmailOrUsernameField, UserPasswordField } from './UserFormFields'

@reduxForm({ form: 'loginForm' })
@withRouter
@withNamespaces('user')
@withLoggedInUser
export default class LoginForm extends React.PureComponent {
  state = {
    error: null,
  }

  redirect() {
    const pathName = get(this.props.location, 'state.redirect', '/videos')
    this.props.history.replace(pathName)
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
        <UserEmailOrUsernameField t={t} />
        <UserPasswordField t={t} />
        {submitButton(t('login'), valid)}
      </form>
    )
  }
}
