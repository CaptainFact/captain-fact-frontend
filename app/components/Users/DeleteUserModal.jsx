import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Field, formValueSelector, reduxForm } from 'redux-form'

import { ModalFormContainer } from '../Modal/ModalFormContainer'
import { Icon } from '../Utils/Icon'


const DELETE_FORM = 'deleteAccount'

@reduxForm({ form: DELETE_FORM })
class DeleteForm extends React.PureComponent {
  render() {
    return (
      <div>
        <h2 className="title is-2 has-text-centered">
          <Icon size="large" name="exclamation-triangle"/>
          This action is irreversible.
        </h2>
        <br/>
        Type your username below to confirm the deletion :
        <Field component="input" className="input" name="usernameConfirm"/>
      </div>
    )
  }
}

const valueSelector = formValueSelector(DELETE_FORM)


@connect(state => ({
  isValid: valueSelector(state, 'usernameConfirm') === state.CurrentUser.data.username
}))
@translate('main')
export default class DeleteUserModal extends React.PureComponent {
  render() {
    const { t, isValid, ...otherProps } = this.props
    return (
      <ModalFormContainer
        message="This action is irreversible. All your data (comments, votes...etc) will be deleted."
        FormComponent={DeleteForm}
        confirmIcon="trash"
        confirmType="danger"
        confirmDisabled={!isValid}
        confirmText={t('actions.delete')}
        {...otherProps}
      />
    )
  }
}