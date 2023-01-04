import React from 'react'
import PropTypes from 'prop-types'
import FlipMove from 'react-flip-move'
import classNames from 'classnames'

import { CommentDisplay } from './CommentDisplay'
import CommentsListHeader from './CommentsListHeader'
import CommentsListExpender from './CommentsListExpender'
import CommentForm from './CommentForm'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'

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
    } = this.props
    const displayedComments = this.getDisplayedComments()

    return (
      <div className={classNames('comments-list', className)}>
        {header && <CommentsListHeader header={header} />}
        <FlipMove enterAnimation="fade" leaveAnimation={false}>
          {comments.size > 0 ? (
            displayedComments.map((comment) => (
              <div key={comment.id}>
                <CommentDisplay
                  comment={comment}
                  nesting={nesting}
                  replyingTo={replyingTo}
                  setReplyToComment={this.props.setReplyToComment}
                />
              </div>
            ))
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
        {displayedComments.size < comments.size && (
          <CommentsListExpender
            count={comments.size - displayedComments.size}
            onClick={() => this.handleExpendList(this.state.nbComments)}
          />
        )}
      </div>
    )
  }

  getDisplayedComments() {
    const [lowLimit, highLimit] = this.state.nbComments
    let numComment = 0
    return this.props.comments.takeWhile((c) => {
      return ++numComment <= lowLimit || (numComment <= highLimit && c.score > -1)
    })
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
