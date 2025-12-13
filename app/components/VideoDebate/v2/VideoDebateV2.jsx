import { gql, useApolloClient, useQuery, useSubscription } from '@apollo/client'
import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'

import { VideoPlaybackProvider } from '../../../contexts/VideoPlaybackContext'
import { toAbsoluteURL, videoURL } from '../../../lib/cf_routes'
import { getHDThumbnailUrl } from '../../../lib/video_utils'
import BackgroundNotifier from '../../App/BackgroundNotifier'
import { ErrorView } from '../../Utils/ErrorView'
import ColumnDebateV2 from './ColumnDebateV2'
import ColumnVideoV2 from './ColumnVideoV2'

// GraphQL Fragments
const COMMENT_FRAGMENT = gql`
  fragment CommentFields on Comment {
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
    }
  }
`

const STATEMENT_FRAGMENT = gql`
  fragment StatementFields on Statement {
    id
    text
    time
    isDraft
    speaker {
      id
      fullName
      picture
      title
    }
    comments {
      ...CommentFields
    }
  }
  ${COMMENT_FRAGMENT}
`

// Main Query
const VIDEO_DEBATE_QUERY = gql`
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
        id
        fullName
        title
        wikidataItemId
        slug
        picture
      }
      statements {
        ...StatementFields
      }
    }
    loggedInUser {
      id
      votes(videoHashId: $id)
    }
  }
  ${STATEMENT_FRAGMENT}
`

// Subscriptions
const STATEMENT_ADDED_SUBSCRIPTION = gql`
  subscription StatementAdded($videoId: ID!) {
    statementAdded(videoId: $videoId) {
      ...StatementFields
      video {
        id
      }
    }
  }
  ${STATEMENT_FRAGMENT}
`

const STATEMENT_REMOVED_SUBSCRIPTION = gql`
  subscription StatementRemoved($videoId: ID!) {
    statementRemoved(videoId: $videoId) {
      id
    }
  }
`

const COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription CommentAdded($videoId: ID!) {
    commentAdded(videoId: $videoId) {
      ...CommentFields
    }
  }
  ${COMMENT_FRAGMENT}
`

const COMMENT_REMOVED_SUBSCRIPTION = gql`
  subscription CommentRemoved($videoId: ID!) {
    commentRemoved(videoId: $videoId) {
      id
      statementId
      replyToId
    }
  }
`

const COMMENT_SCORE_DIFF_SUBSCRIPTION = gql`
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

// State management reducer
const initialState = {
  statementForm: null, // { speaker_id, text, time } or null
}

const videoDebateReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STATEMENT_FORM':
      return {
        ...state,
        statementForm: action.payload,
      }
    case 'CLEAR_STATEMENT_FORM':
      return {
        ...state,
        statementForm: null,
      }
    default:
      return state
  }
}

// Sort comments by score (descending) and then by insertion time
const sortComments = (comments) => {
  return [...comments].sort((a, b) => {
    // First sort by score (descending)
    if (b.score !== a.score) {
      return (b.score || 0) - (a.score || 0)
    }
    // Then by insertion time (ascending - older first)
    const aTime = a.insertedAt || 0
    const bTime = b.insertedAt || 0
    return aTime - bTime
  })
}

