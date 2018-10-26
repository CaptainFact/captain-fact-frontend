import React from 'react'
import { connect } from 'react-redux'
import ReactPlayer from 'react-player'

import { setPosition } from '../../state/video_debate/video/reducer'


/**
 * A player connected to VideoDebate state. Update position in it when playing
 * and seekTo position when requested in state.
 */
@connect(state => ({
  position: state.VideoDebate.video.playback.position,
  forcedPosition: state.VideoDebate.video.playback.forcedPosition
}), {setPosition})
export default class VideoDebatePlayer extends React.Component {
  shouldComponentUpdate(newProps) {
    return this.props.url !== newProps.url
  }

  componentWillReceiveProps(newProps) {
    const { forcedPosition } = newProps
    if (forcedPosition.requestId !== null
      && forcedPosition.requestId !== this.props.forcedPosition.requestId) {
      this.refs.player.seekTo(forcedPosition.time)
    }
  }

  render() {
    const { setPosition, url } = this.props

    return (
      <ReactPlayer
        ref="player"
        className="video"
        url={url}
        onProgress={({playedSeconds}) => setPosition(playedSeconds)}
        width=""
        height=""
        controls
      />
    )
  }
}
