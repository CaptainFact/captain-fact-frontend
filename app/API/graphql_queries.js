import gql from 'graphql-tag'

export const VideosQuery = gql`
  query VideosIndex($offset: Int! = 1, $limit: Int! = 16, $filters: VideoFilter = {}) {
    videos(limit: $limit, offset: $offset, filters: $filters) {
      pageNumber
      totalPages
      entries {
        id
        hash_id: hashId
        youtube_id: youtubeId
        title
        insertedAt
        isPartner
        thumbnail
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
      id
      videosAdded(limit: $limit, offset: $offset) {
        pageNumber
        totalPages
        entries {
          id
          hash_id: hashId
          youtube_id: youtubeId
          title
          insertedAt
          isPartner
          thumbnail
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
  query LoggedInUserSubscriptions($scopes: [String]) {
    loggedInUser {
      id
      subscriptions(scopes: $scopes) {
        id
        scope
        videoId
        isSubscribed
        video {
          hashId
          title
        }
      }
    }
  }
`

export const loggedInUserUnreadNotificationsCount = gql`
  query LoggedInUserUnreadNotificationsCount {
    loggedInUser {
      id
      notifications(filter: UNSEEN) {
        totalEntries
      }
    }
  }
`

export const loggedInUserPendingModerationCount = gql`
  query LoggedInUserUnreadNotificationsCount {
    loggedInUser {
      id
      actions_pending_moderation
    }
  }
`

export const loggedInUserTodayReputationGain = gql`
  query LoggedInUserTodayReputationGain {
    loggedInUser {
      todayReputationGain
    }
  }
`

export const StatementsQuery = gql`
  query StatementsIndex($offset: Int! = 1, $limit: Int! = 16, $filters: VideoFilter = {}) {
    statements(limit: $limit, offset: $offset, filters: $filters) {
      pageNumber
      pageSize
      totalEntries
      totalPages
      entries {
        id
        text
        speaker {
          id
          slug
          fullName
          title
          picture
        }
        video {
          hashId
          title
        }
        comments {
          id
          text
          approve
          score
          user {
            id
            name
            username
            pictureUrl
          }
          source {
            id
            url
          }
        }
      }
    }
  }
`
