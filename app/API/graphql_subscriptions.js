import gql from 'graphql-tag'

// GraphQL subscription queries
// Note: Absinthe converts snake_case schema fields to camelCase in GraphQL queries
export const STATEMENT_ADDED_SUBSCRIPTION = gql`
  subscription StatementAdded($videoId: ID!) {
    statementAdded(videoId: $videoId) {
      id
      time
      text
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

export const STATEMENT_UPDATED_SUBSCRIPTION = gql`
  subscription StatementUpdated($videoId: ID!) {
    statementUpdated(videoId: $videoId) {
      id
      time
      text
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

export const STATEMENT_REMOVED_SUBSCRIPTION = gql`
  subscription StatementRemoved($videoId: ID!) {
    statementRemoved(videoId: $videoId) {
      id
    }
  }
`

export const COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription CommentAdded($videoId: ID!) {
    commentAdded(videoId: $videoId) {
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
      }
      source {
        id
        url
      }
    }
  }
`

export const COMMENT_UPDATED_SUBSCRIPTION = gql`
  subscription CommentUpdated($videoId: ID!) {
    commentUpdated(videoId: $videoId) {
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
      }
      source {
        id
        url
      }
    }
  }
`

export const COMMENT_REMOVED_SUBSCRIPTION = gql`
  subscription CommentRemoved($videoId: ID!) {
    commentRemoved(videoId: $videoId) {
      id
      statementId
      replyToId
    }
  }
`

export const COMMENT_SCORE_DIFF_SUBSCRIPTION = gql`
  subscription CommentScoreDiff($videoId: ID!) {
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
