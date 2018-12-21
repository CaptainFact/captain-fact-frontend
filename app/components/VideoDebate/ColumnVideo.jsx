import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withNamespaces } from 'react-i18next'
import { Link } from 'react-router'
import { Box, Flex } from '@rebass/grid'

import { MIN_REPUTATION_ADD_SPEAKER } from '../../constants'
import {
  videoDebateOnlineUsersCount,
  videoDebateOnlineViewersCount
} from '../../state/video_debate/presence/selectors'
import { changeSubscription } from '../../state/video_debate/effects'
import AddSpeakerForm from '../Speakers/AddSpeakerForm'
import { SpeakerPreview } from '../Speakers/SpeakerPreview'
import { LoadingFrame, Icon } from '../Utils'
import ReputationGuardTooltip from '../Utils/ReputationGuardTooltip'
import VideoDebatePlayer from './VideoDebatePlayer'
import Presence from './Presence'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { videoURL, videoHistoryURL } from '../../lib/cf_routes'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import SubscribeBtn from '../Notifications/SubscribeBtn'

@connect(
  state => ({
    video: state.VideoDebate.video.data,
    isLoading: state.VideoDebate.video.isLoading,
    isSubscribed: state.VideoDebate.video.isSubscribed,
    nbUsers: videoDebateOnlineUsersCount(state),
    nbViewers: videoDebateOnlineViewersCount(state)
  }),
  { changeSubscription }
)
@withNamespaces('videoDebate')
@withLoggedInUser
export class ColumnVideo extends React.PureComponent {
  renderNotificationBell() {
    const { isSubscribed, loggedInUser, changeSubscription } = this.props

    // Currently in beta, for experienced users only
    if (loggedInUser.reputation < 300) return null

    return (
      <SubscribeBtn
        size="40px"
        mr={[2, 3]}
        isSubscribed={isSubscribed}
        onChange={changeSubscription}
      />
    )
  }

  render() {
    const { isLoading } = this.props

    if (isLoading) {
      return <LoadingFrame title={this.props.t('loading.video')} />
    }

    const { video, view, t } = this.props
    const { url, title, speakers } = video
    const isDebate = view === 'debate'

    return (
      <div id="col-video" className="column is-5">
        <VideoDebatePlayer url={url} />
        <Flex alignItems="center" px={[2, 3]} py={3} className="videoInfo">
          {this.renderNotificationBell()}
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
            <li className={classNames({ 'is-active': !isDebate })}>
              <Link to={videoHistoryURL(video.hash_id)}>
                <Icon size="small" name="history" />
                <span>{t('history')}</span>
              </Link>
            </li>
            <li>
              <ExternalLinkNewTab href="https://discord.gg/yqFpjgG">
                <Icon size="small" name="comments-o" />
                <span>Chat</span>
              </ExternalLinkNewTab>
            </li>
          </ul>
        </div>
        {isDebate && (
          <div>
            <div className="actions">
              <ReputationGuardTooltip
                requiredRep={MIN_REPUTATION_ADD_SPEAKER}
                tooltipPosition="top center"
              >
                {({ hasReputation }) => <AddSpeakerForm disabled={!hasReputation} />}
              </ReputationGuardTooltip>
            </div>
            <div className="speakers-list">
              {speakers.map(speaker => (
                <SpeakerPreview key={speaker.id} speaker={speaker} />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
}
