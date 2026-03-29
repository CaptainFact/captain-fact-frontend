import { ApolloCache } from '@apollo/client'

import {  VIDEO_DEBATE_QUERY } from './graphql'

// Helper to get Video database ID from hashId
const getVideoIdFromHashId = (cache: ApolloCache<any>, videoHashId: string): string | null => {
  const data = cache.readQuery<{ video?: { id: string } | null }>({
    query: VIDEO_DEBATE_QUERY,
    variables: { id: videoHashId },
  })
  return data?.video?.id || null
}

// Sort comment references by score (descending) and then by insertion time
const sortCommentReferences = (commentRefs: any[], readField: any) => {
  return [...commentRefs].sort((a, b) => {
    // First sort by score (descending)
    const aScore = readField('score', a) || 0
    const bScore = readField('score', b) || 0
    if (bScore !== aScore) {
      return bScore - aScore
    }
    // Then by insertion time (ascending - older first)
    const aTime = readField('insertedAt', a) || 0
    const bTime = readField('insertedAt', b) || 0
    return aTime - bTime
  })
}

export const updateCacheOnStatementAdded = (
  cache: ApolloCache<any>,
  videoHashId: string,
  newStatement: any,
) => {
  const videoId = getVideoIdFromHashId(cache, videoHashId)
  if (!videoId) {
    return
  }

  cache.modify({
    id: cache.identify({ __typename: 'Video', id: videoId }),
    fields: {
      statements(existingStatements = [], { readField, toReference }) {
        // Check if statement already exists (avoid duplicates)
        if (existingStatements.some((s) => readField('id', s) === newStatement.id)) {
          return existingStatements
        }
        // Add new statement and sort by time
        const newStatements = [...existingStatements, toReference(newStatement)]
        return newStatements.sort((a, b) => {
          const aTime = Number(readField('time', a) ?? 0)
          const bTime = Number(readField('time', b) ?? 0)
          return aTime - bTime
        })
      },
    },
  })
}


export const updateCacheOnStatementRemoved = (
  cache: ApolloCache<any>,
  videoHashId: string,
  removedId: string,
) => {
  const videoId = getVideoIdFromHashId(cache, videoHashId)
  if (!videoId) {
    return
  }

  cache.modify({
    id: cache.identify({ __typename: 'Video', id: videoId }),
    fields: {
      statements(existingStatements = [], { readField }) {
        return existingStatements.filter((s) => readField('id', s) !== removedId)
      },
    },
  })
}

export const updateCacheOnCommentAdded = (
  cache: ApolloCache<any>,
  videoHashId: string,
  newComment: any,
) => {
  const statementId = newComment.statementId
  if (!statementId) {return}

  cache.modify({
    id: cache.identify({ __typename: 'Statement', id: statementId }),
    fields: {
      comments(existingComments = [], { readField, toReference }) {
        // Check if comment already exists (avoid duplicates)
        if (existingComments.some((c) => readField('id', c) === newComment.id)) {
          return existingComments
        }
        // Add new comment and sort
        const newComments = [...existingComments, toReference(newComment)]
        return sortCommentReferences(newComments, readField)
      },
    },
  })
}

export const updateCacheOnCommentRemoved = (
  cache: ApolloCache<any>,
  videoHashId: string,
  removed: any,
) => {
  const statementId = removed.statementId
  if (!statementId) {return}

  cache.modify({
    id: cache.identify({ __typename: 'Statement', id: statementId }),
    fields: {
      comments(existingComments = [], { readField }) {
        // Remove the comment and any replies to it
        const filteredComments = existingComments.filter((c) => {
          const commentId = readField('id', c)
          const replyToId = readField('replyToId', c)
          return commentId !== removed.id && replyToId !== removed.id
        })
        return sortCommentReferences(filteredComments, readField)
      },
    },
  })
}

export const updateCacheOnCommentScoreDiff = (
  cache: ApolloCache<any>,
  videoHashId: string,
  commentScoreDiff: any,
) => {
  const { comment, diff } = commentScoreDiff
  const statementId = comment.statementId
  if (!statementId) {
    return
  }

  // First, update the comment's score field directly
  cache.modify({
    id: cache.identify({ __typename: 'Comment', id: comment.id }),
    fields: {
      score(currentScore = 0) {
        return currentScore + diff
      },
    },
  })

  // Then, re-sort the comments in the statement
  cache.modify({
    id: cache.identify({ __typename: 'Statement', id: statementId }),
    fields: {
      comments(existingComments = [], { readField }) {
        return sortCommentReferences(existingComments, readField)
      },
    },
  })
}

export const updateCacheOnSpeakerAdded = (
  cache: ApolloCache<any>,
  videoHashId: string,
  newSpeaker: any,
) => {
  const videoId = getVideoIdFromHashId(cache, videoHashId)
  if (!videoId) {
    return
  }

  cache.modify({
    id: cache.identify({ __typename: 'Video', id: videoId }),
    fields: {
      speakers(existingSpeakers = [], { readField, toReference }) {
        // Check if speaker already exists (avoid duplicates)
        if (existingSpeakers.some((s) => readField('id', s) === newSpeaker.id)) {
          return existingSpeakers
        }
        return [...existingSpeakers, toReference(newSpeaker)]
      },
    },
  })
}

export const updateCacheOnSpeakerRemoved = (
  cache: ApolloCache<any>,
  videoHashId: string,
  removedId: string,
) => {
  const videoId = getVideoIdFromHashId(cache, videoHashId)
  if (!videoId) {
    return
  }

  cache.modify({
    id: cache.identify({ __typename: 'Video', id: videoId }),
    fields: {
      speakers(existingSpeakers = [], { readField }) {
        return existingSpeakers.filter((s) => readField('id', s) !== removedId)
      },
    },
  })
}

// Keep the existing function for backward compatibility
export const removeSpeakerFromVideoCache = (cache: ApolloCache<any>, videoId: string, speakerId: string) => {
  cache.modify({
    id: cache.identify({ __typename: 'Video', id: videoId }),
    fields: {
      speakers: (existingSpeakers = [], {readField}) => existingSpeakers.filter((s) => readField('id', s) !== speakerId),
    },
  })
}
