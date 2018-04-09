import React from "react"
import { connect } from "react-redux"
import { translate } from 'react-i18next'

import Message from '../Utils/Message'
import { withReputationGuard } from '../Utils/ReputationGuard'

import { fetchRandomModeration, postModerationUserFeedback } from '../../state/moderation/effects'
import ModerationEntry from './ModerationEntry'

import { MIN_REPUTATION_MODERATION } from '../../constants'

@connect(state => ({
  isLoading: state.Moderation.isLoading,
  error: state.Moderation.error,
  entry: state.Moderation.entry
}), { fetchRandomModeration, postModerationUserFeedback })
@translate('moderation')
@withReputationGuard(MIN_REPUTATION_MODERATION)
export default class Moderation extends React.PureComponent {
  componentDidMount() {
    this.props.fetchRandomModeration()
  }

  render() {
    const entry = this.props.entry

    return (
      <div className="section container">
        <h1 className="title is-1 has-text-centered">{this.props.t('title')}</h1>
        {!entry && <Message className="has-text-centered">{this.props.t('emptyModeration')}</Message>}
        {entry &&
          <ModerationEntry entry={entry} onAction={(id, action) =>
            this.props.postModerationUserFeedback(id, action).then(() =>
              this.props.fetchRandomModeration()
            )
          }/>
        }
      </div>
    )
  }
}
