import React from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { translate } from 'react-i18next'
import { Link } from 'react-router'

import { MIN_REPUTATION_ADD_SPEAKER } from '../../constants'
import { videoDebateOnlineUsersCount, videoDebateOnlineViewersCount } from '../../state/video_debate/presence/selectors'
import { AddSpeakerForm, SpeakerPreview } from "../Speakers"
import { LoadingFrame, Icon } from "../Utils"
import ReputationGuard from '../Utils/ReputationGuard'
import VideoDebatePlayer from './VideoDebatePlayer'
import Presence from './Presence'


@connect(state => ({
  video: state.VideoDebate.video.data,
  isLoading: state.VideoDebate.video.isLoading,
  nbUsers: videoDebateOnlineUsersCount(state),
  nbViewers: videoDebateOnlineViewersCount(state),
}))
@translate('videoDebate')
export class ColumnVideo extends React.PureComponent {
  render() {
    if (this.props.isLoading)
      return <LoadingFrame title={this.props.t('loading.video')}/>

    const { video, view, t } = this.props
    const { url, title, speakers } = video
    const isDebate = view === "debate"

    return (
      <div id="col-video" className="column is-5">
        <VideoDebatePlayer url={url}/>
        <div className="videoInfo">
          <h2 className="title is-4 has-text-weight-light">{title}</h2>
          <Presence nbUsers={this.props.nbUsers} nbViewers={this.props.nbViewers}/>
        </div>
        <div className="tabs is-toggle is-fullwidth">
          <ul>
            <li className={classNames({'is-active': isDebate})}>
              <Link to={`/videos/${video.id}`}>
                <Icon size="small" name="comments-o"/>
                <span>{ t('debate') }</span>
              </Link>
            </li>
            <li className={classNames({'is-active': !isDebate})}>
              <Link to={`/videos/${video.id}/history`}>
                <Icon size="small" name="history"/>
                <span>{ t('history') }</span>
              </Link>
            </li>
          </ul>
        </div>
        {isDebate &&
          <div>
            <ReputationGuard requiredRep={MIN_REPUTATION_ADD_SPEAKER}>
              <div className="actions">
                <AddSpeakerForm/>
              </div>
            </ReputationGuard>
            <div className="speakers-list">
              {speakers.map(speaker =>
                <SpeakerPreview key={speaker.id} speaker={speaker}/>
              )}
            </div>
          </div>
        }
      </div>
    )
  }
}
