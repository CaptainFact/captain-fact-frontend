import React from "react"
import { Field, reduxForm } from 'redux-form'
import { translate } from 'react-i18next'

import { CommentDisplay } from './CommentDisplay'


// Common validator for Signup / Login
const validate = ({reason}) => {
  if (!reason)
    return {reason: "Cannot be empty"}
  return {}
}

@reduxForm({form: 'flagForm', validate})
@translate('videoDebate')
export default class FlagForm extends React.PureComponent {
  renderReasonRadioEntry(value, i18nKey) {
    const label = this.props.t(`flagForm.${i18nKey}`)
    return (
      <label className="radio">
        <Field name="reason" component="input" type="radio" value={value}/> {label}
      </label>
    )
  }

  render() {
    const { handleSubmit } = this.props

    return (
      <form className="form flag-form" onSubmit={handleSubmit}>
        <CommentDisplay comment={this.props.comment} withoutActions={true} hideThread={true}/>
        <hr/>
        <div className="field">
          <p className="control">
            { this.renderReasonRadioEntry('1', 'spam') }
            { this.renderReasonRadioEntry('2', 'bad_language') }
            { this.renderReasonRadioEntry('3', 'harassment') }
          </p>
        </div>
      </form>
    )}
}
