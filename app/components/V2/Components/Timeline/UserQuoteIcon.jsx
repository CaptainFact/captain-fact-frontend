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
      </div>
    )
  }
}
