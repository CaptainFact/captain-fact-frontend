import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Link } from 'react-router'

import { MIN_REPUTATION_MODERATION } from '../../constants'
import { fetchRandomModeration, postModerationFeedback } from '../../state/moderation/effects'

import UserAppellation from '../Users/UserAppellation'
import { UserAction } from '../UsersActions/UserAction'
import { LoadingFrame } from '../Utils'
import Icon from '../Utils/Icon'
import Message from '../Utils/Message'
import { withReputationGuard } from '../Utils/ReputationGuard'
import { ModerationForm } from './ModerationForm'


@connect(state => ({
  isLoading: state.Moderation.isLoading,
  error: state.Moderation.error,
  entry: state.Moderation.entry,
}), { fetchRandomModeration, postModerationFeedback })
@translate('moderation')
@withReputationGuard(MIN_REPUTATION_MODERATION)
export default class Moderation extends React.PureComponent {
  componentDidMount() {
    this.props.fetchRandomModeration()
  }

  render() {
    const {entry, t} = this.props

    if (this.props.isLoading)
      return <LoadingFrame/>

    return (
      <div className="section">
        <h1 className="title is-1 has-text-centered">
          <Icon name="flag"/> {t('title')}
        </h1>
        {!entry && <Message className="has-text-centered">{t('emptyModeration')}</Message>}
        {entry &&
          <div>
            {this.renderAction(entry.action)}
            <hr/>
            {entry.flags.map(({source_user, reason}) =>
              <div key={source_user.id} className="has-text-centered">
                <UserAppellation user={source_user}/> {t('flaggedFor', {reason})}
              </div>
            )}
          </div>
        }
      </div>
    )
  }

  renderAction(action) {
    const videoId = action.context.hash_id
    const statementId = action.changes.get('statement_id')

    return (
      <div className="box moderation-entry">
        <UserAction action={action}/>
        <br/>
        <h4 className="box has-text-centered">
          <Link target="_blank" to={`/videos/${videoId}?statement=${statementId}`}>
            <strong>{this.props.t('seeContext')}</strong>
          </Link>
        </h4>
        <hr/>
        <ModerationForm
          action={action}
          initialValues={{action_id: action.id}}
          onSubmit={values =>
            this.props.postModerationFeedback(values)
              .then(() => this.props.fetchRandomModeration())
          }
        />
      </div>
    )
  }
}
