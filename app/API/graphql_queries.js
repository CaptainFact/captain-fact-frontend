import gql from 'graphql-tag'

export const VideosQuery = gql`
  query VideosIndex($offset: Int! = 1, $limit: Int! = 16, $filters: VideoFilter = {}) {
    videos(limit: $limit, offset: $offset, filters: $filters) {
      pageNumber
      totalPages
      entries {
        hash_id: hashId
        youtube_id: youtubeId
        title
        insertedAt
        isPartner
        speakers {
          full_name: fullName
          id
          slug
        }
      }
    }
  }
`

export const VideosAddedByUserQuery = gql`
  query UserAddedVideosIndex($offset: Int! = 1, $limit: Int! = 16, $username: String!) {
    user(username: $username) {
      videosAdded(limit: $limit, offset: $offset) {
        pageNumber
        totalPages
        entries {
          hash_id: hashId
          youtube_id: youtubeId
          title
          insertedAt
          isPartner
          speakers {
            full_name: fullName
            id
            slug
          }
        }
      }
    }
  }
`

export const loggedInUserSubscriptionsQuery = gql`
  query LoggedInUserSubscriptions {
    loggedInUser {
      subscriptions(scopes: ["video"]) {
        id
        scope
        video {
          hashId
          title
        }
      }
    }
  }
`