// Custom hook to handle all video debate subscriptions
const useVideoDebateSubscriptions = (subscribeToMore, videoId) => {
  const client = useApolloClient()

  // Use subscribeToMore for new entries (additions)
  useEffect(() => {
    if (!subscribeToMore || !videoId) {
      return
    }

    // Subscribe to statement additions
    const unsubscribeStatementAdded = subscribeToMore({
      document: STATEMENT_ADDED_SUBSCRIPTION,
      variables: { videoId: videoId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data?.statementAdded) {
          return prev
        }
        const newStatement = subscriptionData.data.statementAdded
        const existingStatements = prev.video?.statements || []

        // Check if statement already exists (avoid duplicates)
        if (existingStatements.some((s) => s.id === newStatement.id)) {
          return prev
        }

        return {
          ...prev,
          video: {
            ...prev.video,
            statements: [...existingStatements, newStatement].sort((a, b) => a.time - b.time),
          },
        }
      },
    })

    // Subscribe to comment additions
    const unsubscribeCommentAdded = subscribeToMore({
      document: COMMENT_ADDED_SUBSCRIPTION,
      variables: { videoId: videoId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data?.commentAdded) {
          return prev
        }
        const newComment = subscriptionData.data.commentAdded
        const statementId = newComment.statementId
        if (!statementId || !prev.video?.statements) {
          return prev
        }

        return {
          ...prev,
          video: {
            ...prev.video,
            statements: prev.video.statements.map((statement) => {
              if (statement.id !== statementId) {
                return statement
              }
              const existingComments = statement.comments || []
              // Check if comment already exists (avoid duplicates)
              if (existingComments.some((c) => c.id === newComment.id)) {
                return statement
              }
              return {
                ...statement,
                comments: sortComments([...existingComments, newComment]),
              }
            }),
          },
        }
      },
    })

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeStatementAdded()
      unsubscribeCommentAdded()
    }
  }, [subscribeToMore, videoId])

  // Use useSubscription with onData and cache.modify for deletions
  useSubscription(STATEMENT_REMOVED_SUBSCRIPTION, {
    variables: { videoId: videoId },
    skip: !videoId,
    onData: ({ data }) => {
      if (!data.data?.statementRemoved) {
        return
      }
      const removedId = data.data.statementRemoved.id

      client.cache.modify({
        id: client.cache.identify({ __typename: 'Video', id: videoId }),
        fields: {
          statements(existingStatements = [], { readField }) {
            return existingStatements.filter(
              (statementRef) => readField('id', statementRef) !== removedId,
            )
          },
        },
      })
    },
  })

  useSubscription(COMMENT_REMOVED_SUBSCRIPTION, {
    variables: { videoId: videoId },
    skip: !videoId,
    onData: ({ data }) => {
      if (!data.data?.commentRemoved) {
        return
      }
      const removed = data.data.commentRemoved
      const statementId = removed.statementId
      if (!statementId) {
        return
      }

      // Modify the statement's comments
      client.cache.modify({
        id: client.cache.identify({ __typename: 'Statement', id: statementId }),
        fields: {
          comments(existingComments = [], { readField }) {
            return existingComments.filter((commentRef) => {
              const commentId = readField('id', commentRef)
              const replyToId = readField('replyToId', commentRef)
              return commentId !== removed.id && replyToId !== removed.id
            })
          },
        },
      })
    },
  })

  useSubscription(COMMENT_SCORE_DIFF_SUBSCRIPTION, {
    variables: { videoId: videoId },
    skip: !videoId,
    onData: ({ data }) => {
      if (!data.data?.commentScoreDiff) {
        return
      }
      const { comment, diff } = data.data.commentScoreDiff
      const statementId = comment.statementId
      if (!statementId) {
        return
      }

      client.cache.modify({
        id: client.cache.identify({ __typename: 'Statement', id: statementId }),
        fields: {
          comments(existingComments = []) {
            return existingComments.map((c) =>
              c.id === comment.id ? { ...c, score: (c.score || 0) + diff } : c,
            )
          },
        },
      })
    },
  })
}

