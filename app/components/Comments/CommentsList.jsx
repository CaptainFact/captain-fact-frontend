import PropTypes from 'prop-types'
import React from 'react'
import FlipMove from 'react-flip-move'

import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { CommentDisplay } from './CommentDisplay'
import CommentForm from './CommentForm'
import CommentsListExpender from './CommentsListExpender'
import CommentsListHeader from './CommentsListHeader'

@withLoggedInUser
export class CommentsList extends React.PureComponent {
  static propTypes = {
    setReplyToComment: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      nbComments: this.getNbDisplayedRange(props.nesting || 1),
    }
  }

  // Normalize comments to array - handles both arrays and Immutable-like objects
  normalizeToArray(comments) {
    if (!comments) return []
    if (Array.isArray(comments)) return comments
    if (comments.toArray) return comments.toArray()
    if (comments.size !== undefined) {
      // Immutable-like object - convert to array
      const result = []
      for (let i = 0; i < comments.size; i++) {
        result.push(comments.get(i))
      }
      return result
    }
    return []
  }

  // Get length of comments - handles both arrays and Immutable-like objects
  getCommentsLength(comments) {
    if (!comments) return 0
    if (Array.isArray(comments)) return comments.length
    if (comments.size !== undefined) return comments.size
    return 0
  }

  render() {
    const {
      comments,
      className,
      commentType,
      header,
      statementID,
      replyingTo,
      isAuthenticated,
      loggedInUser,
      nesting = 1,
      repliesByParent,
    } = this.props
    const commentsArray = this.normalizeToArray(comments)
    const commentsLength = this.getCommentsLength(comments)
    const displayedComments = this.getDisplayedComments(commentsArray)

    return (
      <div className={className} data-cy={`comments-list-${commentType || 'comments'}`}>
        {header && <CommentsListHeader header={header} />}
        <FlipMove enterAnimation="fade" leaveAnimation={false}>
          {commentsLength > 0 ? (
            displayedComments.map((comment) => {
              // Get replies for this comment if repliesByParent is provided
              const replies = repliesByParent && repliesByParent[comment.id] 
                ? this.normalizeToArray(repliesByParent[comment.id])
                : undefined
              
              return (
                <div key={comment.id}>
                  <CommentDisplay
                    comment={comment}
                    nesting={nesting}
                    replyingTo={replyingTo}
                    setReplyToComment={this.props.setReplyToComment}
                    replies={replies}
                  />
                </div>
              )
            })
          ) : (
            <CommentForm
              statementID={statementID}
              replyTo={replyingTo}
              setReplyToComment={this.props.setReplyToComment}
              user={isAuthenticated ? loggedInUser : null}
              inciteToParticipate={commentType}
            />
          )}
        </FlipMove>
        {displayedComments.length < commentsLength && (
          <CommentsListExpender
            count={commentsLength - displayedComments.length}
            onClick={() => this.handleExpendList(this.state.nbComments)}
          />
        )}
      </div>
    )
  }

  getDisplayedComments(commentsArray) {
    const [lowLimit, highLimit] = this.state.nbComments
    const result = []
    let numComment = 0
    
    for (const comment of commentsArray) {
      numComment++
      if (numComment <= lowLimit || (numComment <= highLimit && (comment.score || 0) > -1)) {
        result.push(comment)
      } else {
        break
      }
    }
    
    return result
  }

  handleExpendList([lowLimit, highLimit]) {
    this.setState({ nbComments: [lowLimit + 5, highLimit + 7] })
  }

  getNbDisplayedRange(nesting) {
    if (nesting > 3) {
      return [3, 5]
    }
    return [4 - nesting, 6 - nesting]
  }
}

CommentsList.defaultProps = {
  comments: [],
  displayLimit: 5,
}
