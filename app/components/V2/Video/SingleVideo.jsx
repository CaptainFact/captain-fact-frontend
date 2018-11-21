import React from 'react'
import quote from '../../../assets/V2/quote.png'
import fakeVideos from './fakevideos'

export class SingleVideo extends React.PureComponent {
  getVideo() {
    return fakeVideos[this.props.routeParams.videoId - 1]
  }

  render() {
    return <div>{this.getVideo().title}</div>
  }
}

export default SingleVideo
