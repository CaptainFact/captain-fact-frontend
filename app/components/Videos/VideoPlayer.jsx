import React from "react"
import { connect } from "react-redux"

import { DummyVideoPlayer } from "./DummyVideoPlayer"
import { resetForcedPosition, setPosition } from '../../state/video_debate/video/reducer'


@connect(state => ({
  position: state.VideoDebate.video.playback.position,
  forcedPosition: state.VideoDebate.video.playback.forcedPosition
}), {setPosition, resetForcedPosition})
export class VideoPlayer extends React.PureComponent {
  componentDidUpdate(oldProps) {
    const {forcedPosition} = this.props
    if (forcedPosition !== null && forcedPosition !== oldProps.forcedPosition) {
      this.refs.player.seekTo(forcedPosition)
      this.props.resetForcedPosition()
    }
  }

  render() {
    const {setPosition, resetForcedPosition, ...playerProps} = this.props
    return (
      <DummyVideoPlayer ref="player"
        onProgress={({played}) => setPosition(played)}
        {...playerProps}/>
    )
  }
}
