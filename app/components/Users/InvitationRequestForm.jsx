import React from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import isEmail from 'validator/lib/isEmail'
import { translate } from 'react-i18next'
import browserLocale from '../../i18n/browser_locale'

import { FieldWithButton } from '../FormUtils/index'
import { addFlash } from '../../state/flashes/reducer'
import { connect } from 'react-redux'
import { requestInvitation } from '../../state/users/current_user/effects'
import { errorToFlash } from '../../state/flashes/reducer'
import Notification from '../Utils/Notification'
import { Icon } from '../Utils/Icon'
import { handleEffectResponse } from '../../lib/handle_effect_response'


const validate = ({email}) => {
  if (!email || !isEmail(email))
    return {email: 'Email is not valid'}
  return {}
}

@reduxForm({form: 'newsletterSubscribeForm', validate})
@translate('home')
@connect(null, {addFlash, errorToFlash, requestInvitation})
export default class InvitationRequestForm extends React.PureComponent {
  state = { confirmed: false }

  submit(user) {
    return this.props.requestInvitation({...user, locale: browserLocale()})
      .then(handleEffectResponse({
        onSuccess: () => this.setState({confirmed: true}),
        onError: msg => {
          this.props.errorToFlash(msg)
          throw new SubmissionError({email: 'invalid_email'})
        }
      }))
  }

  getContent() {
    if (!this.state.confirmed)
      return <Field component={FieldWithButton}
        name="email"
        className="is-medium"
        buttonClassName="is-medium"
        placeholder={this.props.t('emailPlaceholder')}
        buttonLabel={this.props.t('main:actions.send')}/>
    return (
      <Notification type="success">
        <Icon name="check"/> {this.props.t('home:inviteSuccess')}
      </Notification>
      )
  }

  render() {
    return (
      <form className="invitation-request-form"
        onSubmit={this.props.handleSubmit(this.submit.bind(this))}>
        {this.getContent()}
      </form>
    )
  }
}
