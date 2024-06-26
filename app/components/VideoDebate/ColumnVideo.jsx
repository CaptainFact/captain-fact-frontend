import { Flex } from '@rebass/grid'
import { FileText } from '@styled-icons/feather'
import classNames from 'classnames'
import React from 'react'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { MIN_REPUTATION_ADD_SPEAKER } from '../../constants'
import { videoCaptionsUrl, videoHistoryURL, videoURL } from '../../lib/cf_routes'
import {
  videoDebateOnlineUsersCount,
  videoDebateOnlineViewersCount,
} from '../../state/video_debate/presence/selectors'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import AddSpeakerForm from '../Speakers/AddSpeakerForm'
import { SpeakerPreview } from '../Speakers/SpeakerPreview'
import Container from '../StyledUtils/Container'
import { Icon, LoadingFrame } from '../Utils'
import Message from '../Utils/Message'
import ReputationGuardTooltip from '../Utils/ReputationGuardTooltip'
import Actions from './Actions'
import Presence from './Presence'
import ResizableColumn from './ResizableColumn'
import VideoDebatePlayer from './VideoDebatePlayer'

@connect((state) => ({
  video: state.VideoDebate.video.data,
  isLoading: state.VideoDebate.video.isLoading,
  nbUsers: videoDebateOnlineUsersCount(state),
  nbViewers: videoDebateOnlineViewersCount(state),
}))
@withNamespaces('videoDebate')
@withLoggedInUser
export class ColumnVideo extends React.PureComponent {
  render() {
    const { isLoading } = this.props

    if (isLoading) {
      return <LoadingFrame title={this.props.t('loading.video')} />
    }

    const { video, view, t, isAuthenticated } = this.props
    const { url, title, speakers } = video
    const isDebate = !view || view === 'debate'
    return (
      <ResizableColumn>
        <div id="col-video" className="column">
          <VideoDebatePlayer url={url} />
          <Flex alignItems="center" px={[2, 3]} py={3} className="videoInfo">
            <h2 className="title is-4 has-text-weight-light">{title}</h2>
            <Presence nbUsers={this.props.nbUsers} nbViewers={this.props.nbViewers} />
          </Flex>
          <div className="tabs is-toggle is-fullwidth">
            <ul>
              <li className={classNames({ 'is-active': isDebate })}>
                <Link to={videoURL(video.hash_id)}>
                  <Icon size="small" name="check-circle" />
                  <span>{t('debate')}</span>
                </Link>
              </li>
              <li className={classNames({ 'is-active': view === 'history' })}>
                <Link to={videoHistoryURL(video.hash_id)} rel="nofollow">
                  <Icon size="small" name="history" />
                  <span>{t('history')}</span>
                </Link>
              </li>
              <li className={classNames({ 'is-active': view === 'captions' })}>
                <Link to={videoCaptionsUrl(video.hash_id)} rel="nofollow">
                  <FileText size="20" />
                  &nbsp;
                  <span>{t('captions.title')}</span>
                </Link>
              </li>
            </ul>
          </div>
          {isDebate && (
            <div>
              <Actions />
              <div className="actions">
                <ReputationGuardTooltip
                  requiredRep={MIN_REPUTATION_ADD_SPEAKER}
                  tooltipPosition="top center"
                >
                  {({ hasReputation }) => <AddSpeakerForm disabled={!hasReputation} />}
                </ReputationGuardTooltip>
              </div>
              <div className="speakers-list">
                {speakers.map((speaker) => (
                  <SpeakerPreview key={speaker.id} speaker={speaker} />
                ))}
              </div>
            </div>
          )}
          {view === 'captions' && (
            <Container p={4}>
              <Message>
                {t('captions.description1')}
                {isAuthenticated && (
                  <React.Fragment>
                    <br />
                    {t('captions.description2')}
                  </React.Fragment>
                )}
              </Message>
            </Container>
          )}
        </div>
      </ResizableColumn>
    )
  }
}
