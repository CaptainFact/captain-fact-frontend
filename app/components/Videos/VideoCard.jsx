import React from 'react'
import { Link } from 'react-router'
import { translate } from 'react-i18next'

import { Icon, TimeSince } from '../Utils'
import iterateWithSeparators from '../../lib/iterate_with_separators'
import CardLayout from '../Utils/CardLayout'
import RawIcon from '../Utils/RawIcon'


@translate('main')
export class VideoCard extends React.PureComponent {
  render() {
    const { t, video } = this.props
    const { id, title, provider, provider_id } = video

    return (
      <div className="column is-one-quarter">
        <CardLayout
          className="video-card"
          image={(
            <Link to={`/videos/${id}`}>
              <div className="play-overlay">
                <RawIcon name="play-circle"/>
              </div>
              <figure className="image is-16by9">
                <img alt="" src={VideoCard.videoThumb(provider, provider_id)}/>
              </figure>
            </Link>
          )}
          content={(
            <Link to={`/videos/${id}`}>
              <h4 className="title is-5">
                { title }
              </h4>
            </Link>
          )}
          footer={this.renderVideoMetadata(video, t)}
        />
      </div>
    )
  }

  renderVideoMetadata({speakers, posted_at, is_partner}, t) {
    return (
      <div className="video-metadata">
        <div>
          {this.renderAddedByLabel(is_partner, t)}
          &nbsp;
          <TimeSince time={posted_at}/>
        </div>
        {speakers.size > 0 && 
          this.renderSpeakersList(speakers, t)
        }
      </div>
    )
  }

  renderAddedByLabel(is_partner, t) {
    if (is_partner) {
      return (
        <span>
          <Icon name="star" />
          <span>{t('videoDebate:video.addedByParner')}</span>
        </span>
      )
    }
    return (
      <span>
        <Icon name="user" />
        <span>{t('videoDebate:video.addedByUser')}</span>
      </span>
    )
  }

  renderSpeakersList(speakers, t) {
    const speakerComponentsList = []
    const speakerIterator = iterateWithSeparators(speakers, speakers.size, t)
    for (const [speaker, separator] of speakerIterator) {
      speakerComponentsList.push(
        <span key={speaker.id}>
          <strong>{this.renderSpeakerName(speaker)}</strong>
          { separator }
        </span>
      )
    }

    return (
      <div className="speakers-list">
        <Icon name="users"/>
        { t('misc.staring') }
        &nbsp;
        { speakerComponentsList }
      </div>
    )
  }

  renderSpeakerName(speaker) {
    if (!speaker.is_user_defined) {
      return (
        <Link to={`/s/${speaker.slug || speaker.id}`}>
          { speaker.full_name }
        </Link>
      )
    }
    return speaker.full_name
  }

  static videoThumb(provider, provider_id) {
    if (provider === 'youtube') {
      return `https://img.youtube.com/vi/${provider_id}/mqdefault.jpg`
    }
    return ''
  }
}
