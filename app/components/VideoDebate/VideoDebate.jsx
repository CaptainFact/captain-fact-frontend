import React from 'react'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { toAbsoluteURL, videoURL } from '../../lib/cf_routes'
import { getHDThumbnailUrl } from '../../lib/video_utils'
import { resetVideoDebate } from '../../state/video_debate/actions'
import {
  joinCommentsChannel,
  leaveCommentsChannel,
} from '../../state/video_debate/comments/effects'
import { joinVideoDebateChannel, leaveVideoDebateChannel } from '../../state/video_debate/effects'
import {
  joinStatementsChannel,
  leaveStatementsChannel,
} from '../../state/video_debate/statements/effects'
import { ErrorView } from '../Utils/ErrorView'
import { ColumnDebate } from './ColumnDebate'
import { ColumnVideo } from './ColumnVideo'

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
  },
)
@withTranslation('videoDebate')
export class VideoDebate extends React.PureComponent {
  componentDidMount() {
    this.joinChannels()
  }

  componentDidUpdate(prevProps) {
    // Reload when navigating to another video
    if (prevProps.match.params.videoId !== this.props.match.params.videoId) {
      this.leaveChannels()
      this.joinChannels()
    }
  }

  componentWillUnmount() {
    this.leaveChannels()
  }

  joinChannels = () => {
    const { videoId } = this.props.match.params
    if (videoId) {
      this.props.joinVideoDebateChannel(videoId)
      this.props.joinStatementsChannel(videoId)
      this.props.joinCommentsChannel(videoId)
    }
  }

  leaveChannels = () => {
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
    const { videoErrors, isLoading, video, match } = this.props
    if (videoErrors) {
      return <ErrorView error={videoErrors} />
    }

    const view = match.params.view || 'debate'
    return (
      <div
        id="video-show"
        className="h-full 2xl:flex lg:gap-0"
        data-video-language={video.language}
      >
        {!isLoading && this.renderMeta(video)}
        <ColumnVideo view={view} />
        <ColumnDebate view={view} videoId={this.props.match.params.videoId} />
      </div>
    )
  }
}
