import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { translate } from 'react-i18next'
import {
  MODERATION_ACTION_ABUSIVE, MODERATION_ACTION_CONFIRM,
  MODERATION_ACTION_NOTSURE
} from '../../constants'
import Icon from '../Utils/Icon'
import FlagReasonSelect from './FlagReasonSelect'


@translate('moderation')
@reduxForm({form:'moderationForm'})
export class ModerationForm extends React.PureComponent {
  render() {
    return (
      <div>
        <h4 className="title is-4">
          Confirm flag reason
        </h4>
        <FlagReasonSelect/>
        <div className="buttons field is-grouped">
          <button className="button is-danger"
                  onClick={() => this.submit(MODERATION_ACTION_ABUSIVE)}>
            <Icon name="close" />
            <span>{this.props.t('actions.flag_abusive')}</span>
          </button>
          <button className="button"
                  onClick={() => this.submit(MODERATION_ACTION_NOTSURE)}>
            <Icon name="ban" />
            <span>{this.props.t('actions.unsure')}</span>
          </button>
          <button className="button is-success"
                  onClick={() => this.submit(MODERATION_ACTION_CONFIRM)}>
            <Icon name="check" />
            <span>{this.props.t('actions.confirm')}</span>
          </button>
        </div>
      </div>
    )
  }

  submit(value) {
    return this.props.handleSubmit(values =>
      this.props.onSubmit({...values, value})
    )
  }
}