import { ApolloClient, useQuery, useSubscription } from '@apollo/client'
import { FocusedStatementProvider } from 'app/contexts/FocusedStatementContext'
import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'

import { VideoPlaybackProvider } from '../../contexts/VideoPlaybackContext'
import { toAbsoluteURL, videoURL } from '../../lib/cf_routes'
import { getHDThumbnailUrl } from '../../lib/video_utils'
import BackgroundNotifier from '../App/BackgroundNotifier'
import { ErrorView } from '../Utils/ErrorView'
import ColumnDebate from './ColumnDebate'
import ColumnVideo from './ColumnVideo'
import {
  COMMENT_ADDED_SUBSCRIPTION,
  COMMENT_REMOVED_SUBSCRIPTION,
  COMMENT_SCORE_DIFF_SUBSCRIPTION,
  COMMENT_UPDATED_SUBSCRIPTION,
  SPEAKER_ADDED_SUBSCRIPTION,
  SPEAKER_REMOVED_SUBSCRIPTION,
  SPEAKER_UPDATED_SUBSCRIPTION,
  STATEMENT_ADDED_SUBSCRIPTION,
  STATEMENT_REMOVED_SUBSCRIPTION,
  STATEMENT_UPDATED_SUBSCRIPTION,
  VIDEO_DEBATE_QUERY,
} from './graphql'
import {
  updateCacheOnCommentAdded,
  updateCacheOnCommentRemoved,
  updateCacheOnCommentScoreDiff,
  updateCacheOnSpeakerAdded,
  updateCacheOnSpeakerRemoved,
  updateCacheOnStatementAdded,
  updateCacheOnStatementRemoved,
} from './graphql-cache'

// State management reducer
const initialState = {
  statementForm: null, // { speakerId, text, time } or null
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

// Custom hook to handle all video debate subscriptions
const useVideoDebateSubscriptions = (
  client: ApolloClient<any>,
  videoHashId: string,
  videoDatabaseId: string,
) => {
  // Subscribe to statement additions
  useSubscription(STATEMENT_ADDED_SUBSCRIPTION, {
    variables: { videoId: videoDatabaseId },
    skip: !videoDatabaseId || !videoHashId || !client,
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData?.data?.statementAdded) {
        updateCacheOnStatementAdded(client.cache, videoHashId, subscriptionData.data.statementAdded)
      }
    },
  })

  // Subscribe to statement updates
  useSubscription(STATEMENT_UPDATED_SUBSCRIPTION, {
    variables: { videoId: videoDatabaseId },
    skip: !videoDatabaseId || !videoHashId || !client,
  })

  // Subscribe to statement removals
  useSubscription(STATEMENT_REMOVED_SUBSCRIPTION, {
    variables: { videoId: videoDatabaseId },
    skip: !videoDatabaseId || !videoHashId || !client,
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData?.data?.statementRemoved) {
        updateCacheOnStatementRemoved(
          client.cache,
          videoHashId,
          subscriptionData.data.statementRemoved.id,
        )
      }
    },
  })

  // Subscribe to comment additions
  useSubscription(COMMENT_ADDED_SUBSCRIPTION, {
    variables: { videoId: videoDatabaseId },
    skip: !videoDatabaseId || !videoHashId || !client,
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData?.data?.commentAdded) {
        updateCacheOnCommentAdded(client.cache, videoHashId, subscriptionData.data.commentAdded)
      }
    },
  })

  // Subscribe to comment updates
  useSubscription(COMMENT_UPDATED_SUBSCRIPTION, {
    variables: { videoId: videoDatabaseId },
    skip: !videoDatabaseId || !videoHashId || !client,
  })

  // Subscribe to comment removals
  useSubscription(COMMENT_REMOVED_SUBSCRIPTION, {
    variables: { videoId: videoDatabaseId },
    skip: !videoDatabaseId || !videoHashId || !client,
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData?.data?.commentRemoved) {
        updateCacheOnCommentRemoved(client.cache, videoHashId, subscriptionData.data.commentRemoved)
      }
    },
  })

  // Subscribe to comment score diffs
  useSubscription(COMMENT_SCORE_DIFF_SUBSCRIPTION, {
    variables: { videoId: videoDatabaseId },
    skip: !videoDatabaseId || !videoHashId || !client,
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData?.data?.commentScoreDiff) {
        updateCacheOnCommentScoreDiff(
          client.cache,
          videoHashId,
          subscriptionData.data.commentScoreDiff,
        )
      }
    },
  })

  // Subscribe to speaker additions
  useSubscription(SPEAKER_ADDED_SUBSCRIPTION, {
    variables: { videoId: videoDatabaseId },
    skip: !videoDatabaseId || !videoHashId || !client,
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData?.data?.speakerAdded) {
        updateCacheOnSpeakerAdded(client.cache, videoHashId, subscriptionData.data.speakerAdded)
      }
    },
  })

  // Subscribe to speaker updates (Apollo able to auto-update)
  useSubscription(SPEAKER_UPDATED_SUBSCRIPTION, {
    variables: { videoId: videoDatabaseId },
    skip: !videoDatabaseId || !videoHashId || !client,
  })

  // Subscribe to speaker removals
  useSubscription(SPEAKER_REMOVED_SUBSCRIPTION, {
    variables: { videoId: videoDatabaseId },
    skip: !videoDatabaseId || !videoHashId || !client,
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData?.data?.speakerRemoved) {
        updateCacheOnSpeakerRemoved(
          client.cache,
          videoHashId,
          subscriptionData.data.speakerRemoved.id,
        )
      }
    },
  })
}

