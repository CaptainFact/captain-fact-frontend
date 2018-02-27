import React from "react"
import { connect } from "react-redux"
import { translate } from 'react-i18next'
import Message from '../Utils/Message'

import ReputationGuard from '../Utils/ReputationGuard'

import { fetchRandomModeration, postModerationFeedback } from '../../state/moderation/effects'
import ModerationEntry from './ModerationEntry'

import { MODERATION_REPUTATION_REQUIRED } from '../../constants'

@connect(state => ({
  isLoading: state.Moderation.isLoading,
  error: state.Moderation.error,
  items: state.Moderation.items
}), { fetchRandomModeration, postModerationFeedback })
@translate('moderation')
export default class Moderation extends React.PureComponent {
  componentDidMount() {
    this.props.fetchRandomModeration()
  }

  render() {
    return (
      <ReputationGuard requiredRep={MODERATION_REPUTATION_REQUIRED} showLoading showNotEnough>
        <div className="section container">
          <h1 className="title is-1 has-text-centered">{this.props.t('title')}</h1>
          {this.getItems()}
        </div>
      </ReputationGuard>
    )
  }

  getItems() {
    const items = this.props.items

    if (!items || items.size === 0)
      return <Message className="has-text-centered">{this.props.t('emptyModeration')}</Message>
    return items.map(el =>
      <ModerationEntry key={el.id} entry={el} onAction={this.onEntryAction.bind(this)}/>
    )
  }

  onEntryAction(entryId, action) {
    this.props.postModerationFeedback(entryId, action)
  }
}
