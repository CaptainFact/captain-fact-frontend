import { Query } from '@apollo/client/react/components'
import React from 'react'

import { VideosQuery } from '../../API/graphql_queries'
import { VideoCard } from '../Videos/VideoCard'

const LastVideos = () => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
      <Query query={VideosQuery} variables={{ limit: 4 }}>
        {({ data }) => {
          return data && data.videos && data.videos.entries.length > 0
            ? data.videos.entries.map((video) => <VideoCard key={video.hash_id} video={video} />)
            : null
        }}
      </Query>
    </div>
  )
}

export default LastVideos
