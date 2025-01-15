import { MessageCircle } from 'lucide-react'
import React from 'react'
import { Trans, withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { ExclamationCircle, InfoCircle } from 'styled-icons/fa-solid'

import { getFromLocalStorage, LOCAL_STORAGE_KEYS } from '../../lib/local_storage'
import { isLoadingVideoDebate } from '../../state/video_debate/selectors'
import { hasStatementForm } from '../../state/video_debate/statements/selectors'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import StatementsList from '../Statements/StatementsList'
import { ScrollArea } from '../ui/scroll-area'
import { Skeleton } from '../ui/skeleton'
import DismissableMessage from '../Utils/DismissableMessage'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { LoadingFrame } from '../Utils/LoadingFrame'
import Message from '../Utils/Message'
import ActionBubbleMenu from './ActionBubbleMenu'
import CaptionsExtractor from './CaptionsExtractor'
import VideoDebateHistory from './VideoDebateHistory'

@connect((state) => ({
  isLoading: isLoadingVideoDebate(state),
  hasStatements: state.VideoDebate.statements.data.size !== 0,
  hasSpeakers: state.VideoDebate.video.data.speakers.size !== 0,
  hasStatementForm: hasStatementForm(state),
  unlisted: state.VideoDebate.video.data.unlisted,
  videoTitle: state.VideoDebate.video.data.title,
}))
@withTranslation('videoDebate')
@withLoggedInUser
export class ColumnDebate extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showIntroduction: !getFromLocalStorage(LOCAL_STORAGE_KEYS.DISMISS_VIDEO_INTRODUCTION),
    }
  }

  renderInfo(message) {
    return (
      <Message>
        <InfoCircle size="1em" />
        &nbsp;&nbsp;{message}
      </Message>
    )
  }

  renderWarning(message) {
    return (
      <Message type="warning">
        <ExclamationCircle size="1em" />
        &nbsp;&nbsp;{message}
      </Message>
    )
  }

  renderHelp() {
    const { hasSpeakers, isAuthenticated, t } = this.props
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

    return this.renderInfo(helpMessage)
  }

  renderContent() {
    const { isLoading, view, videoId, hasStatements } = this.props

    if (view === 'history') {
      return <VideoDebateHistory videoId={videoId} />
    } else if (view === 'captions') {
      return (
        <div className="px-5 sm:px-8 my-4 mx-auto max-w-[1046px]">
          <CaptionsExtractor videoId={videoId} />
        </div>
      )
    } else if (view === 'debate') {
      if (isLoading) {
        return <LoadingFrame title={this.props.t('loading.statements')} />
      }

      const hasStatementsComponents = hasStatements || this.props.hasStatementForm
      const hasMessages = this.props.unlisted || !hasStatementsComponents
      return (
        <div>
          {hasMessages && (
            <div>
              {this.props.unlisted && this.renderWarning(this.props.t('warningUnlisted'))}
              {!hasStatementsComponents && this.renderHelp()}
            </div>
          )}
          {hasStatementsComponents && <StatementsList />}
          <ActionBubbleMenu />
        </div>
      )
    }
  }

  renderIntroduction() {
    const { t } = this.props
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

  renderTitle() {
    const { t, videoTitle, isLoading } = this.props
    return (
      <h1 className="text-center text-2xl font-semibold max-w-4xl mx-auto mb-10 pb-8 shadow-[0px_12px_8px_-10px_#e1e1e1] rounded-lg">
        {t('pageTitle')}{' '}
        {videoTitle ||
          (isLoading ? <Skeleton className="w-48 h-6 inline-block align-middle ml-3" /> : '...')}
      </h1>
    )
  }

  render() {
    return (
      <ScrollArea className="w-full bg-neutral-50 2xl:h-[--main-height] [&>div>div]:!block 2xl:[&>div>div]:!table">
        <div className="py-12 sm:px-4 px-2">
          {this.renderTitle()}
          {this.state.showIntroduction && (
            <div className="mx-6 mt-4">{this.renderIntroduction()}</div>
          )}
          {this.renderContent()}
        </div>
      </ScrollArea>
    )
  }
}
