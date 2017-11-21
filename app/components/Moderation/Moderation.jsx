import React from "react"
import { connect } from "react-redux"
import { translate } from 'react-i18next'

import { fetchRandomModeration } from '../../state/moderation/effects'

@connect(state => ({
  isLoading: state.UsersActions.isLoading,
  error: state.UsersActions.error,
  allActions: state.UsersActions.entitiesActions
}), {fetchRandomModeration})
export default class Moderation extends React.PureComponent {
  render() {
    return (
    <div>moderation
    </div>)
  }

  componentDidMount() {
    this.props.fetchRandomModeration()
  }
}
