import { gql } from '@apollo/client'

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
  query LoggedInUserPendingModerationCount {
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

export const loggedInUserQuery = gql`
  query LoggedInUser {
    loggedInUser {
      id
      username
      name
      email
      reputation
      registeredAt
      pictureUrl
      miniPictureUrl
      achievements
      availableFlags
      isPublisher
    }
  }
`

export const CREATE_VIDEO_MUTATION = gql`
  mutation CreateVideo($url: String!, $unlisted: Boolean!) {
    createVideo(url: $url, unlisted: $unlisted) {
      id
      hashId
      title
      url
      unlisted
    }
  }
`

export const SEARCH_VIDEO_QUERY = gql`
  query SearchVideo($url: String!) {
    searchVideo(url: $url) {
      id
      hashId
      title
      url
      unlisted
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

export const UPDATE_SUBSCRIPTION_MUTATION = gql`
  mutation UpdateSubscription($entityId: ID!, $scope: String!, $isSubscribed: Boolean!) {
    updateSubscription(entityId: $entityId, scope: $scope, isSubscribed: $isSubscribed) {
      id
      isSubscribed
      reason
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
  mutation FlagComment($commentId: ID!, $reason: FlagReason!) {
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

export const REMOVE_SPEAKER_FROM_VIDEO_MUTATION = gql`
  mutation RemoveSpeakerFromVideo($videoId: ID!, $speakerId: ID!) {
    removeSpeakerFromVideo(videoId: $videoId, speakerId: $speakerId) {
      id
    }
  }
`

export const UPDATE_SPEAKER_MUTATION = gql`
  mutation UpdateSpeaker($id: ID!, $fullName: String, $title: String, $wikidataItemId: String) {
    updateSpeaker(id: $id, fullName: $fullName, title: $title, wikidataItemId: $wikidataItemId) {
      id
      fullName
      title
      wikidataItemId
      picture
      slug
    }
  }
`

export const RESTORE_STATEMENT_MUTATION = gql`
  mutation RestoreStatement($id: ID!) {
    restoreStatement(id: $id) {
      id
      text
      time
      isDraft
      speaker {
        id
        fullName
        picture
      }
      video {
        id
      }
    }
  }
`

export const RESTORE_SPEAKER_MUTATION = gql`
  mutation RestoreSpeaker($speakerId: ID!, $videoId: ID!) {
    restoreSpeaker(speakerId: $speakerId, videoId: $videoId) {
      id
      fullName
      slug
      picture
    }
  }
`

export const MODERATE_ACTION_MUTATION = gql`
  mutation ModerateAction($actionId: ID!, $reason: Int!, $value: Int!) {
    moderateAction(actionId: $actionId, reason: $reason, value: $value) {
      id
    }
  }
`

export const RANDOM_MODERATION_QUERY = gql`
  query RandomModeration {
    randomModeration {
      action {
        id
        type
        entity
        changes
        time
        user {
          id
          username
          name
          pictureUrl
          miniPictureUrl
        }
        speakerId
        statementId
        commentId
        videoId
        videoHashId
      }
      flags {
        sourceUser {
          id
          username
          name
          pictureUrl
          miniPictureUrl
        }
        reason
      }
    }
  }
`

export const SPEAKER_QUERY = gql`
  query Speaker($id: ID, $slug: String) {
    speaker(id: $id, slug: $slug) {
      id
      slug
      fullName
      title
      wikidataItemId
      picture
      videos {
        id
        hashId
        title
        thumbnail
        insertedAt
        isPartner
      }
    }
  }
`
