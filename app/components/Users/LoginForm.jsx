import React from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router'
import { withNamespaces } from 'react-i18next'

import ThirdPartyAuthList from './ThirdPartyAuthList'
import { emailOrUsernameField, passwordField, submitButton } from './UserFormFields'
import { login } from '../../state/users/current_user/effects'
import Notification from '../Utils/Notification'
import { tError } from '../../lib/errors'

@reduxForm({ form: 'loginForm' })
@connect(
  ({ CurrentUser: { data, error } }) => ({ CurrentUser: data, error }),
  { login }
)
@withRouter
@withNamespaces('user')
export default class LoginForm extends React.PureComponent {
  componentWillReceiveProps(props) {
    // Redirect when already logged in
    if (props.CurrentUser.id) {
      this.props.router.push('/videos')
    }
  }

  render() {
    const { handleSubmit, valid, error, t } = this.props

    return (
      <form
        className="form user-form"
        onSubmit={handleSubmit(user =>
          this.props.login({ provider: 'identity', params: user })
        )}
      >
        {error && <Notification type="danger">{tError(t, error)}</Notification>}
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
