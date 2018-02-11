import React from "react"
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import { translate } from 'react-i18next'

import Entity from '../UsersActions/Entity'
import { UserAction } from "../UsersActions/UserAction"
import ActionDiff from '../UsersActions/ActionDiff'

import {
  ACTION_UPDATE,
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
    const { entry, t, onAction, time, locale } = this.props
    const localeObj = locales[locale]
    const dateFormat = localeObj.defaultDateTimeFormat

    return (

      <div className="box moderation-entry">
        <div>
          <span className="moderation-entry-date">{format(entry.time, dateFormat, { locale: localeObj })}</span>
          <br />
          <UserAction action={entry}></UserAction>
          <div className="moderation-entry-buttons buttons field is-grouped">
            <button className="moderation-entry-button button is-danger" onClick={(e) => onAction(entry.id, MODERATION_ACTION_ABUSIVE)}>
              <Icon name="close" />
              {t('actions.flag_abusive')}
            </button>
            <button className="moderation-entry-button button" onClick={(e) => onAction(entry.id, MODERATION_ACTION_NOTSURE)}>
              <Icon name="ban" />
              {t('actions.unsure')}
            </button>
            <button className="moderation-entry-button button is-success" onClick={(e) => onAction(entry.id, MODERATION_ACTION_CONFIRM)}>
              <Icon name="check" />
              {t('actions.confirm')}
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