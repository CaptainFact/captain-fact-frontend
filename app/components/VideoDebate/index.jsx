import React from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { formValueSelector, reset } from 'redux-form'
import { translate } from 'react-i18next'

import { StatementForm, Statement } from "../Statements"
import { AddSpeakerForm, SpeakerPreview } from "../Speakers"
import { VideoPlayer } from "../Videos"
import { LoadingFrame, ErrorView, Icon } from "../Utils"
import {Link, withRouter} from 'react-router'
import History from "./History"
import { isAuthenticated } from "../../state/users/current_user/selectors"
import { joinCommentsChannel, leaveCommentsChannel } from '../../state/video_debate/comments/effects'
import {
  joinStatementsChannel, leaveStatementsChannel, postStatement
} from '../../state/video_debate/statements/effects'
import { setPosition, reset as resetVideo } from '../../state/video_debate/video/reducer'
import { joinVideoDebateChannel, leaveVideoDebateChannel } from '../../state/video_debate/effects'
import {closeStatementForm, setScrollTo} from '../../state/video_debate/statements/reducer'
import ActionBubbleMenu from './ActionBubbleMenu'


// TODO Refactor this giant octopus. Video column can be split in a different component

const statementFormSelector = formValueSelector('StatementForm')


@connect(state => ({
  video: state.VideoDebate.video.data,
  isLoadingVideo: state.VideoDebate.video.isLoading,
  videoErrors: state.VideoDebate.video.errors,
  statements: state.VideoDebate.statements.data,
  isLoadingStatements: state.VideoDebate.statements.isLoading,
  playback: state.VideoDebate.playback,
  statementFormSpeakerId: statementFormSelector(state, 'speaker_id'),
  currentView: state.VideoDebate.currentView,
  authenticated: isAuthenticated(state)
}), {
  joinCommentsChannel, leaveCommentsChannel, joinStatementsChannel, leaveStatementsChannel,
  joinVideoDebateChannel, leaveVideoDebateChannel,
  resetVideo, postStatement, setPosition, reset, closeStatementForm, setScrollTo
})
@translate('videoDebate')
@withRouter
export class VideoDebate extends React.PureComponent {
  componentDidMount() {
    // Join channels
    const { videoId } = this.props.params
    if (videoId) {
      this.props.joinVideoDebateChannel(videoId)
      this.props.joinStatementsChannel(videoId)
      this.props.joinCommentsChannel(videoId)
    }

    if (this.props.location.query.statement) {
      this.props.setScrollTo({id: parseInt(this.props.location.query.statement)})
    }
  }

  componentWillUnmount() {
    this.props.leaveCommentsChannel()
    this.props.leaveStatementsChannel()
    this.props.leaveVideoDebateChannel()
    this.props.resetVideo()
  }

  renderStatements() {
    if (this.props.isLoadingStatements) return (
      <div className="statements-list">
        <LoadingFrame title={this.props.t('loading.statements')}/>
      </div>
    )
    const {statementFormSpeakerId, statements} = this.props
    return (
      <div className="statements-list">
        <ActionBubbleMenu/>
        {statementFormSpeakerId !== undefined &&
          <StatementForm
            initialValues={{speaker_id: statementFormSpeakerId}}
            enableReinitialize={true}
            keepDirtyOnReinitialize={true}
            handleAbort={() => this.props.closeStatementForm()}
            handleConfirm={s => this.props.postStatement(s).then(
              e => {if (!e.error) this.props.closeStatementForm(); return e;}
            )}/>
        }
        {statements.map((statement) => (
          <Statement key={statement.id} statement={statement}/>
        ))}
      </div>
    )
  }

  renderColVideo() {
    if (this.props.isLoadingVideo)
      return <LoadingFrame title={this.props.t('loading.video')}/>
    const { video, authenticated, route, t } = this.props
    const { url, title, speakers } = video

    return (
      <div id="col-video" className="column is-4">
        <VideoPlayer url={url}/>
        <h3 className="title is-4">{title}</h3>
          <div className="tabs is-toggle is-fullwidth">
            <ul>
              <li className={classNames({'is-active': route.view === "debate"})}>
                <Link to={`/videos/${video.id}`}>
                  <Icon size="small" name="comments-o"/>
                  <span>{ t('debate') }</span>
                </Link>
              </li>
              <li className={classNames({'is-active': route.view === "history"})}>
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
            {speakers.map((speaker) => (
              <SpeakerPreview key={speaker.id} speaker={speaker}/>
            ))}
          </div>
      </div>
    )
  }

  renderHelp() {
    const {video: {speakers}, authenticated} = this.props
    if (authenticated)
      var helpMessage = speakers.size === 0 ?
        (
          <span>
            Start by <strong>adding the first speaker</strong>
          </span>
        ) :
        (
          <span>
            Now <strong>add your first statement</strong> by clicking on the <Icon name="commenting-o"/>
          &nbsp;icon next to the speaker's name
          </span>
        )
    else
      var helpMessage = "This video doesn't have any statement yet"
    return (
      <div className="video-debate-help">
        <article className="message is-info">
          <div className="message-body">
            <Icon name="info-circle"/>&nbsp;{helpMessage}
          </div>
        </article>
      </div>
    )
  }

  render() {
    const { statements, statementFormSpeaker, isLoadingVideo } = this.props
    const { isLoadingStatements, videoErrors, params, route } = this.props
    if (videoErrors) return <ErrorView error={videoErrors}/>

    if (!isLoadingVideo && !isLoadingStatements && statements.size === 0 &&
      statementFormSpeaker === null && params.videoId)
        var colStatementsContent = this.renderHelp()
    else if (params.videoId)
      var colStatementsContent = this.renderStatements()
    else
      return <ErrorView error="not_found"/>

    return (
      <div id="video-show" className="columns is-gapless">
        {this.renderColVideo()}
        <div id="col-debate" className="column">
          {route.view === "debate" &&
            <div className="statements-list-container">
              {colStatementsContent}
            </div>
          }
          {route.view === "history" &&
            <History videoId={ this.props.params.videoId }/>
          }
        </div>
      </div>
    )
  }
}