const VideoDebate = () => {
  const { videoId, view } = useParams()
  const location = useLocation()
  const [state, dispatch] = useReducer(videoDebateReducer, initialState)
  const prevVideoIdRef = useRef(null)

  // Fetch initial video data
  const { data, loading, error, client } = useQuery(VIDEO_DEBATE_QUERY, {
    variables: { id: videoId },
    skip: !videoId,
  })

  const videoDatabaseId = data?.video?.id

  // Reset when videoId changes
  useEffect(() => {
    if (prevVideoIdRef.current !== null && prevVideoIdRef.current !== videoId) {
      dispatch({ type: 'SET_STATEMENT_FORM', payload: null })
    }
    prevVideoIdRef.current = videoId
  }, [videoId])

  // Subscribe to all video debate events
  useVideoDebateSubscriptions(client, videoId, videoDatabaseId)

  // Simple scroll function for components that need to scroll to elements
  const handleScrollTo = useCallback((target) => {
    if (typeof target === 'string') {
      // Direct element ID (could be statement-{id} or comment-{id})
      const element = document.getElementById(target)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    } else if (target && target.id) {
      // Legacy object format { id, ... }
      // Check if it's a comment (starts with 'comment-') or statement
      const elementId = target.id.toString().startsWith('comment-')
        ? target.id.toString()
        : `statement-${target.id}`
      const element = document.getElementById(elementId)
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
          statement.comments?.some((comment) => {
            const commentIdNum = typeof comment.id === 'string' ? parseInt(comment.id) : comment.id
            const searchCommentIdNum = typeof commentId === 'string' ? parseInt(commentId) : commentId
            return commentIdNum === searchCommentIdNum
          }),
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
    <FocusedStatementProvider
      offset={data?.video?.youtubeOffset || 0}
      statements={data?.video?.statements}
    >
      {({ updatePosition }) => (
        <VideoPlaybackProvider onUpdatePosition={(position) => updatePosition(position)}>
          <div
            id="video-show"
            className="h-full 2xl:flex lg:gap-0"
            data-video-language={data?.video?.language}
          >
            {!loading && data?.video && renderMeta(data.video)}
            <ColumnVideo
              video={data?.video}
              isLoading={loading}
              view={currentView}
              onSetStatementForm={(form) => dispatch({ type: 'SET_STATEMENT_FORM', payload: form })}
            />
            <ColumnDebate
              video={data?.video}
              isLoading={loading}
              view={currentView}
              videoId={data?.video?.id}
              statements={data?.video?.statements}
              statementForm={state.statementForm}
              votesMap={data?.loggedInUser?.votes}
              flagsMap={data?.loggedInUser?.flags}
              onSetStatementForm={(form) => dispatch({ type: 'SET_STATEMENT_FORM', payload: form })}
              onClearStatementForm={() => dispatch({ type: 'CLEAR_STATEMENT_FORM' })}
              onSetScrollTo={handleScrollTo}
            />
            <BackgroundNotifier />
          </div>
        </VideoPlaybackProvider>
      )}
    </FocusedStatementProvider>
  )
}

export default VideoDebate
