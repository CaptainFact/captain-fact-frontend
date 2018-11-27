import React from 'react'
import FlipMove from 'react-flip-move'
import classNames from 'classnames'

import { CommentDisplay } from './CommentDisplay'
import CommentsListHeader from './CommentsListHeader'
import CommentsListExpender from './CommentsListExpender'

export class CommentsList extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      nbComments: this.getNbDisplayedRange(props.nesting || 1)
    }
  }

  render() {
    const { comments, className, header, replyingTo, nesting = 1 } = this.props
    const displayedComments = this.getDisplayedComments()

    return (
      <div className={classNames('comments-list', className)}>
        {header && <CommentsListHeader header={header} />}
        <FlipMove enterAnimation="fade" leaveAnimation={false}>
          {displayedComments.map(comment => (
            <CommentDisplay
              key={comment.id}
              comment={comment}
              nesting={nesting}
              replyingTo={replyingTo}
            />
          ))}
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
    return this.props.comments.takeWhile(c => {
      return ++numComment <= lowLimit || (numComment <= highLimit && c.score > -1)
    })
  }

  handleExpendList([lowLimit, highLimit]) {
    this.setState({ nbComments: [lowLimit + 5, highLimit + 7] })
  }

  getNbDisplayedRange(nesting) {
    if (nesting > 3) return [3, 5]
    return [4 - nesting, 6 - nesting]
  }
}

CommentsList.defaultProps = {
  comments: [],
  displayLimit: 5
}
