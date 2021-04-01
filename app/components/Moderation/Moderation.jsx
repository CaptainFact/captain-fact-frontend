import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { Link } from 'react-router'

import { Report } from 'styled-icons/octicons'

import { MIN_REPUTATION_MODERATION } from '../../constants'
import { fetchRandomModeration, postModerationFeedback } from '../../state/moderation/effects'

import UserAppellation from '../Users/UserAppellation'
import UserAction from '../UsersActions/UserAction'
import { LoadingFrame } from '../Utils'
import Message from '../Utils/Message'
import { withReputationGuard } from '../Utils/ReputationGuard'
import { ModerationForm } from './ModerationForm'
import { commentURL } from '../../lib/cf_routes'

@connect(
  (state) => ({
    isLoading: state.Moderation.isLoading,
    error: state.Moderation.error,
    entry: state.Moderation.entry,
  }),
  { fetchRandomModeration, postModerationFeedback }
)
@withNamespaces('moderation')
@withReputationGuard(MIN_REPUTATION_MODERATION)
export default class Moderation extends React.PureComponent {
  componentDidMount() {
    this.props.fetchRandomModeration()
  }

  postFeedback(values) {
    this.props.postModerationFeedback(values).then(() => this.props.fetchRandomModeration())
  }

  render() {
    const { entry, t } = this.props

    if (this.props.isLoading) {
      return <LoadingFrame />
    }

    return (
      <div className="section">
        <h1 className="title is-1 has-text-centered">
          {t('title')} <Report size="1em" />
        </h1>
        <div className="has-text-centered">
          <p>{t('helpText1')}</p>
          <p>{t('helpText2')}</p>
          <Link className="has-text-weight-bold" to="/help/moderation">
            {t('learnMore')}
          </Link>
        </div>
        {!entry && <Message className="has-text-centered">{t('emptyModeration')}</Message>}
        {entry && (
          <div>
            {this.renderAction(entry.action)}
            <hr />
            {entry.flags.map(({ source_user, reason }) => (
              <div key={source_user.id} className="has-text-centered">
                <UserAppellation user={source_user} /> {t('flaggedFor', { reason })}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  renderAction(action) {
    return (
      <div className="box moderation-entry">
        <UserAction action={action} />
        <br />
        <h4 className="box has-text-centered">
          <Link
            target="_blank"
            to={commentURL(action.videoHashId, action.statementId, action.commentId)}
          >
            <strong>{this.props.t('seeContext')}</strong>
          </Link>
        </h4>
        <hr />
        <ModerationForm
          action={action}
          initialValues={{ action_id: action.id }}
          onSubmit={(values) => this.postFeedback(values)}
        />
      </div>
    )
  }
}
