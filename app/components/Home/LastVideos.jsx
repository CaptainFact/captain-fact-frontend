import React from 'react'
import { Query } from '@apollo/client/react/components'
import { Flex } from '@rebass/grid'
import styled from 'styled-components'

import { VideosQuery } from '../../API/graphql_queries'
import { VideoCard } from '../Videos/VideoCard'

const VideosContainer = styled(Flex)`
  flex-wrap: wrap;
  justify-content: center;
  // Override the default Bulma .column.
  .column {
    flex-basis: 250px;
    min-width: 250px;
  }
`

const LastVideos = () => {
  return (
    <VideosContainer>
      <Query query={VideosQuery} variables={{ limit: 4 }}>
        {({ data }) => {
          return data && data.videos && data.videos.entries.length > 0
            ? data.videos.entries.map((video) => <VideoCard key={video.hash_id} video={video} />)
            : null
        }}
      </Query>
    </VideosContainer>
  )
}

export default LastVideos
