import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { cn } from '@/lib/css-utils'
import { toastError, toastErrorUnauthenticated } from '@/lib/toasts'

import {
  DELETE_COMMENT_MUTATION,
  FLAG_COMMENT_MUTATION,
  VOTE_COMMENT_MUTATION,
} from '../../API/graphql_queries'
import { COLLAPSE_REPLIES_AT_NESTING } from '../../constants'
import { addModal } from '../../state/modals/reducer'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import CommentActions from './CommentActions'
import CommentContent from './CommentContent'
import CommentHeader from './CommentHeader'
import CommentsListV2 from './CommentsListV2'
import ModalDeleteCommentV2 from './ModalDeleteCommentV2'
import ModalFlag from './ModalFlag'
import Vote from './Vote'

const CommentDisplayV2 = ({
  comment,
  nesting = 1,
  replyingTo,
  setReplyToComment,
  replies,
  repliesByParent,
  withoutActions = false,
  withoutHeader = false,
  hideThread = false,
  isQuoted = false,
  richMedias = true,
  loggedInUserVote: initialLoggedInUserVote = 0,
  isFlagged: initialIsFlagged = false,
  votesMap,
}) => {
  const dispatch = useDispatch()
  const { isAuthenticated, loggedInUser } = useLoggedInUser()

  const [isBlurred, setIsBlurred] = useState(false)
  const [repliesCollapsed, setRepliesCollapsed] = useState(nesting === COLLAPSE_REPLIES_AT_NESTING)

  const [isFlagged, setIsFlagged] = useState(initialIsFlagged)

  const approveClass = getApproveClass(comment.approve)
  const allClassNames = cn({
    'opacity-50 blur-sm': isBlurred,
    'border-l': nesting > 1,
    'border-green-500 dark:border-green-600': approveClass === 'approve',
    'border-red-500 dark:border-red-600': approveClass === 'refute',
    'bg-neutral-100 dark:bg-accent border-gray-500 dark:border-border': isQuoted,
  })

  const isOwnComment = comment.user && loggedInUser?.id?.toString() === comment.user.id
  const repliesArray = Array.isArray(replies) ? replies : []

  const [voteComment, { loading: isVoting }] = useMutation(VOTE_COMMENT_MUTATION)

  const handleVote = async (value) => {
    if (!ensureAuthenticated()) {
      return false
    }

    try {
      await voteComment({
        variables: { commentId: comment.id, value: value },
        update: (cache, { data }) => {
          if (!data?.voteComment || !loggedInUser?.id) {
            return
          }

          // Update the loggedInUser.votes map
          cache.modify({
            id: cache.identify({ __typename: 'User', id: loggedInUser.id }),
            fields: {
              votes(existingVotes = {}) {
                return {
                  ...existingVotes,
                  [comment.id]: value,
                }
              },
            },
          })
        },
      })
    } catch (e) {
      toastError(e)
    }
  }

  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
    update: (cache, { data }) => {
      if (!data?.deleteComment) {
        return
      }

      const deletedComment = data.deleteComment
      const statementId = deletedComment.statementId

      if (!statementId) {
        return
      }

      // Find the statement in cache and remove the comment
      try {
        cache.modify({
          id: cache.identify({ __typename: 'Statement', id: statementId }),
          fields: {
            comments(existingComments = [], { readField }) {
              return existingComments.filter((commentRef) => {
                const commentId = readField('id', commentRef)
                const replyToId = readField('replyToId', commentRef)
                // Remove the comment itself and any replies to it
                return commentId !== deletedComment.id && replyToId !== deletedComment.id
              })
            },
          },
        })
      } catch (error) {
        // Cache update might fail if statement is not in cache, which is fine
        console.warn('Could not update cache for deleted comment:', error)
      }
    },
  })

  const handleDelete = () => {
    setIsBlurred(true)
    dispatch(
      addModal({
        Modal: ModalDeleteCommentV2,
        props: {
          handleAbort: () => setIsBlurred(false),
          handleConfirm: async () => {
            setIsBlurred(false)
            try {
              await deleteComment({ variables: { id: comment.id } })
            } catch (error) {
              toastError(error)
            }
          },
          comment: comment,
          replies: repliesArray,
        },
      }),
    )
  }

  const handleReply = () => {
    if (!setReplyToComment || !ensureAuthenticated()) {
      return null
    }
    return setReplyToComment(comment)
  }

  const [flagComment] = useMutation(FLAG_COMMENT_MUTATION, {
    onError: (error) => {
      toastError(error)
    },
  })

  const handleFlag = () => {
    if (!ensureAuthenticated()) {
      return
    }
    setIsBlurred(true)
    dispatch(
      addModal({
        Modal: ModalFlag,
        props: {
          handleAbort: () => setIsBlurred(false),
          handleConfirm: async ({ reason }) => {
            setIsBlurred(false)
            try {
              await flagComment({
                variables: {
                  commentId: comment.id,
                  reason: parseInt(reason),
                },
              })
            } catch {
              // Error already logged in onError
            }
          },
          comment: comment,
        },
      }),
    )
  }

  const toggleShowReplies = () => {
    setRepliesCollapsed(!repliesCollapsed)
  }

  function ensureAuthenticated() {
    if (isAuthenticated) {
      return true
    }
    toastErrorUnauthenticated()
    return false
  }

  function getApproveClass(approve) {
    return approve !== null && (approve ? 'approve' : 'refute')
  }

  return (
    <div className={allClassNames}>
      <article id={`comment-${comment.id}`} className={'flex gap-4 p-4'}>
        {!withoutActions && (
          <div className="flex-shrink-0">
            <Vote
              isVoting={isVoting}
              score={comment.score}
              loggedInUserVote={initialLoggedInUserVote}
              onVote={handleVote}
              isReported={comment.is_reported}
            />
          </div>
        )}
        <div className="flex-grow min-w-0">
          {!withoutHeader && <CommentHeader comment={comment} withoutActions={withoutActions} />}
          <CommentContent
            comment={comment}
            nesting={nesting}
            replyingTo={replyingTo}
            richMedias={richMedias}
          />
          {!withoutActions && (
            <CommentActions
              isOwnComment={isOwnComment}
              isFlagged={isFlagged}
              nbReplies={repliesArray.length}
              repliesCollapsed={repliesCollapsed}
              handleReply={handleReply}
              handleDelete={handleDelete}
              handleFlag={handleFlag}
              handleToggleShowReplies={toggleShowReplies}
            />
          )}
        </div>
      </article>
      {!hideThread && !repliesCollapsed && repliesArray.length > 0 && (
        <div className="ml-7">
          <CommentsListV2
            comments={repliesArray}
            nesting={nesting + 1}
            replyingTo={comment.user}
            setReplyToComment={setReplyToComment}
            repliesByParent={repliesByParent}
            votesMap={votesMap}
          />
        </div>
      )}
    </div>
  )
}

export default CommentDisplayV2
