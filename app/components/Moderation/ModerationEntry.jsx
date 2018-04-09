import React from "react"
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { connect } from "react-redux"
import format from 'date-fns/format'

import { UserAction } from "../UsersActions/UserAction"
import { locales } from '../../i18n/i18n'
import { ModerationForm } from './ModerationForm'

@connect(state => ({ locale: state.UserPreferences.locale }))
export default class ModerationEntry extends React.PureComponent {
  render() {
    const { entry: {action}, locale } = this.props
    const localeObj = locales[locale]
    const dateFormat = localeObj.defaultDateTimeFormat
    const videoId = action.context.hash_id
    const statementId = action.changes.get('statement_id')

    return (
      <div className="box moderation-entry">
        <div>
          <h4 className="title is-4">
            {format(action.time, dateFormat, { locale: localeObj })} -&nbsp;
            <Link target='_blank' to={`/videos/${videoId}?statement=${statementId}`}>
              Context
            </Link>
          </h4>
          <UserAction action={action}/>
          <hr/>
          <ModerationForm action={action} initialValues={{action_id: action.id}}/>
        </div>
      </div>
    )
  }
}

ModerationEntry.propTypes = {
  entry: PropTypes.object.isRequired,
  onAction: PropTypes.func.isRequired
}