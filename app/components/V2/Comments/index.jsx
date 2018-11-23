import React from 'react'

export default class Comments extends React.PureComponent {
  render() {
    const { comment } = this.props
    return (
      <div className="comment">
        <div className="date">{comment.date}</div>
        <div className="reaction">
          <div className="approves">
            {comment.approves ? (
              <span className="approves-true"></span> Approuve
              ) : (
                <span className="approves-true"></span> Réfute
            )}
          </div>
          <span className="up vote">
            <i className="fas fa-arrow-up" /> {comment.upvote}
          </span>
          <span className="down vote">
            <i className="fas fa-arrow-down" /> -{comment.downvote}
          </span>
        </div>
        <div className="text">{comment.text}</div>
      </div>
    )
  }
}
