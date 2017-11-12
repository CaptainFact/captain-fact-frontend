import React from "react"

import ReactPlayer from 'react-player'


export class DummyVideoPlayer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.duration = 0
  }

  handleDuration(duration) {
    this.duration = duration
  }

  // Override props handleprogress to return time elapsed instead of rate played
  handleProgress({played}) {
    if (this.props.onProgress)
      this.props.onProgress({played: played * this.duration})
  }

  seekTo(time) {
    if (this.duration)
      this.refs.player.seekTo(time / this.duration)
  }

  render() {
    const { url } = this.props
    const {playback, dispatch, onProgress, position, forcedPosition, ...iframeProps} = this.props
    if (!url)
      return (<div className="video"><div/></div>)
    return (
      <ReactPlayer className="video"
        onProgress={this.handleProgress.bind(this)}
        onDuration={this.handleDuration.bind(this)}
        ref="player"
        {...iframeProps}/>
    )
  }
}

DummyVideoPlayer.defaultProps = {
  frameBorder: 0,
  allowFullScreen: true,
  width: '',
  height: '',
  controls: true
}
