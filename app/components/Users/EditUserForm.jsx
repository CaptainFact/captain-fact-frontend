import React from 'react'
import { reduxForm, SubmissionError } from 'redux-form'
import { withRouter } from 'react-router'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'

import {
  renderAllUserFields,
  submitButton,
  validatePasswordRepeat
} from './UserFormFields'
import { Icon } from '../Utils/Icon'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { setUser as setDisplayedUser } from '../../state/users/displayed_user/reducer'
import { updateUserInfo } from '../../API/http_api/current_user'

// A dirty trick to make the migration of user from redux to context easier.
// As we plan to replace ReduxForm by Formik, there is no need in spending
// time making a proper adaptation.
const dirtyLoggedInUserToReduxForm = Component => props => {
  const { loggedInUser, ...otherProps } = props

  return (
    <Component
      {...otherProps}
      initialValues={loggedInUser && loggedInUser.toObject()}
      enableReinitialize
    />
  )
}

@withLoggedInUser
@dirtyLoggedInUserToReduxForm
@reduxForm({ form: 'editUserForm', validate: validatePasswordRepeat })
@withRouter
@withNamespaces('user')
@connect(
  null,
  { setDisplayedUser }
)
export default class EditUserForm extends React.PureComponent {
  componentDidUpdate() {
    // Redirect to user profile when logged in
    if (!this.props.loggedInUserLoading && !this.props.isAuthenticated) {
      this.props.router.push('/')
    }
  }

  submit(user) {
    return updateUserInfo(user)
      .then(user => {
        this.props.updateLoggedInUser(user)
        this.props.setDisplayedUser(user)
      })
      .catch(e => {
        throw new SubmissionError(e)
      })
  }

  render() {
    const { handleSubmit, valid, t } = this.props
    return (
      <form
        className="edit-user-form form"
        onSubmit={handleSubmit(user => this.submit(user))}
      >
        {renderAllUserFields(valid, t, true)}
        {submitButton(
          <div>
            <Icon name="floppy-o" />
            <span>{t('main:actions.save')}</span>
          </div>,
          valid
        )}
      </form>
    )
  }
}
