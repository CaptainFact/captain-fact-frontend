import React from 'react'
import { withNamespaces } from 'react-i18next'
import { Field, reduxForm } from 'redux-form'

import { validateLength } from '../../lib/form_validators'
import { SPEAKER_NAME_LENGTH, SPEAKER_TITLE_LENGTH } from '../../constants'
import capitalizeName from '../../lib/name_formatter'
import ControlInputWithLabel from '../FormUtils/ControlInputWithLabel'
import { cleanStr } from '../../lib/clean_str'


const validate = ({ full_name, title }) => {
  const errors = {}
  validateLength(errors, 'full_name', full_name, SPEAKER_NAME_LENGTH)
  if (title) validateLength(errors, 'title', title, SPEAKER_TITLE_LENGTH)
  return errors
}

@reduxForm({ form: 'editSpeaker', validate })
@withNamespaces('videoDebate')
export default class EditSpeakerForm extends React.PureComponent {
  render() {
    return (
      <div className="form">
        <div className="form-fields">
          <Field
            className="input"
            name="full_name"
            type="text"
            component={ControlInputWithLabel}
            label={this.props.t('speaker.fullName')}
            placeholder="Barack Obama, Dark Vador..."
            normalize={s => capitalizeName(cleanStr(s))}
          />
          <Field
            className="input"
            name="title"
            type="text"
            component={ControlInputWithLabel}
            label={this.props.t('speaker.title')}
            normalize={cleanStr}
            placeholder={this.props.t('speaker.titlePlaceholder')}
          />
          <button type="submit" className="not-displayed" />
        </div>
      </div>
    )
  }
}
