import React from "react"
import { connect } from "react-redux"
import { translate } from 'react-i18next'

import { History } from '../UsersActions/History'
import { fetchRandomModeration } from '../../state/moderation/effects'

import Entity from '../UsersActions/Entity'

import { ReputationGuard } from '../ReputationGuard'

@connect(state => ({
  isLoading: state.Moderation.isLoading,
  error: state.Moderation.error,
  entries: state.Moderation.entries
}), { fetchRandomModeration })
export default class Moderation extends React.PureComponent {
  requiredReputation = 500;

  constructor(props) {
    super(props)
  }

  render() {
    const { isLoading, error, entries, t } = this.props

    return (
      <ReputationGuard requiredRep={this.requiredReputation}>
        <div>moderation component</div>
      </ReputationGuard>)
  }

  componentDidMount() {
    this.props.fetchRandomModeration()
  }
}
