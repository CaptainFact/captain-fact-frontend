import { AlertTriangle } from 'lucide-react'
import React from 'react'
import { Trans, withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Field, formValueSelector, reduxForm } from 'redux-form'

import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { ModalFormContainer } from '../Modal/ModalFormContainer'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'

const DELETE_FORM = 'deleteAccount'

@reduxForm({ form: DELETE_FORM })
class DeleteForm extends React.PureComponent {
  render() {
    return (
      <div>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">
            <Trans>Deleting your account will...</Trans>
          </h4>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <Trans>Delete all your votes</Trans>
            </li>
            <li>
              <Trans>Delete all your flags</Trans>
            </li>
            <li>
              <Trans>Delete all your personal data (email, username...etc)</Trans>
            </li>
            <li>
              <Trans>Anonymize all your comments</Trans>
            </li>
            <li>
              <Trans>Anonymize your actions history</Trans>
            </li>
          </ul>
        </div>

        <div className="space-y-4 mt-4">
          <p className="text-lg">
            <Trans>Type your username below to confirm the deletion:</Trans>
          </p>
          <Field
            component={({ input }) => <Input {...input} className="w-full" />}
            name="usernameConfirm"
          />
        </div>

        <Separator className="my-5" />
        <div className="flex flex-col items-center">
          <AlertTriangle size={24} className="text-destructive" />
          <h2 className="text-2xl font-bold mt-2">
            <Trans>This action is irreversible</Trans>
          </h2>
        </div>
        <Separator className="mt-5" />
      </div>
    )
  }
}

const valueSelector = formValueSelector(DELETE_FORM)

@connect((state) => ({ usernameConfirm: valueSelector(state, 'usernameConfirm') }))
@withTranslation('main')
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
