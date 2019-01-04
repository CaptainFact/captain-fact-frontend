import React from 'react'
import { withRouter } from 'react-router'
import { Box } from '@rebass/grid'

import PaginatedVideosContainer from './PaginatedVideosContainer'
import { VideosAddedByUserQuery } from '../../API/graphql_queries'

@withRouter
export default class UserAddedVideos extends React.Component {
  render() {
    const currentPage = parseInt(this.props.location.query.page) || 1
    return (
      <Box py={4} px={2}>
        <PaginatedVideosContainer
          baseURL={this.props.location.pathname}
          currentPage={currentPage}
          query={VideosAddedByUserQuery}
          queryArgs={{ username: this.props.params.username }}
          videosPath="user.videosAdded"
        />
      </Box>
    )
  }
}
