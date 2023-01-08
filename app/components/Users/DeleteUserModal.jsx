import React from 'react'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { Field, formValueSelector, reduxForm } from 'redux-form'

import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { ModalFormContainer } from '../Modal/ModalFormContainer'
import { Icon } from '../Utils/Icon'

const DELETE_FORM = 'deleteAccount'

@reduxForm({ form: DELETE_FORM })
class DeleteForm extends React.PureComponent {
  render() {
    return (
      <div className="delete-account-form">
        <h2 className="title is-2 has-text-centered">
          <Icon size="large" name="exclamation-triangle" />
          This action is irreversible
        </h2>
        <hr />
        <h4 className="title is-4">Deleting your account will...</h4>
        <ul>
          <li>Delete all your votes</li>
          <li>Delete all your flags</li>
          <li>Delete all your personal data (email, username...etc)</li>
          <li>Anonymize all your comments</li>
          <li>Anonymize your actions history</li>
        </ul>
        <hr />
        <p className="is-size-5">Type your username below to confirm the deletion :</p>
        <Field component="input" className="input" name="usernameConfirm" />
      </div>
    )
  }
}

const valueSelector = formValueSelector(DELETE_FORM)

@connect((state) => ({ usernameConfirm: valueSelector(state, 'usernameConfirm') }))
@withNamespaces('main')
@withLoggedInUser
export default class DeleteUserModal extends React.PureComponent {
  render() {
    const { t, ...otherProps } = this.props
    const isValid = this.props.usernameConfirm === this.props.loggedInUser.username
    return (
      <ModalFormContainer
        title={t('user:deleteAccount')}
        FormComponent={DeleteForm}
        confirmIcon="trash-o"
        confirmType="danger"
        confirmDisabled={!isValid}
        confirmText={t('actions.delete')}
        {...otherProps}
      />
    )
  }
}
