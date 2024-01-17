import React from 'react'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import isEmail from 'validator/lib/isEmail'

import { requestInvitation } from '../../API/http_api/current_user'
import browserLocale from '../../i18n/browser_locale'
import { addFlash, errorToFlash } from '../../state/flashes/reducer'
import FieldWithButton from '../FormUtils/FieldWithButton'
import Alert from '../Utils/Alert'
import { Icon } from '../Utils/Icon'

const validate = ({ email }) => {
  if (!email || !isEmail(email)) {
    return { email: 'Email is not valid' }
  }
  return {}
}

@reduxForm({ form: 'newsletterSubscribeForm', validate })
@withNamespaces('home')
@connect(null, { addFlash, errorToFlash })
export default class InvitationRequestForm extends React.PureComponent {
  state = { confirmed: false }

  submit(formValues) {
    return requestInvitation(formValues.email, browserLocale()).then(
      () => this.setState({ confirmed: true }),
      (msg) => {
        this.props.errorToFlash(msg)
        throw new SubmissionError({ email: 'invalid_email' })
      },
    )
  }

  getContent() {
    if (!this.state.confirmed) {
      return (
        <Field
          component={FieldWithButton}
          name="email"
          className="is-medium"
          buttonClassName="is-medium"
          placeholder={this.props.t('emailPlaceholder')}
          buttonLabel={this.props.t('main:actions.send')}
        />
      )
    }
    return (
      <Alert type="success">
        <Icon name="check" /> {this.props.t('home:inviteSuccess')}
      </Alert>
    )
  }

  render() {
    return (
      <form
        className="invitation-request-form"
        onSubmit={this.props.handleSubmit(this.submit.bind(this))}
      >
        {this.getContent()}
      </form>
    )
  }
}
