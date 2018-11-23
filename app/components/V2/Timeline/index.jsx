import React from 'react'
import UserQuoteIcon from './UserQuoteIcon'
import quote from '../../../assets/V2/quote.png'

export default class Timeline extends React.PureComponent {
  state = {
    currentQuote: this.props.quotes[0]
  }

  selectQuote(index) {
    this.props.goTo(this.props.quotes[index].time)
    this.setState({
      currentQuote: this.props.quotes[index]
    })
  }

  render() {
    const { quotes, videoDuration, videoLength } = this.props

    const time = videoDuration ? videoDuration.playedSeconds : 0
    const percentage = Math.abs((time / videoLength) * 100 - 100)

    return (
      <div className="timeline">
        {quotes.map((quote, index) => {
          return (
            <UserQuoteIcon
              key={`quote-${index}`}
              selectQuote={this.selectQuote.bind(this)}
              index={index}
              disabled={this.props.quotes[index] === this.state.currentQuote}
              videoLength={videoLength}
              quote={quote}
            />
          )
        })}
        <div className="timeline-bar">
          <div className="progress" style={{ right: `${percentage}%` }} />
        </div>

        <div className="timeline-info">
          <div className="options">
            <span />
            <span />
            <span />
          </div>
          <div className="title">
            <img src={quote} alt="" />
            <h2>{this.state.currentQuote.quote}</h2>
            <img src={quote} alt="" />
          </div>
          <div className="legend">
            <div className="vote">
              {this.state.currentQuote.votes.approves}
              {this.state.currentQuote.votes.disapproves}
              {this.state.currentQuote.votes.comments}
              {this.state.currentQuote.votes.falacious}
            </div>
            <div className="author">
              <img src={this.state.currentQuote.author_avatar_url} alt="" />
              <span>{this.state.currentQuote.author}</span>
              <i>{this.state.currentQuote.author_role}</i>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
