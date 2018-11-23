import React from 'react'
import ReactPlayer from 'react-player'

import fakeVideos from '../Data/fakevideos'
import fakeQuotes from '../Data/fakeQuotes'
import TimeLine from '../Timeline'
import Comments from '../Comments'

export default class SingleVideo extends React.PureComponent {
  state = {
    videoDuration: null,
    videoInfo: null
  }

  getVideo() {
    return fakeVideos[this.props.routeParams.videoId - 1]
  }

  getVideoQuotes() {
    return fakeQuotes[this.props.routeParams.videoId - 1]
  }

  getTime(time) {
    this.setState({
      videoDuration: time
    })
  }

  setTime(videoInfo) {
    this.setState({
      videoInfo
    })
  }

  render() {
    const video = this.getVideo()
    const quotes = this.getVideoQuotes()
    return (
      <div className="page-video-container">
        <h1>{video.title}</h1>
        <button onClick={this.addVideo} className="add-video">
          Ajouter une vidéo
        </button>
        <TimeLine
          quotes={quotes}
          videoLength={this.state.videoInfo}
          videoDuration={this.state.videoDuration}
        />
        <div className="col-left">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
            playing
            width="100%"
            height="500px"
            onDuration={(time) => this.setTime(time)}
            onProgress={(videoInfo) => this.getTime(videoInfo)}
          />
        </div>

        <div className="col-right">
          {quotes.comments.map((comment, index) => {
            return <Comments key={`comment-${index}`} comment={comment} />
          })}
        </div>
      </div>
    )
  }
}
