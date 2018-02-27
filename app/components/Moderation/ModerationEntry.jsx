import React from "react"
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import { translate } from 'react-i18next'

import { UserAction } from "../UsersActions/UserAction"

import {
  MODERATION_ACTION_ABUSIVE,
  MODERATION_ACTION_CONFIRM,
  MODERATION_ACTION_NOTSURE
} from '../../constants'

import { Icon } from "../Utils"

import format from 'date-fns/format'
import { locales } from '../../i18n/i18n'

@connect(state => ({ locale: state.UserPreferences.locale }))
@translate('moderation', 'main')
export default class ModerationEntry extends React.PureComponent {
  render() {
    const { entry, locale, t, onAction } = this.props
    const localeObj = locales[locale]
    const dateFormat = localeObj.defaultDateTimeFormat

    return (

      <div className="box moderation-entry">
        <div>
          <span className="moderation-entry-date">{format(entry.time, dateFormat, { locale: localeObj })}</span>
          <br/>
          <UserAction action={entry}/>
          <div className="buttons field is-grouped">
            <button className="button is-danger"
                    onClick={() => onAction(entry.id, MODERATION_ACTION_ABUSIVE)}>
              <Icon name="close" />
              <span>{t('actions.flag_abusive')}</span>
            </button>
            <button className="button"
                    onClick={() => onAction(entry.id, MODERATION_ACTION_NOTSURE)}>
              <Icon name="ban" />
              <span>{t('actions.unsure')}</span>
            </button>
            <button className="button is-success"
                    onClick={() => onAction(entry.id, MODERATION_ACTION_CONFIRM)}>
              <Icon name="check" />
              <span>{t('actions.confirm')}</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

ModerationEntry.propTypes = {
  entry: PropTypes.object.isRequired,
  onAction: PropTypes.func.isRequired
}