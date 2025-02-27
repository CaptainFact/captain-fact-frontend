import React from 'react'
import ReactPlayer from 'react-player'
import { connect } from 'react-redux'

import { setPlaying, setPosition } from '../../state/video_debate/video/reducer'

/**
 * A player connected to VideoDebate state. Update position in it when playing
 * and seekTo position when requested in state.
 */
@connect(
  (state) => ({
    position: state.VideoDebate.video.playback.position,
    forcedPosition: state.VideoDebate.video.playback.forcedPosition,
    isPlaying: state.VideoDebate.video.playback.isPlaying,
  }),
  { setPosition, setPlaying },
)
export default class VideoDebatePlayer extends React.Component {
  constructor(props) {
    super(props)
    this.playerRef = React.createRef()
  }

  shouldComponentUpdate(newProps) {
    return this.props.url !== newProps.url || this.props.isPlaying !== newProps.isPlaying
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { forcedPosition } = newProps
    if (
      this.playerRef.current &&
      forcedPosition.requestId !== null &&
      forcedPosition.requestId !== this.props.forcedPosition.requestId
    ) {
      this.props.setPlaying(true)
      this.playerRef.current.seekTo(forcedPosition.time)
    }
  }

  render() {
    const { setPosition, url, isPlaying, setPlaying } = this.props

    return (
      <ReactPlayer
        ref={this.playerRef}
        className="w-full aspect-video"
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
