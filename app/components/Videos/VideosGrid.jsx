import React from "react"

import {VideoCard} from "./VideoCard"

export class VideosGrid extends React.PureComponent {
  render() {
    const { videos } = this.props
    return (
      <div className="videos-list columns is-multiline">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video}/>
        ))}
      </div>
    )
  }
}
