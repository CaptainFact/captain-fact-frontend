import { get } from 'lodash'
import { CircleAlert } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'
import { reduxForm, SubmissionError } from 'redux-form'

import { signIn } from '../../API/http_api/current_user'
import { tError } from '../../lib/errors'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { Alert, AlertDescription } from '../ui/alert'
import { Separator } from '../ui/separator'
import { SignInUpContainer } from './SignInUpContainer'
import { submitButton, UserEmailOrUsernameField, UserPasswordField } from './UserFormFields'

@reduxForm({ form: 'loginForm' })
@withRouter
@withTranslation('user')
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
      <SignInUpContainer>
        <form
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
          <div className="mb-4">
            <strong>{t('needAnAccountQuestion')}</strong>{' '}
            <span className="ml-1">
              <Link to="/signup">{t('signup')}</Link>
            </span>
          </div>
          <hr className="mb-6" />
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                <CircleAlert size="1em" className="inline mr-2" />
                {tError(t, error)}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <UserEmailOrUsernameField t={t} />
            <UserPasswordField t={t} />
          </div>
          <div className="mt-6">
            {submitButton(t('login'), valid, { loading: this.props.submitting })}
          </div>
          <Separator className="my-6" />
          <div className="text-center">
            <Link to="/reset_password" className="block text-sm">
              {t('forgottenPassword')}
            </Link>
          </div>
        </form>
      </SignInUpContainer>
    )
  }
}
