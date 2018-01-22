import React from "react"
import { connect } from "react-redux"
import { translate } from 'react-i18next'

import { History } from '../UsersActions/History'
import { fetchRandomModeration } from '../../state/moderation/effects'

import Entity from '../UsersActions/Entity'
import ModerationEntry from './ModerationEntry'
import ReputationGuard from '../ReputationGuard'

@connect(state => ({
  isLoading: state.Moderation.isLoading,
  error: state.Moderation.error,
  items: state.Moderation.items
}), { fetchRandomModeration })
export default class Moderation extends React.PureComponent {
  requiredReputation = 500;

  constructor(props) {
    super(props)
  }

  render() {
    const { isLoading, error, items, t } = this.props

    return (
      <ReputationGuard requiredRep={this.requiredReputation}>
        <div>
          { items && items.map(el => <ModerationEntry key={el.id} entry={el}></ModerationEntry>) }
        </div>
      </ReputationGuard>)
  }

  componentDidMount() {
    this.props.fetchRandomModeration()
  }
}
