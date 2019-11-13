import React from 'react'
import { connect } from 'react-redux'
import { Trans, withNamespaces } from 'react-i18next'

import { InfoCircle } from 'styled-icons/fa-solid/InfoCircle'
import { ExclamationCircle } from 'styled-icons/fa-solid/ExclamationCircle'

import { isLoadingVideoDebate } from '../../state/video_debate/selectors'
import VideoDebateHistory from './VideoDebateHistory'
import ActionBubbleMenu from './ActionBubbleMenu'
import StatementsList from '../Statements/StatementsList'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { hasStatementForm } from '../../state/video_debate/statements/selectors'
import { Icon } from '../Utils/Icon'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import Message from '../Utils/Message'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import {
  getFromLocalStorage,
  LOCAL_STORAGE_KEYS,
  setLocalStorage
} from '../../lib/local_storage'

@connect(state => ({
  isLoading: isLoadingVideoDebate(state),
  hasStatements: state.VideoDebate.statements.data.size !== 0,
  hasSpeakers: state.VideoDebate.video.data.speakers.size !== 0,
  hasStatementForm: hasStatementForm(state),
  unlisted: state.VideoDebate.video.data.unlisted
}))
@withNamespaces('videoDebate')
@withLoggedInUser
export class ColumnDebate extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showIntroduction: !getFromLocalStorage(
        LOCAL_STORAGE_KEYS.DISMISS_VIDEO_INTRODUCTION
      )
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
        <Trans i18nKey="tips.firstStatement" parent="span">
          [Now] <strong>[add]</strong> [click] <Icon name="commenting-o" />
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
    }
    if (view === 'debate') {
      if (isLoading) {
        return <LoadingFrame title={this.props.t('loading.statements')} />
      }

      const hasStatementsComponents = hasStatements || this.props.hasStatementForm
      const hasMessages = this.props.unlisted || !hasStatementsComponents
      return (
        <div className="statements-list-container">
          {hasMessages && (
            <div className="video-debate-help">
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

  dismissHelp = () => {
    setLocalStorage(LOCAL_STORAGE_KEYS.DISMISS_VIDEO_INTRODUCTION, true)
    this.setState({ showIntroduction: false })
  }

  renderIntroduction() {
    const { t } = this.props
    return (
      <Message
        className="introduction"
        header={t('introTitle')}
        onClose={this.dismissHelp}
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
      </Message>
    )
  }

  render() {
    return (
      <div id="col-debate" className="column">
        {this.state.showIntroduction && this.renderIntroduction()}
        {this.renderContent()}
      </div>
    )
  }
}
