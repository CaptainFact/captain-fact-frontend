import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import FlipMove from 'react-flip-move'

import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import CommentDisplayV2 from './CommentDisplayV2'
import CommentFormV2 from './CommentFormV2'
import CommentsListExpender from './CommentsListExpender'
import CommentsListHeader from './CommentsListHeader'

const getNbDisplayedRange = (nesting) => {
  if (nesting > 3) {
    return [3, 5]
  }
  return [4 - nesting, 6 - nesting]
}

const CommentsListV2 = ({
  comments = [],
  className,
  commentType,
  header,
  statementID,
  replyingTo,
  nesting = 1,
  repliesByParent,
  setReplyToComment,
  votesMap,
}) => {
  const { isAuthenticated, loggedInUser } = useLoggedInUser()
  const [nbComments, setNbComments] = useState(() => getNbDisplayedRange(nesting))

  const commentsLength = comments.length

  // Get displayed comments based on current range
  const displayedComments = useMemo(() => {
    const [lowLimit, highLimit] = nbComments
    const result = []
    let numComment = 0

    for (const comment of comments) {
      numComment++
      if (numComment <= lowLimit || (numComment <= highLimit && (comment.score || 0) > -1)) {
        result.push(comment)
      } else {
        break
      }
    }

    return result
  }, [comments, nbComments])

  const handleExpendList = () => {
    const [lowLimit, highLimit] = nbComments
    setNbComments([lowLimit + 5, highLimit + 7])
  }

  return (
    <div className={className} data-cy={`comments-list-${commentType || 'comments'}`}>
      {header && <CommentsListHeader header={header} />}
      <FlipMove enterAnimation="fade" leaveAnimation={false}>
        {commentsLength > 0 ? (
          displayedComments.map((comment) => {
            // Get replies for this comment if repliesByParent is provided
            const replies = repliesByParent?.[comment.id]
            // Get logged in user's vote for this comment
            const loggedInUserVote = votesMap?.[comment.id] || 0

            return (
              <div key={comment.id}>
                <CommentDisplayV2
                  comment={comment}
                  nesting={nesting}
                  replyingTo={replyingTo}
                  setReplyToComment={setReplyToComment}
                  replies={replies}
                  repliesByParent={repliesByParent}
                  loggedInUserVote={loggedInUserVote}
                />
              </div>
            )
          })
        ) : (
          <CommentFormV2
            statementID={statementID}
            replyTo={replyingTo}
            setReplyToComment={setReplyToComment}
            user={isAuthenticated ? loggedInUser : null}
            inciteToParticipate={commentType}
          />
        )}
      </FlipMove>
      {displayedComments.length < commentsLength && (
        <CommentsListExpender
          count={commentsLength - displayedComments.length}
          onClick={handleExpendList}
          nesting={nesting}
        />
      )}
    </div>
  )
}

CommentsListV2.propTypes = {
  comments: PropTypes.array,
  className: PropTypes.string,
  commentType: PropTypes.string,
  header: PropTypes.node,
  statementID: PropTypes.number,
  replyingTo: PropTypes.object,
  nesting: PropTypes.number,
  repliesByParent: PropTypes.object,
  setReplyToComment: PropTypes.func,
}

export default CommentsListV2
