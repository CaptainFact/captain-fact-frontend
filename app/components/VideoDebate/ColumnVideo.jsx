import React from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { translate } from 'react-i18next'
import { videoDebateOnlineUsersCount, videoDebateOnlineViewersCount } from '../../state/video_debate/presence/selectors'

import { AddSpeakerForm, SpeakerPreview } from "../Speakers"
import { VideoPlayer } from "../Videos"
import { LoadingFrame, Icon } from "../Utils"
import { Link } from 'react-router'
import { isAuthenticated } from "../../state/users/current_user/selectors"
import Presence from './Presence'


@connect(state => ({
  video: state.VideoDebate.video.data,
  isLoading: state.VideoDebate.video.isLoading,
  authenticated: isAuthenticated(state),
  nbUsers: videoDebateOnlineUsersCount(state),
  nbViewers: videoDebateOnlineViewersCount(state),
}))
@translate('videoDebate')
export class ColumnVideo extends React.PureComponent {
  render() {
    if (this.props.isLoading)
      return <LoadingFrame title={this.props.t('loading.video')}/>

    const { video, authenticated, view, t } = this.props
    const { url, title, speakers } = video
    return (
      <div id="col-video" className="column is-5">
        <VideoPlayer url={url}/>
        <div className="videoInfo">
          <h2 className="title is-4">{title}</h2>
          <Presence nbUsers={this.props.nbUsers} nbViewers={this.props.nbViewers}/>
        </div>
        <div className="tabs is-toggle is-fullwidth">
          <ul>
            <li className={classNames({'is-active': view === "debate"})}>
              <Link to={`/videos/${video.id}`}>
                <Icon size="small" name="comments-o"/>
                <span>{ t('debate') }</span>
              </Link>
            </li>
            <li className={classNames({'is-active': view === "history"})}>
              <Link to={`/videos/${video.id}/history`}>
                <Icon size="small" name="history"/>
                <span>{ t('history') }</span>
              </Link>
            </li>
          </ul>
        </div>
        {authenticated &&
        <div className="actions">
          <AddSpeakerForm/>
        </div>
        }
        <div className="speakers-list">
          {speakers.map(speaker =>
            <SpeakerPreview key={speaker.id} speaker={speaker}/>
          )}
        </div>
      </div>
    )
  }
}
