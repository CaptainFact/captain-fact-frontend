import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { withRouter } from 'react-router'
import { withNamespaces } from 'react-i18next'
import React from 'react'

import {
  renderAllUserFields,
  submitButton,
  validatePasswordRepeat
} from './UserFormFields'
import { updateInfo } from '../../state/users/current_user/effects'
import { Icon } from '../Utils/Icon'
import { handleFormEffectResponse } from '../../lib/handle_effect_response'

@connect(
  ({ CurrentUser: { data, isLoading } }) => ({
    initialValues: data.toObject(),
    user: data,
    enableReinitialize: true,
    isLoading
  }),
  { updateInfo }
)
@reduxForm({ form: 'editUserForm', validate: validatePasswordRepeat })
@withRouter
@withNamespaces('user')
export default class EditUserForm extends React.PureComponent {
  componentDidUpdate() {
    // Redirect to user profile when logged in
    if (!this.props.isLoading && !this.props.user.id) this.props.router.push('/')
  }

  submit(user) {
    return this.props.updateInfo(user).then(handleFormEffectResponse())
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
