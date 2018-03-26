import React from "react"
import { translate } from 'react-i18next'
import FlipMove from 'react-flip-move'

import { CommentDisplay } from "./CommentDisplay"


@translate('videoDebate')
export class CommentsContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {nbComments: CommentsContainer.getNbDisplayedRange(props.nesting || 1)}
  }

  render() {
    const {t, comments, className, header, replyingTo, nesting=1} = this.props

    let numComment = 0
    const displayedComments = comments.takeWhile(c =>
      ++numComment <= this.state.nbComments[0] ||
      (numComment <= this.state.nbComments[1] && c.score > -1)
    )
    return (
      <div className={`comments-list ${className ? className : ''}`}>
        {header && <div className="comments-list-header">{header}</div>}
        <FlipMove enterAnimation="fade" leaveAnimation={false}>
          {displayedComments.map(comment =>
            <div key={comment.id}>
              <CommentDisplay comment={comment} nesting={nesting} replyingTo={replyingTo}/>
            </div>
          )}
        </FlipMove>
        {displayedComments.size < comments.size &&
          <div className='comments-expender'>
            <a className="button"
              onClick={() => this.setState({
                nbComments: [this.state.nbComments[0] + 5, this.state.nbComments[1] + 7]
              })}>
              {t('comment.loadMore', {
                context: nesting === 1 ? 'comments' : 'replies',
                count: comments.size - displayedComments.size}
              )}
            </a>
          </div>
        }
      </div>
    )
  }

  static getNbDisplayedRange(nesting) {
    if (nesting > 3)
      return [3, 5]
    return [4 - nesting, 6 - nesting]
  }
}

CommentsContainer.defaultProps = {
  comments: [],
  displayLimit: 5
}
