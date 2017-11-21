import React from "react"
import { connect } from "react-redux"
import { translate } from 'react-i18next'

import { History } from '../UsersActions/History'
import { fetchRandomModeration } from '../../state/moderation/effects'

import Entity from '../UsersActions/Entity'

@connect(state => ({
  isLoading: state.Moderation.isLoading,
  error: state.Moderation.error,
  entries: state.Moderation.entries
}), { fetchRandomModeration })
export default class Moderation extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const { isLoading, error, entries, t } = this.props

    
    return (
      <div>moderation component</div>)
  }

  componentDidMount() {
    this.props.fetchRandomModeration()
  }
}
