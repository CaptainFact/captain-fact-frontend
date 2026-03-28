import { CheckCircle, FileText, History } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { MIN_REPUTATION_ADD_SPEAKER } from '../../constants'
import { videoCaptionsUrl, videoHistoryURL, videoURL } from '../../lib/cf_routes'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import AddSpeakerForm from '../Speakers/AddSpeakerForm'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { LoadingFrame } from '../Utils/LoadingFrame'
import Message from '../Utils/Message'
import { ReputationGuardTooltip } from '../Utils/ReputationGuardTooltip'
import Actions from './Actions'
import ResizableColumn from './ResizableColumn'
import { SpeakersList } from './SpeakersList'
import VideoDebatePlayer from './VideoDebatePlayer'

const ColumnVideo = ({
  video,
  isLoading,
  view,
  videoSubscriptionIsSubscribed,
  onSetStatementForm,
}) => {
  const { url, speakers = [] } = video || {}
  const isDebate = !view || view === 'debate'
  const { t } = useTranslation('videoDebate')
  const { isAuthenticated } = useLoggedInUser()

  return (
    <ResizableColumn className="max-2xl:!w-full max-2xl:!max-w-full">
      <div id="col-video" className="2xl:h-[--main-height] w-full overflow-y-auto p-0">
        {isLoading ? (
          <LoadingFrame title={t('loading.video')} />
        ) : (
          <React.Fragment>
            {video && <VideoDebatePlayer url={url} />}
            <Tabs value={view}>
              <TabsList className="w-full rounded-none flex-wrap h-auto">
                {video && (
                  <>
                    <Link to={videoURL(video.hashId)} className="flex-1">
                      <TabsTrigger value="debate" className="w-full">
                        <CheckCircle size="1em" />
                        &nbsp;
                        {t('debate')}
                      </TabsTrigger>
                    </Link>
                    <Link to={videoHistoryURL(video.hashId)} className="flex-1">
                      <TabsTrigger value="history" className="w-full">
                        &nbsp;
                        <History size="1em" />
                        &nbsp;
                        {t('history')}
                      </TabsTrigger>
                    </Link>
                    <Link to={videoCaptionsUrl(video.hashId)} className="flex-1">
                      <TabsTrigger value="captions" className="w-full">
                        <FileText size="1em" />
                        &nbsp;
                        {t('captions.title')}
                      </TabsTrigger>
                    </Link>
                  </>
                )}
              </TabsList>
            </Tabs>
            {isDebate && video && (
              <div className="dark:bg-background">
                <Actions
                  video={video}
                  videoSubscriptionIsSubscribed={videoSubscriptionIsSubscribed}
                />
                <div className="p-4 text-sm dark:text-foreground">
                  <ReputationGuardTooltip
                    requiredRep={MIN_REPUTATION_ADD_SPEAKER}
                    tooltipPosition="top"
                  >
                    {({ hasReputation }) => (
                      <AddSpeakerForm disabled={!hasReputation} videoId={video.id} />
                    )}
                  </ReputationGuardTooltip>
                </div>
                <div className="px-3 pb-4 flex flex-col gap-4">
                  <SpeakersList
                    speakers={speakers}
                    videoId={video.id}
                    isAuthenticated={isAuthenticated}
                    onSetStatementForm={onSetStatementForm}
                  />
                </div>
              </div>
            )}
            {view === 'captions' && (
              <div className="p-4 dark:bg-background">
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
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </ResizableColumn>
  )
}

export default ColumnVideo
