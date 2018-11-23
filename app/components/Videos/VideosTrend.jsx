import React from 'react'
import { Link } from 'react-router'
import { withNamespaces } from 'react-i18next'

import { Icon, TimeSince } from '../Utils'
import iterateWithSeparators from '../../lib/iterate_with_separators'
import CardLayout from '../Utils/CardLayout'
import RawIcon from '../Utils/RawIcon'
import { videoURL } from '../../lib/cf_routes'


export class VideosTrend extends React.PureComponent {
  render() {
    const linkTarget = '#'
    const provider = 'youtube'
    const provider_id = 'VzeOnBRzDik'

    return (
      <div className="hide-when-collapsed">
        <CardLayout
          className="video-card"
          image={(
            <Link to={linkTarget}>
              <div className="play-overlay">
                <RawIcon name="play-circle" />
              </div>
              <figure className="image is-16by9">
              <img alt="" src={VideosTrend.videoThumb(provider, provider_id)} />
              </figure>
            </Link>
          )}
          content={(
            <Link to={linkTarget}>
              <h4 className="title is-5">
                Éric Sadin : l'asservissement par l'Intelligence Artificielle ?
              </h4>
            </Link>
          )}
        />
        <CardLayout
          className="video-card"
          image={(
            <Link to={linkTarget}>
              <div className="play-overlay">
                <RawIcon name="play-circle" />
              </div>
              <figure className="image is-16by9">
              <img alt="" src={VideosTrend.videoThumb(provider, provider_id)} />
              </figure>
            </Link>
          )}
          content={(
            <Link to={linkTarget}>
              <h4 className="title is-5">
                Éric Sadin : l'asservissement par l'Intelligence Artificielle ?
              </h4>
            </Link>
          )}
        />
      </div>
    )
  }
  static videoThumb(provider, provider_id) {
    if (provider === 'youtube') {
      return `https://img.youtube.com/vi/${provider_id}/mqdefault.jpg`
    }
    return ''
  }
}
