import React from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router'
import { translate } from 'react-i18next'

import { register, requestInvitation } from '../../state/users/current_user/effects'
import {
  renderAllUserFields, submitButton,
  validatePasswordRepeat
} from './UserFormFields'
import ThirdPartyAuthList from './ThirdPartyAuthList'
import Notification from '../Utils/Notification'
import Message from '../Utils/Message'
import InvitationRequestForm from './InvitationRequestForm'
import { errorToFlash } from '../../state/flashes/reducer'
import { handleFormEffectResponse } from '../../lib/handle_effect_response'


const SignupForm = ({location, t}) => {
  if (location.query.invitation_token)
    return (
      <RealSignupForm initialValues={{
        invitation_token: location.query.invitation_token}}
      />
    )
  return (
    <div className="user-form">
      <Message
        type="warning"
        header={t('invitationOnlyTitle')}
      >
        <div>
          {t('invitationOnlyBody')}
          <hr/>
          <InvitationRequestForm/>
        </div>
      </Message>
    </div>
  )
}

export default withRouter(translate('user')(SignupForm))

@withRouter
@translate('user')
@reduxForm({form: 'signupForm', validate: validatePasswordRepeat})
@connect(
  ({CurrentUser: {data}, UserPreferences: {locale}}) => ({CurrentUser: data, locale}),
  {register, requestInvitation, errorToFlash}
)
class RealSignupForm extends React.PureComponent {
  componentWillReceiveProps(props) {
    // Redirect to user profile when logged in
    if (props.CurrentUser.id)
      this.props.router.push(`/u/${props.CurrentUser.username}`)
  }

  submit({invitation_token, ...user}) {
    const registerParams = {invitation_token, user: {...user, locale: this.props.locale}}
    return this.props.register(registerParams)
      .then(handleFormEffectResponse({
        onError: msg => (typeof (msg) === 'string' ? this.props.errorToFlash(msg) : null)
      }))
  }

  render() {
    const { valid, error, t } = this.props

    return (
      <form
        className="form user-form"
        onSubmit={this.props.handleSubmit(this.submit.bind(this))}
      >
        {error && <Notification type="danger">{error}</Notification>}
        {renderAllUserFields(valid, t)}
        {submitButton(t('signup'), valid)}
        <div>
          {t('alreadyHaveAccountQuestion')} <Link to="login">{t('login')}</Link>.
        </div>
        <ThirdPartyAuthList/>
      </form>
    )}
}
