import React from 'react'

export default class Comments extends React.PureComponent {
  state = {
    upvote: this.props.comment.upvote,
    downvote: this.props.comment.downvote
  }

  upvote() {
    const newvote = this.state.upvote + 1
    this.setState({
      upvote: newvote
    })
  }

  downvote() {
    const newvote = this.state.downvote + 1
    this.setState({
      downvote: newvote
    })
  }

  render() {
    const { comment } = this.props
    return (
      <div className="comment">
        <div className="date">{comment.date}</div>
        <div className="options">
          <span />
          <span />
          <span />
        </div>
        <div className="reaction">
          <div className="approves">
            {comment.approves ? (
              <span className="approves-true">
                <i className="fas fa-check" />
                <span>Approuve</span>
              </span>
            ) : (
              <span className="approves-false">
                <i className="fas fa-times" />
                <span>Réfute</span>
              </span>
            )}
          </div>
          <span className="up vote" onClick={this.upvote.bind(this)}>
            <i className="fas fa-arrow-up" /> {this.state.upvote}
          </span>
          <span className="down vote" onClick={this.downvote.bind(this)}>
            <i className="fas fa-arrow-down" /> -{this.state.downvote}
          </span>
        </div>
        <div className="text">
          {comment.text}
          <div className="button">{comment.button_text}</div>
        </div>
        <div className="user">
          <img src={comment.author_avatar_url} alt="" />
          <div className="badges">
            {comment.badges.map((badge, index) => {
              return (
                <span key={`badge-${index}`} className="tooltip">
                  <i className={`fas ${badge.icon}`} />
                  <span className="tooltiptext">{badge.name}</span>
                </span>
              )
            })}
            {comment.verified && (
              <span className="tooltip">
                <i className="fas fa-check" />
                <span className="tooltiptext">Vérifié</span>
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }
}
