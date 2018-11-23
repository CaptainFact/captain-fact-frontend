import React from 'react'

import quote from '../../../assets/V2/quote.png'

export default class Timeline extends React.PureComponent {
  render() {
    const { quotes, videoDuration, videoLength } = this.props

    const time = videoDuration ? videoDuration.playedSeconds : 0
    const percentage = Math.abs((time / videoLength) * 100 - 100)

    return (
      <div className="timeline">
        <div className="timeline-bar">
          <div className="progress" style={{ right: `${percentage}%` }} />
        </div>
      </div>
    )
  }
}
