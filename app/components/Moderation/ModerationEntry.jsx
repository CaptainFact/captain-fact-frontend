import React from "react"
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import { translate } from 'react-i18next'
import moment from 'moment'

import Entity from '../UsersActions/Entity'
import { UserAction } from "../UsersActions/UserAction"
import ActionDiff from '../UsersActions/ActionDiff'

import {
  ACTION_UPDATE,
  MODERATION_ACTION_ABUSIVE,
  MODERATION_ACTION_CONFIRM,
  MODERATION_ACTION_NOTSURE
} from '../../constants'

@translate('moderation')
export default class ModerationEntry extends React.PureComponent {

  render() {
    const { entry, t, onAction } = this.props

    return (

      <div className="moderation-entry">
        {JSON.stringify(entry.toJSON())}
        <br />
        <br />
        <div className="moderation-entry-header">
          <span>{t('header.date')}
            <span>{
              // exemple dans timesince
              //moment(entry.time).format('MMMM Do YYYY, h:mm:ss a')
            }</span>
          </span>
          <br />
          <span>
            {t('header.reported_for')}
            <span> {"missing data"} </span>
          </span>
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