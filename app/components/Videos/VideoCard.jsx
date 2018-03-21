import React from "react"
import { Link } from 'react-router'

import { Icon, TimeSince } from "../Utils"
import iterateWithSeparators from '../../lib/iterate_with_separators'
import { translate } from 'react-i18next'
import CardLayout from '../Utils/CardLayout'


@translate('main')
export class VideoCard extends React.PureComponent {
  static videoThumb(provider, provider_id) {
    if (provider === "youtube")
    return `https://img.youtube.com/vi/${provider_id}/mqdefault.jpg`
  }

  renderSpeakers(speakers) {
    const speakerComponentsList = []
    for (let [speaker, separator] of iterateWithSeparators(speakers, speakers.size, this.props.t))
      speakerComponentsList.push(
        <span key={ speaker.id }>
          <strong>
            {!speaker.is_user_defined && <Link to={`/s/${speaker.slug || speaker.id}`}>{ speaker.full_name }</Link>}
            {speaker.is_user_defined && speaker.full_name }
          </strong>
          { separator }
        </span>
      )
    return (
      <div className="speakers-list">
        <Icon name="users"/>
        { this.props.t('misc.staring') }
        &nbsp;
        { speakerComponentsList }
      </div>
    )

  }

  render() {
    const { id, title, posted_at, speakers, provider, provider_id } = this.props.video

    return (
      <div className={`column is-one-quarter`}>
        <CardLayout
          className="video-card"
          image={
            <Link to={`/videos/${id}`}>
              <div className="play-overlay">
                <Icon name="play-circle" withContainer={false}/>
              </div>
              <figure className="image is-16by9">
                <img src={VideoCard.videoThumb(provider, provider_id)}/>
              </figure>
            </Link>
          }
          content={
            <Link to={`/videos/${id}`}>
              <h4 className="title is-5">
                { title }
              </h4>
            </Link>
          }
          footer={
            <div className="video-metadata">
              <div>
                <Icon name="clock-o" size="small"/>
                <span>{this.props.t('videoDebate:video.added')} </span>
                <TimeSince time={posted_at}/>
              </div>
              {speakers.size > 0 && this.renderSpeakers(speakers)}
            </div>
          }
        />
      </div>
    )}
}
