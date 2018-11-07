import React from 'react'
// import { Link } from 'react-router'
import { withNamespaces } from 'react-i18next'
import fakeVideos from './fakevideos'
import SingleVideo from './SingleVideo'

@withNamespaces('videoDebate')
export class Video extends React.PureComponent {
  render() {
    return (
      <div className="video-container">
        {fakeVideos.map((video, i) => {
          return <SingleVideo key={`video${i}`} video={video} />
        })}
      </div>
    )
  }
}

export default Video
