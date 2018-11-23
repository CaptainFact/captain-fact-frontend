import React from 'react'

export default class UserQuoteIcon extends React.PureComponent {
  render() {
    const { quote, selectQuote, disabled, index, videoLength } = this.props
    const percentage = (quote.time / videoLength) * 100

    return (
      <div
        className={`timeline-elem ${!disabled ? 'disabled' : ''}`}
        style={{ left: `${percentage}%` }}
        onClick={() => selectQuote(index)}
      >
        <img src={quote.author_avatar_url} alt="" />
        <svg height="30" width="30" fill="white" viewBox="0 0 30 30">
          <polygon points="0,0 15,15 0,30" />
        </svg>
      </div>
    )
  }
}