const VideoDebateV2 = ({ t: _t }) => {
  const { videoId, view } = useParams()
  const location = useLocation()
  const [state, dispatch] = useReducer(videoDebateReducer, initialState)
  const prevVideoIdRef = useRef(null)

  // Fetch initial video data
  const { data, loading, error, subscribeToMore } = useQuery(VIDEO_DEBATE_QUERY, {
    variables: { id: videoId },
    skip: !videoId,
  })

  // Reset when videoId changes
  useEffect(() => {
    if (prevVideoIdRef.current !== null && prevVideoIdRef.current !== videoId) {
      dispatch({ type: 'SET_STATEMENT_FORM', payload: null })
    }
    prevVideoIdRef.current = videoId
  }, [videoId])

  // Subscribe to all video debate events
  useVideoDebateSubscriptions(subscribeToMore, data?.video?.id)

  // Simple scroll function for components that need to scroll to elements
  const handleScrollTo = useCallback((target) => {
    if (typeof target === 'string') {
      // Direct element ID
      const element = document.getElementById(target)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    } else if (target && target.id) {
      // Legacy object format { id, ... }
      const element = document.getElementById(`statement-${target.id}`)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
  }, [])

  // Handle scrolling to statement or comment once data is loaded
  useEffect(() => {
    if (data?.video?.statements && !loading) {
      const searchParams = new URLSearchParams(location.search)
      const statementId = searchParams.get('statement')
      const commentId = searchParams.get('c')

      // Validate that the target exists in the current video data
      let targetElementId = null

      if (commentId) {
        // Check if the comment exists in any statement
        const commentExists = data.video.statements.some((statement) =>
          statement.comments?.some((comment) => comment.id === parseInt(commentId)),
        )
        if (commentExists) {
          targetElementId = `comment-${commentId}`
        }
      } else if (statementId) {
        // Check if the statement exists
        const statementExists = data.video.statements.some(
          (statement) => statement.id === parseInt(statementId),
        )
        if (statementExists) {
          targetElementId = `statement-${statementId}`
        }
      }

      if (targetElementId) {
        // Use setTimeout to ensure DOM is fully rendered
        setTimeout(() => {
          const element = document.getElementById(targetElementId)
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
          }
        }, 100)
      }
    }
  }, [data?.video?.statements, loading]) // Only run when data loads, not on every URL change

  // All hooks must be called before any conditional returns
  const currentView = view || 'debate'
  const statementsWithComments = useMemo(() => {
    return (data?.video?.statements || []).map((statement) => ({
      ...statement,
      comments: sortComments(statement.comments || []),
    }))
  }, [data?.video?.statements])

  // Render meta tags
  const renderMeta = (video) => {
    if (!video) {
      return null
    }
    const title = `Fact-checking : ${video.title}`
    const image = getHDThumbnailUrl(video)
    const description = `${video.title} vérifiée citation par citation par la communauté CaptainFact`
    return (
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={toAbsoluteURL(videoURL(video.hashId))} />
        {image && <meta property="og:image" content={image} />}
        {image && <meta name="twitter:image" content={image} />}
      </Helmet>
    )
  }

  // Early return after all hooks
  if (error) {
    return <ErrorView error={error} />
  }

  return (
    <VideoPlaybackProvider>
      <div
        id="video-show"
        className="h-full 2xl:flex lg:gap-0"
        data-video-language={data?.video?.language}
      >
        {!loading && data?.video && renderMeta(data.video)}
        <ColumnVideoV2
          video={data?.video}
          isLoading={loading}
          view={currentView}
          onSetStatementForm={(form) => dispatch({ type: 'SET_STATEMENT_FORM', payload: form })}
        />
        <ColumnDebateV2
          video={data?.video}
          isLoading={loading}
          view={currentView}
          videoId={data?.video?.id}
          statements={statementsWithComments}
          statementForm={state.statementForm}
          votesMap={data?.loggedInUser?.votes}
          onSetStatementForm={(form) => dispatch({ type: 'SET_STATEMENT_FORM', payload: form })}
          onClearStatementForm={() => dispatch({ type: 'CLEAR_STATEMENT_FORM' })}
          onSetScrollTo={handleScrollTo}
        />
        <BackgroundNotifier
          statements={statementsWithComments}
          videoOffset={data?.video?.youtubeOffset || 0}
        />
      </div>
    </VideoPlaybackProvider>
  )
}

export default withTranslation('videoDebate')(VideoDebateV2)
