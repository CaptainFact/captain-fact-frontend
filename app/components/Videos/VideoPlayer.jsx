import React from "react"
import { connect } from "react-redux"

import { DummyVideoPlayer } from "./DummyVideoPlayer"
import { setPosition } from '../../state/video_debate/video/reducer'


@connect(state => ({
  position: state.VideoDebate.video.playback.position,
  forcedPosition: state.VideoDebate.video.playback.forcedPosition
}), {setPosition})
export class VideoPlayer extends React.PureComponent {
  componentDidUpdate(oldProps) {
    const { forcedPosition } = this.props
    if (forcedPosition.requestId !== null && forcedPosition.requestId !== oldProps.forcedPosition.requestId)
      this.refs.player.seekTo(forcedPosition.time)
  }

  render() {
    const {setPosition, ...playerProps} = this.props
    return (
      <DummyVideoPlayer ref="player"
        onProgress={({played}) => setPosition(played)}
        {...playerProps}/>
    )
  }
}
