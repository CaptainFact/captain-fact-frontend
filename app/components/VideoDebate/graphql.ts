import { gql } from '@apollo/client'

// GraphQL Fragments
export const COMMENT_FRAGMENT = gql`
  fragment VideoDebateCommentFields on Comment {
    id
    text
    approve
    score
    insertedAt
    replyToId
    statementId
    user {
      id
      username
      pictureUrl
      miniPictureUrl
      speakerId
    }
    source {
      id
      url
      title
      siteName
    }
  }
`

export const SPEAKER_FRAGMENT = gql`
  fragment VideoDebateSpeakerFields on Speaker {
    id
    fullName
    title
    wikidataItemId
    slug
    picture
  }
`

export const STATEMENT_FRAGMENT = gql`
  fragment VideoDebateStatementFields on Statement {
    id
    text
    time
    isDraft
    speaker {
      ...VideoDebateSpeakerFields
    }
    comments {
      ...VideoDebateCommentFields
    }
  }
  ${COMMENT_FRAGMENT}
  ${SPEAKER_FRAGMENT}
`

// Main Query
export const VIDEO_DEBATE_QUERY = gql`
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
      youtubeId
      speakers {
        ...VideoDebateSpeakerFields
      }
      statements {
        ...VideoDebateStatementFields
      }
    }
    loggedInUser {
      id
      votes(videoHashId: $id)
      flags(videoHashId: $id)
    }
  }
  ${STATEMENT_FRAGMENT}
  ${SPEAKER_FRAGMENT}
`

// Subscriptions
export const STATEMENT_ADDED_SUBSCRIPTION = gql`
  subscription VideoDebateStatementAdded($videoId: ID!) {
    statementAdded(videoId: $videoId) {
      ...VideoDebateStatementFields
      video {
        id
      }
    }
  }
  ${STATEMENT_FRAGMENT}
`

export const STATEMENT_UPDATED_SUBSCRIPTION = gql`
  subscription VideoDebateStatementUpdated($videoId: ID!) {
    statementUpdated(videoId: $videoId) {
      ...VideoDebateStatementFields
      video {
        id
      }
    }
  }
  ${STATEMENT_FRAGMENT}
`

export const STATEMENT_REMOVED_SUBSCRIPTION = gql`
  subscription VideoDebateStatementRemoved($videoId: ID!) {
    statementRemoved(videoId: $videoId) {
      id
    }
  }
`

export const COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription VideoDebateCommentAdded($videoId: ID!) {
    commentAdded(videoId: $videoId) {
      ...VideoDebateCommentFields
    }
  }
  ${COMMENT_FRAGMENT}
`

export const COMMENT_UPDATED_SUBSCRIPTION = gql`
  subscription VideoDebateCommentUpdated($videoId: ID!) {
    commentUpdated(videoId: $videoId) {
      ...VideoDebateCommentFields
    }
  }
  ${COMMENT_FRAGMENT}
`

export const COMMENT_REMOVED_SUBSCRIPTION = gql`
  subscription VideoDebateCommentRemoved($videoId: ID!) {
    commentRemoved(videoId: $videoId) {
      id
      statementId
      replyToId
    }
  }
`

export const COMMENT_SCORE_DIFF_SUBSCRIPTION = gql`
  subscription VideoDebateCommentScoreDiff($videoId: ID!) {
    commentScoreDiff(videoId: $videoId) {
      comment {
        id
        statementId
        replyToId
      }
      diff
    }
  }
`

export const SPEAKER_ADDED_SUBSCRIPTION = gql`
  subscription VideoDebateSpeakerAdded($videoId: ID!) {
    speakerAdded(videoId: $videoId) {
      ...VideoDebateSpeakerFields
    }
  }
  ${SPEAKER_FRAGMENT}
`

export const SPEAKER_UPDATED_SUBSCRIPTION = gql`
  subscription VideoDebateSpeakerUpdated($videoId: ID!) {
    speakerUpdated(videoId: $videoId) {
        ...VideoDebateSpeakerFields
    }
  }
  ${SPEAKER_FRAGMENT}
`

export const SPEAKER_REMOVED_SUBSCRIPTION = gql`
  subscription VideoDebateSpeakerRemoved($videoId: ID!) {
    speakerRemoved(videoId: $videoId) {
      id
    }
  }
`

// Mutations
export const START_AUTOMATIC_STATEMENTS_EXTRACTION_MUTATION = gql`
  mutation VideoDebateStartAutomaticStatementsExtraction($videoId: ID!) {
    startAutomaticStatementsExtraction(videoId: $videoId) {
      id
    }
  }
`

export const UPDATE_SUBSCRIPTION_MUTATION = gql`
  mutation VideoDebateUpdateSubscription($entityId: ID!, $scope: String!, $isSubscribed: Boolean!) {
    updateSubscription(entityId: $entityId, scope: $scope, isSubscribed: $isSubscribed) {
      id
      isSubscribed
      reason
    }
  }
`

// Queries
export const VIDEO_CAPTIONS_QUERY = gql`
  query VideoCaptionsQuery($videoId: ID!) {
    video(id: $videoId) {
      id
      captions {
        text
        start
        duration
      }
    }
  }
`

export const VIDEO_HISTORY_ACTIONS_QUERY = gql`
  query VideoHistoryActions($videoId: ID!) {
    videoHistoryActions(videoId: $videoId) {
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
  }
`

export const STATEMENT_HISTORY_ACTIONS_QUERY = gql`
  query StatementHistoryActions($statementId: ID!) {
    statementHistoryActions(statementId: $statementId) {
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
  }
`

// History Subscriptions
export const VIDEO_HISTORY_ACTION_ADDED_SUBSCRIPTION = gql`
  subscription VideoHistoryActionAdded($videoId: ID!) {
    videoHistoryActionAdded(videoId: $videoId) {
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
  }
`

export const STATEMENT_HISTORY_ACTION_ADDED_SUBSCRIPTION = gql`
  subscription StatementHistoryActionAdded($statementId: ID!) {
    statementHistoryActionAdded(statementId: $statementId) {
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
  }
`
