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
    // TODO:
    // statementID ? since I need it everytime ?
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
              <CommentDisplay
                key={comment.id}
                comment={comment}
                nesting={nesting}
                replyingTo={replyingTo}
                setReplyToComment={this.props.setReplyToComment}
              />
            ))
          ) : (
            <CommentForm
              statementID={statementID}
              replyTo={replyingTo}
              setReplyToComment={this.props.setReplyToComment}
              user={isAuthenticated ? loggedInUser : null}
              inciteToParticipate={this.extractCommentType(className)}
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

  extractCommentType(className) {
    const type = []
    for (const name of className.split(' ')) {
      console.log(className)
      if (name == 'approve' || name == 'refute') {
        type.push(name)
      }
    }

    // Extra check to ensure that we only have type either "approve" || "refute"
    if (type.size > 1) {
      // TODO: error
    }
    return type[0]
  }
}

CommentsList.defaultProps = {
  comments: [],
  displayLimit: 5,
}
