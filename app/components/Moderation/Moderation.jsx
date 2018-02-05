import React from "react"
import { connect } from "react-redux"
import { translate } from 'react-i18next'

import ReputationGuard from '../ReputationGuard'

import { fetchRandomModeration } from '../../state/moderation/effects'
import Entity from '../UsersActions/Entity'
import ModerationEntry from './ModerationEntry'

@connect(state => ({
  isLoading: state.Moderation.isLoading,
  error: state.Moderation.error,
  items: state.Moderation.items
}), { fetchRandomModeration })
@translate('moderation')
export default class Moderation extends React.PureComponent {
  requiredReputation = 500;

  constructor(props) {
    super(props)
  }

  render() {
    const { isLoading, error, items, t } = this.props

    return (
      <ReputationGuard requiredRep={this.requiredReputation}>
        <div className="container">
          <h1 className="title is-1 has-text-centered">{t('title')}</h1>

          {items && items.map(el =>
            <ModerationEntry key={el.id} entry={el} onAction={this.onEntryAction}></ModerationEntry>)
          }
        </div>
      </ReputationGuard>)
  }

  componentDidMount() {
    this.props.fetchRandomModeration()
  }

  onEntryAction(entryId, action) {
    console.log("on entry action", entryId, action)
  }
}
