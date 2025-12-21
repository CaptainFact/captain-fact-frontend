import { MessageCircle } from 'lucide-react'
import React from 'react'
import { Trans, withTranslation } from 'react-i18next'
import { ExclamationCircle, InfoCircle } from 'styled-icons/fa-solid'

import { getFromLocalStorage, LOCAL_STORAGE_KEYS } from '../../lib/local_storage'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import StatementsListV2 from '../Statements/StatementsListV2'
import { ScrollArea } from '../ui/scroll-area'
import { Skeleton } from '../ui/skeleton'
import DismissableMessage from '../Utils/DismissableMessage'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { LoadingFrame } from '../Utils/LoadingFrame'
import Message from '../Utils/Message'
import ActionBubbleMenuV2 from './ActionBubbleMenuV2'
import CaptionsExtractor from './CaptionsExtractor'
import VideoDebateHistory from './VideoDebateHistory'

const ColumnDebateV2 = ({
  video,
  isLoading,
  view,
  videoId,
  statements,
  statementForm,
  votesMap,
  onSetStatementForm,
  onClearStatementForm,
  onSetScrollTo,
  t,
  isAuthenticated,
}) => {
  const [showIntroduction, setShowIntroduction] = React.useState(
    !getFromLocalStorage(LOCAL_STORAGE_KEYS.DISMISS_VIDEO_INTRODUCTION),
  )

  const hasStatements = statements && statements.length > 0
  const hasSpeakers = video?.speakers && video.speakers.length > 0
  const hasStatementForm = statementForm !== null
  const hasStatementsComponents = hasStatements || hasStatementForm

  const renderInfo = (message) => {
    return (
      <Message>
        <InfoCircle size="1em" />
        &nbsp;&nbsp;{message}
      </Message>
    )
  }

  const renderWarning = (message) => {
    return (
      <Message type="warning" className="mb-6">
        <ExclamationCircle size="1em" />
        &nbsp;&nbsp;{message}
      </Message>
    )
  }

  const renderHelp = () => {
    let helpMessage = ''
    if (!isAuthenticated) {
      helpMessage = t('tips.noContentUnauthenticated')
    } else if (!hasSpeakers) {
      helpMessage = t('tips.firstSpeaker')
    } else {
      helpMessage = (
        <Trans i18nKey="videoDebate:tips.firstStatement" parent="span">
          [Now] <strong>[add]</strong> [click] <MessageCircle size="1em" className="inline" />
          &nbsp;[icon]
        </Trans>
      )
    }

    return renderInfo(helpMessage)
  }

  const renderContent = () => {
    if (view === 'history') {
      return <VideoDebateHistory videoId={videoId} />
    } else if (view === 'captions') {
      return (
        <div className="px-5 sm:px-8 my-4 mx-auto max-w-[1046px]">
          <CaptionsExtractor videoId={videoId} statements={statements} />
        </div>
      )
    } else if (view === 'debate') {
      if (isLoading) {
        return <LoadingFrame title={t('loading.statements')} />
      }

      const hasMessages = video?.unlisted || !hasStatementsComponents
      return (
        <div>
          {hasMessages && (
            <div>
              {video?.unlisted && renderWarning(t('warningUnlisted'))}
              {!hasStatementsComponents && renderHelp()}
            </div>
          )}
          {hasStatementsComponents && (
            <StatementsListV2
              statements={statements}
              speakers={video?.speakers || []}
              statementForm={statementForm}
              offset={video?.youtubeOffset || 0}
              onSetStatementForm={onSetStatementForm}
              onClearStatementForm={onClearStatementForm}
              onSetScrollTo={onSetScrollTo}
              videoId={videoId}
              votesMap={votesMap}
            />
          )}
          <ActionBubbleMenuV2
            video={video}
            hasStatementForm={hasStatementForm}
            hasStatements={hasStatements}
            onSetStatementForm={onSetStatementForm}
            onClearStatementForm={onClearStatementForm}
          />
        </div>
      )
    }
  }

  const renderIntroduction = () => {
    return (
      <DismissableMessage
        localStorageDismissKey={LOCAL_STORAGE_KEYS.DISMISS_VIDEO_INTRODUCTION}
        className="mb-12"
        header={t('introTitle')}
      >
        <p>{t('intro')}</p>
        <ExternalLinkNewTab href="/extension">{t('extensionDL')}</ExternalLinkNewTab>

        <p>
          <br />
          <strong>{t('intro1')}</strong>
        </p>
        <p>
          <strong>{t('intro2')}</strong>
        </p>
        <p>
          <strong>{t('intro3')}</strong>
        </p>
        <p>
          <strong>{t('intro4')}</strong>
          <ExternalLinkNewTab href="/help/privileges">{t('intro5')}</ExternalLinkNewTab>.
        </p>
      </DismissableMessage>
    )
  }

  const renderTitle = () => {
    return (
      <h1 className="text-center text-2xl font-semibold max-w-4xl mx-auto mb-10 pb-8 shadow-[0px_12px_8px_-10px_#e1e1e1] dark:shadow-[0px_12px_8px_-10px_rgba(0,0,0,0.3)] rounded-lg">
        {t('pageTitle')}{' '}
        {video?.title ||
          (isLoading ? <Skeleton className="w-48 h-6 inline-block align-middle ml-3" /> : '...')}
      </h1>
    )
  }

  return (
    <ScrollArea className="w-full bg-neutral-50 dark:bg-background 2xl:h-[--main-height] [&>div>div]:!block 2xl:[&>div>div]:!table">
      <div className="py-12 sm:px-4 px-2 dark:text-foreground">
        {renderTitle()}
        {showIntroduction && view === 'debate' && (
          <div className="mx-6 mt-4">{renderIntroduction()}</div>
        )}
        {renderContent()}
      </div>
    </ScrollArea>
  )
}

export default withTranslation('videoDebate')(withLoggedInUser(ColumnDebateV2))
