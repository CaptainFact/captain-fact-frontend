import React from 'react'
import ReactPlayer from 'react-player'

import fakeVideos from '../Data/fakevideos'
import fakeQuotes from '../Data/fakeQuotes'
import TimeLine from '../Components/Timeline'
import Comment from '../Components/Comment'

export default class SingleVideo extends React.PureComponent {
  state = {
    videoDuration: null,
    videoInfo: null,
    currentQuote: 0
  }

  getVideo() {
    return fakeVideos[0]
  }

  getVideoQuotes() {
    return fakeQuotes
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

  goTo = (time) => {
    this.refs.videoPlayer.seekTo(time)
  }

  setCurrentQuote = (index) => {
    this.setState({
      currentQuote: index
    })
  }

  render() {
    console.log(this.state.currentQuote)
    const video = this.getVideo()
    const quotes = this.getVideoQuotes()
    return (
      <div className="page-video-container">
        <h1>{video.title}</h1>
        <button className="add-video">Ajouter une vidéo</button>
        <TimeLine
          quotes={quotes}
          setCurrentQuote={this.setCurrentQuote}
          videoLength={this.state.videoInfo}
          videoDuration={this.state.videoDuration}
          goTo={this.goTo}
        />
        <div className="col-left">
          <ReactPlayer
            ref="videoPlayer"
            url="https://www.youtube.com/watch?v=82cgWGlrAyE"
            playing
            width="100%"
            height="500px"
            controls
            onDuration={(time) => this.setTime(time)}
            onProgress={(videoInfo) => this.getTime(videoInfo)}
          />
        </div>

        <div className="col-right">
          {quotes[this.state.currentQuote].comments.map((comment, index) => {
            return <Comment key={`comment-${index}`} comment={comment} />
          })}
        </div>
      </div>
    )
  }
}
