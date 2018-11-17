import React from 'react'
import { connect } from 'react-redux'
import ReactPlayer from 'react-player'

import { setPosition, setPlaying } from '../../state/video_debate/video/reducer'

/**
 * A player connected to VideoDebate state. Update position in it when playing
 * and seekTo position when requested in state.
 */
@connect(
  state => ({
    position: state.VideoDebate.video.playback.position,
    forcedPosition: state.VideoDebate.video.playback.forcedPosition,
    isPlaying: state.VideoDebate.video.playback.isPlaying
  }),
  { setPosition, setPlaying }
)
export default class VideoDebatePlayer extends React.Component {
  shouldComponentUpdate(newProps) {
    return (
      this.props.url !== newProps.url || this.props.isPlaying !== newProps.isPlaying
    )
  }

  componentWillReceiveProps(newProps) {
    const { forcedPosition } = newProps
    if (
      forcedPosition.requestId !== null
      && forcedPosition.requestId !== this.props.forcedPosition.requestId
    ) {
      this.props.setPlaying(true)
      this.refs.player.seekTo(forcedPosition.time)
    }
  }

  render() {
    const { setPosition, url, isPlaying, setPlaying } = this.props

    return (
      <ReactPlayer
        ref="player"
        className="video"
        url={url}
        playing={isPlaying}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onProgress={({ playedSeconds }) => setPosition(playedSeconds)}
        width=""
        height=""
        controls
      />
    )
  }
}
