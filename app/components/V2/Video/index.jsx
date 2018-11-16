import React from 'react'
import { withNamespaces } from 'react-i18next'
import fakeVideos from './fakevideos'
import SingleVideo from './SingleVideo'

@withNamespaces('videoDebate')
export class Video extends React.PureComponent {
  render() {
    return (
      <div className="video-container">
        {fakeVideos.map((video) => {
          return <SingleVideo key={video.id} video={video} />
        })}
      </div>
    )
  }
}

export default Video
