import gql from 'graphql-tag'

export const VideosQuery = gql`
  query VideosIndex($offset: Int! = 1, $limit: Int! = 16, $filters: VideoFilter = {}) {
    videos(limit: $limit, offset: $offset, filters: $filters) {
      pageNumber
      totalPages
      entries {
        id
        hashId
        youtubeId
        title
        insertedAt
        isPartner
        thumbnail
        speakers {
          fullName
          id
          slug
        }
      }
    }
  }
`

export const UserQuery = gql`
  query User($username: String!) {
    user(username: $username) {
      id
      username
      name
      reputation
      registeredAt
      pictureUrl
      miniPictureUrl
      achievements
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
          hashId
          youtubeId
          title
          insertedAt
          isPartner
          thumbnail
          speakers {
            fullName
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
      actionsPendingModeration
    }
  }
`

export const loggedInUserTodayReputationGain = gql`
  query LoggedInUserTodayReputationGain {
    loggedInUser {
      id
      todayReputationGain
    }
  }
`

export const VideoDebateQuery = gql`
  query VideoDebate($id: ID!) {
    video(hashId: $id) {
      id
      hashId
      title
      url
      thumbnail
      language
      unlisted
      youtubeOffset
      speakers {
        id
        fullName
        slug
        picture
      }
      statements {
        id
        text
        time
        isDraft
        speaker {
          id
          fullName
          picture
        }
        comments {
          id
          text
          approve
          score
          insertedAt
          replyToId
          user {
            id
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

export const DELETE_STATEMENT_MUTATION = gql`
  mutation DeleteStatement($id: ID!) {
    deleteStatement(id: $id) {
      id
    }
  }
`

export const UPDATE_STATEMENT_MUTATION = gql`
  mutation UpdateStatement($id: ID!, $text: String, $time: Int, $speakerId: ID, $isDraft: Boolean) {
    updateStatement(id: $id, text: $text, time: $time, speakerId: $speakerId, isDraft: $isDraft) {
      id
      time
      text
      isDraft
      video {
        id
      }
    }
  }
`

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment(
    $statementId: ID!
    $text: String
    $source: String
    $replyToId: ID
    $approve: Boolean
  ) {
    createComment(
      statementId: $statementId
      text: $text
      source: $source
      replyToId: $replyToId
      approve: $approve
    ) {
      id
      text
      approve
      insertedAt
      replyToId
      statementId
      user {
        id
        username
        pictureUrl
      }
      source {
        id
        url
      }
    }
  }
`

export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) {
      id
      statementId
      replyToId
    }
  }
`

export const VOTE_COMMENT_MUTATION = gql`
  mutation VoteComment($commentId: ID!, $value: Int!) {
    voteComment(commentId: $commentId, value: $value) {
      id
      score
    }
  }
`

export const FLAG_COMMENT_MUTATION = gql`
  mutation FlagComment($commentId: ID!, $reason: Int!) {
    flagComment(commentId: $commentId, reason: $reason) {
      id
    }
  }
`

export const SEARCH_SPEAKERS_QUERY = gql`
  query SearchSpeakers($query: String!, $limit: Int) {
    searchSpeakers(query: $query, limit: $limit) {
      id
      fullName
      slug
      picture
    }
  }
`

export const ADD_SPEAKER_TO_VIDEO_MUTATION = gql`
  mutation AddSpeakerToVideo($videoId: ID!, $speakerId: ID!) {
    addSpeakerToVideo(videoId: $videoId, speakerId: $speakerId) {
      id
      fullName
      slug
      picture
    }
  }
`

export const CREATE_SPEAKER_MUTATION = gql`
  mutation CreateSpeaker($videoId: ID!, $fullName: String!) {
    createSpeaker(videoId: $videoId, fullName: $fullName) {
      id
      fullName
      slug
      picture
    }
  }
`
