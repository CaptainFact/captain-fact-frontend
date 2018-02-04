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

import format from 'date-fns/format'
import { locales } from '../../i18n/i18n'

@connect(state => ({locale: state.UserPreferences.locale}))
@translate('moderation')
export default class ModerationEntry extends React.PureComponent {

  render() {
    const { entry, t, onAction, time, locale } = this.props
    const localeObj = locales[locale]
    const dateFormat = localeObj.defaultDateTimeFormat

    return (

      <div className="moderation-entry">
        {JSON.stringify(entry.toJSON())}
        <br />
        <br />
        <div className="moderation-entry-header">
          <span>{t('header.date')}
            <span> { format(entry.time, dateFormat, {locale: localeObj}) }</span>
          </span>
          <br />
          <UserAction action={entry}></UserAction>
          <div className="moderation-entry-buttons">
            <button onClick={(e) => onAction(entry.id, MODERATION_ACTION_ABUSIVE)}>{t('actions.flag_abusive')}</button>
            <button onClick={(e) => onAction(entry.id, MODERATION_ACTION_NOTSURE)}>{t('actions.unsure')}</button>
            <button onClick={(e) => onAction(entry.id, MODERATION_ACTION_CONFIRM)}>{t('actions.confirm')}</button>
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