import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { Helmet } from 'react-helmet'

import { ErrorView } from '../Utils'
import {
  joinCommentsChannel,
  leaveCommentsChannel
} from '../../state/video_debate/comments/effects'
import {
  joinStatementsChannel,
  leaveStatementsChannel
} from '../../state/video_debate/statements/effects'
import {
  joinVideoDebateChannel,
  leaveVideoDebateChannel
} from '../../state/video_debate/effects'
import { resetVideoDebate } from '../../state/video_debate/actions'
import { ColumnVideo } from './ColumnVideo'
import { ColumnDebate } from './ColumnDebate'

@connect(
  state => ({
    videoErrors: state.VideoDebate.video.errors,
    isLoading: state.VideoDebate.video.isLoading,
    videoTitle: state.VideoDebate.video.data.title,
    videoLanguage: state.VideoDebate.video.data.language
  }),
  {
    joinVideoDebateChannel,
    joinCommentsChannel,
    joinStatementsChannel,
    leaveCommentsChannel,
    leaveStatementsChannel,
    leaveVideoDebateChannel,
    resetVideoDebate
  }
)
@withNamespaces('videoDebate')
export class VideoDebate extends React.PureComponent {
  componentDidMount() {
    // Join channels
    const { videoId } = this.props.params
    if (videoId) {
      this.props.joinVideoDebateChannel(videoId)
      this.props.joinStatementsChannel(videoId)
      this.props.joinCommentsChannel(videoId)
    }
  }

  componentWillUnmount() {
    this.props.leaveCommentsChannel()
    this.props.leaveStatementsChannel()
    this.props.leaveVideoDebateChannel()
    this.props.resetVideoDebate()
  }

  render() {
    const { videoErrors, isLoading, videoTitle, videoLanguage, route } = this.props

    if (videoErrors) {
      return <ErrorView error={videoErrors} />
    }

    return (
      <div
        id="video-show"
        className="columns is-gapless"
        data-video-language={videoLanguage}
      >
        <Helmet>{!isLoading && <title>{videoTitle}</title>}</Helmet>
        <ColumnVideo view={route.view} />
        <ColumnDebate view={route.view} videoId={this.props.params.videoId} />
      </div>
    )
  }
}
