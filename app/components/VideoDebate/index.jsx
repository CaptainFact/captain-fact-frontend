import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { Helmet } from 'react-helmet'

import { ErrorView } from '../Utils'
import {
  joinCommentsChannel,
  leaveCommentsChannel,
} from '../../state/video_debate/comments/effects'
import {
  joinStatementsChannel,
  leaveStatementsChannel,
} from '../../state/video_debate/statements/effects'
import { joinVideoDebateChannel, leaveVideoDebateChannel } from '../../state/video_debate/effects'
import { resetVideoDebate } from '../../state/video_debate/actions'
import { ColumnVideo } from './ColumnVideo'
import { ColumnDebate } from './ColumnDebate'
import { videoURL, toAbsoluteURL } from '../../lib/cf_routes'
import { getHDThumbnailUrl } from '../../lib/video_utils'

@connect(
  (state) => ({
    videoErrors: state.VideoDebate.video.errors,
    isLoading: state.VideoDebate.video.isLoading,
    video: state.VideoDebate.video.data,
  }),
  {
    joinVideoDebateChannel,
    joinCommentsChannel,
    joinStatementsChannel,
    leaveCommentsChannel,
    leaveStatementsChannel,
    leaveVideoDebateChannel,
    resetVideoDebate,
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

  renderMeta(video) {
    const title = `Fact-checking : ${video.title}`
    const image = getHDThumbnailUrl(video)
    const description = `${video.title} vérifiée citation par citation par la communauté CaptainFact`
    return (
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={toAbsoluteURL(videoURL(video.hash_id))} />
        {image && <meta property="og:image" content={image} />}
        {image && <meta name="twitter:image" content={image} />}
      </Helmet>
    )
  }

  render() {
    const { videoErrors, isLoading, video, route } = this.props

    if (videoErrors) {
      return <ErrorView error={videoErrors} />
    }

    return (
      <div id="video-show" className="columns is-gapless" data-video-language={video.language}>
        {!isLoading && this.renderMeta(video)}
        <ColumnVideo view={route.view} />
        <ColumnDebate view={route.view} videoId={this.props.params.videoId} />
      </div>
    )
  }
}
