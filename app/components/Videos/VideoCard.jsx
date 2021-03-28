import React from 'react'
import { Link } from 'react-router'
import { withNamespaces } from 'react-i18next'

import { Icon, TimeSince } from '../Utils'
import iterateWithSeparators from '../../lib/iterate_with_separators'
import CardLayout from '../Utils/CardLayout'
import RawIcon from '../Utils/RawIcon'
import { videoURL } from '../../lib/cf_routes'
import { MAX_VIDEO_CARD_SPEAKERS } from '../../constants'

@withNamespaces('videoDebate')
export class VideoCard extends React.PureComponent {
  render() {
    const { t, video } = this.props
    const { hash_id, title } = video
    const linkTarget = videoURL(hash_id)

    return (
      <div className="column is-one-quarter">
        <CardLayout
          className="video-card"
          image={
            <Link to={linkTarget}>
              <div className="play-overlay">
                <RawIcon name="play-circle" />
              </div>
              <figure className="image is-16by9">
                <img alt="" src={video.thumbnail} />
              </figure>
            </Link>
          }
          content={
            <Link to={linkTarget}>
              <h4 className="title is-5">{title}</h4>
            </Link>
          }
          footer={this.renderVideoMetadata(video, t)}
        />
      </div>
    )
  }

  renderVideoMetadata({ speakers, insertedAt, isPartner }, t) {
    return (
      <div className="video-metadata">
        <div>
          {this.renderAddedByLabel(isPartner, t)}
          &nbsp;
          <TimeSince time={insertedAt} />
        </div>
        {speakers && speakers.length > 0 && this.renderSpeakersList(speakers, t)}
      </div>
    )
  }

  renderAddedByLabel(isPartner, t) {
    return isPartner ? (
      <span className="added-by">
        <Icon name="star" />
        <strong>{t('video.addedBy', { userType: '$t(video.partner)' })}</strong>
      </span>
    ) : (
      <span className="added-by">
        <Icon name="user" />
        <span>{t('video.addedBy', { userType: '$t(video.user)' })}</span>
      </span>
    )
  }

  renderSpeakersList(speakers, t) {
    const nbOthers = speakers.length - MAX_VIDEO_CARD_SPEAKERS
    const speakerComponentsList = []
    const speakerIterator = iterateWithSeparators(
      speakers,
      Math.min(speakers.length, MAX_VIDEO_CARD_SPEAKERS),
      t,
      nbOthers < 1
    )
    for (const [speaker, separator] of speakerIterator) {
      speakerComponentsList.push(
        <span key={speaker.id}>
          <strong>{this.renderSpeakerName(speaker)}</strong>
          {separator}
        </span>
      )
    }
    if (nbOthers > 0) {
      const title = speakers
        .slice(MAX_VIDEO_CARD_SPEAKERS)
        .map((s) => s.full_name)
        .join(', ')
      speakerComponentsList.push(
        <span key="others">
          &nbsp;
          {t('main:misc.and')}
          &nbsp;
          <span title={title}>
            <strong>{t('main:misc.other', { count: nbOthers })}</strong>
          </span>
        </span>
      )
    }

    return (
      <div className="speakers-list">
        <Icon name="users" />
        {t('main:misc.staring')}
        &nbsp;
        {speakerComponentsList}
      </div>
    )
  }

  renderSpeakerName(speaker) {
    return <Link to={`/s/${speaker.slug || speaker.id}`}>{speaker.full_name}</Link>
  }
}
