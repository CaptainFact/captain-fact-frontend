import { Box } from '@rebass/grid'
import React from 'react'
import { withRouter } from 'react-router-dom'

import { VideosAddedByUserQuery } from '../../API/graphql_queries'
import PaginatedVideosContainer from './PaginatedVideosContainer'

@withRouter
export default class UserAddedVideos extends React.Component {
  render() {
    const searchParams = new URLSearchParams(this.props.location.search)
    const currentPage = parseInt(searchParams.get('page')) || 1
    return (
      <Box py={4} px={2}>
        <PaginatedVideosContainer
          baseURL={this.props.location.pathname}
          currentPage={currentPage}
          query={VideosAddedByUserQuery}
          queryArgs={{ username: this.props.match.params.username }}
          videosPath="user.videosAdded"
        />
      </Box>
    )
  }
}
