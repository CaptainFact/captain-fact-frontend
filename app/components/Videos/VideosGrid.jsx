import React from 'react'

import { VideoCard } from './VideoCard'

export const VideosGrid = ({ videos }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:p-4 p-2">
      {videos.map((video) => (
        <VideoCard key={video.hash_id} video={video} />
      ))}
    </div>
  )
}
