import { ShieldBan, ShieldCheck, ShieldQuestion } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { formValueSelector, reduxForm } from 'redux-form'

import {
  MODERATION_ACTION_ABUSIVE,
  MODERATION_ACTION_CONFIRM,
  MODERATION_ACTION_NOTSURE,
} from '../../constants'
import { Button } from '../ui/button'
import FlagReasonSelect from './FlagReasonSelect'

const FORM_NAME = 'moderationForm'

const valueSelector = formValueSelector(FORM_NAME)

@withTranslation('moderation')
@reduxForm({ form: FORM_NAME })
@connect((state) => ({ flagReason: valueSelector(state, 'reason') }))
export class ModerationForm extends React.PureComponent {
  render() {
    const { t, flagReason } = this.props
    return (
      <div>
        <h4 className="text-lg font-medium mb-4">{t('whyReport')}</h4>
        <FlagReasonSelect />
        <div className="flex gap-2 mt-6 flex-wrap">
          <Button
            className="flex-1"
            variant="outline"
            disabled={!flagReason}
            onClick={this.getSubmit(MODERATION_ACTION_ABUSIVE)}
          >
            <ShieldBan size={16} />
            {t('actions.flag_abusive')}
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            disabled={!flagReason}
            onClick={this.getSubmit(MODERATION_ACTION_NOTSURE)}
          >
            <ShieldQuestion size={16} />
            {t('actions.unsure')}
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            disabled={!flagReason}
            onClick={this.getSubmit(MODERATION_ACTION_CONFIRM)}
          >
            <ShieldCheck size={16} />
            {t('actions.confirm')}
          </Button>
        </div>
      </div>
    )
  }

  getSubmit(value) {
    return this.props.handleSubmit(({ action_id, reason }) => {
      this.props.onSubmit({ action_id, reason: parseInt(reason), value })
    })
  }
}
