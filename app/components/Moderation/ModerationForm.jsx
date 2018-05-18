import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, formValueSelector } from 'redux-form'
import { translate } from 'react-i18next'
import {
  MODERATION_ACTION_ABUSIVE, MODERATION_ACTION_CONFIRM,
  MODERATION_ACTION_NOTSURE
} from '../../constants'
import FlagReasonSelect from './FlagReasonSelect'


const FORM_NAME = 'moderationForm'

const valueSelector = formValueSelector(FORM_NAME)

@translate('moderation')
@reduxForm({form: FORM_NAME})
@connect(state => ({flagReason: valueSelector(state, 'reason')}))
export class ModerationForm extends React.PureComponent {
  render() {
    const {t, flagReason} = this.props
    return (
      <div>
        <h4 className="title is-4">
          {t("whyReport")}
        </h4>
        <FlagReasonSelect/>
        <div className="buttons field is-grouped">
          <a className="button" disabled={!flagReason}
             onClick={this.getSubmit(MODERATION_ACTION_ABUSIVE)}>
            <span>{t('actions.flag_abusive')}</span>
          </a>
          <a className="button" disabled={!flagReason}
             onClick={this.getSubmit(MODERATION_ACTION_NOTSURE)}>
            <span>{t('actions.unsure')}</span>
          </a>
          <a className="button" disabled={!flagReason}
             onClick={this.getSubmit(MODERATION_ACTION_CONFIRM)}>
            <span>{t('actions.confirm')}</span>
          </a>
        </div>
      </div>
    )
  }

  getSubmit(value) {
    return this.props.handleSubmit(({action_id, reason}) => {
      this.props.onSubmit({action_id, reason: parseInt(reason), value})
    })
  }
}
