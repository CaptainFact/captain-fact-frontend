import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { reset } from '../../state/user_actions/reducer'
import {
  joinVideoDebateHistoryChannel,
  leaveVideoDebateHistoryChannel,
} from '../../state/video_debate/history/effects'
import ActionsTable from '../UsersActions/ActionsTable'

@connect(
  (state) => ({
    isLoading: state.UsersActions.isLoading,
    error: state.UsersActions.error,
    actions: state.UsersActions.actions,
  }),
  { joinVideoDebateHistoryChannel, leaveVideoDebateHistoryChannel, reset },
)
export default class VideoDebateHistory extends React.PureComponent {
  componentDidMount() {
    this.props.joinVideoDebateHistoryChannel(this.props.videoId)
  }

  componentWillUnmount() {
    this.props.leaveVideoDebateHistoryChannel()
    this.props.reset()
  }

  render() {
    const { isLoading, error, actions } = this.props

    return (
      <React.Fragment>
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="videodebate-actions-history">
          {error && error}
          <ActionsTable actions={actions} isLoading={isLoading} />
        </div>
      </React.Fragment>
    )
  }
}
