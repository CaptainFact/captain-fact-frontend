import React from 'react'

import {VideoCard} from './VideoCard'

export class VideosGrid extends React.PureComponent {
  render() {
    return (
      <div className="videos-list columns is-multiline">
        {this.props.videos.map(video => <VideoCard key={video.id} video={video}/>)}
      </div>
    )
  }
}
