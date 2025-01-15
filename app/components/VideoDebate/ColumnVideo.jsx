import { CheckCircle, FileText, History } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
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
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { LoadingFrame } from '../Utils/LoadingFrame'
import Message from '../Utils/Message'
import { ReputationGuardTooltip } from '../Utils/ReputationGuardTooltip'
import Actions from './Actions/Actions'
import Presence from './Presence'
import ResizableColumn from './ResizableColumn'
import VideoDebatePlayer from './VideoDebatePlayer'

@connect((state) => ({
  video: state.VideoDebate.video.data,
  isLoading: state.VideoDebate.video.isLoading,
  nbUsers: videoDebateOnlineUsersCount(state),
  nbViewers: videoDebateOnlineViewersCount(state),
}))
@withTranslation('videoDebate')
@withLoggedInUser
export class ColumnVideo extends React.PureComponent {
  render() {
    const { isLoading } = this.props
    const { video, view, t, isAuthenticated } = this.props
    const { url, speakers } = video || {}
    const isDebate = !view || view === 'debate'

    // We use a full width class on mobile with CSS important
    return (
      <ResizableColumn className="max-2xl:!w-full max-2xl:!max-w-full">
        <div id="col-video" className="2xl:h-[--main-height] w-full overflow-y-auto p-0">
          {isLoading ? (
            <LoadingFrame title={this.props.t('loading.video')} />
          ) : (
            <React.Fragment>
              <VideoDebatePlayer url={url} />
              <div className="hidden items-center px-2 md:px-3 py-3">
                <Presence nbUsers={this.props.nbUsers} nbViewers={this.props.nbViewers} />
              </div>
              <Tabs value={view}>
                <TabsList className="w-full rounded-none flex-wrap h-auto">
                  <Link to={videoURL(video.hash_id)} className="flex-1">
                    <TabsTrigger value="debate" className="w-full">
                      <CheckCircle size="1em" />
                      &nbsp;
                      {t('debate')}
                    </TabsTrigger>
                  </Link>
                  <Link to={videoHistoryURL(video.hash_id)} className="flex-1">
                    <TabsTrigger value="history" className="w-full">
                      &nbsp;
                      <History size="1em" />
                      &nbsp;
                      {t('history')}
                    </TabsTrigger>
                  </Link>
                  <Link to={videoCaptionsUrl(video.hash_id)} className="flex-1">
                    <TabsTrigger value="captions" className="w-full">
                      <FileText size="1em" />
                      &nbsp;
                      {t('captions.title')}
                    </TabsTrigger>
                  </Link>
                </TabsList>
              </Tabs>
              {isDebate && (
                <div>
                  <Actions />
                  <div className="p-4 text-sm">
                    <ReputationGuardTooltip
                      requiredRep={MIN_REPUTATION_ADD_SPEAKER}
                      tooltipPosition="top"
                    >
                      {({ hasReputation }) => <AddSpeakerForm disabled={!hasReputation} />}
                    </ReputationGuardTooltip>
                  </div>
                  <div className="px-3 pb-4 flex flex-col gap-4">
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
                        <br />
                        {t('captions.description2')}
                      </React.Fragment>
                    )}
                  </Message>
                </Container>
              )}
            </React.Fragment>
          )}
        </div>
      </ResizableColumn>
    )
  }
}
