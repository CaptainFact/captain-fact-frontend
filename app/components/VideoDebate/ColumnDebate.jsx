import React from 'react'
import { Trans, withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { InfoCircle } from 'styled-icons/fa-solid'
import { ExclamationCircle } from 'styled-icons/fa-solid'

import { getFromLocalStorage, LOCAL_STORAGE_KEYS } from '../../lib/local_storage'
import { isLoadingVideoDebate } from '../../state/video_debate/selectors'
import { hasStatementForm } from '../../state/video_debate/statements/selectors'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import StatementsList from '../Statements/StatementsList'
import Container from '../StyledUtils/Container'
import DismissableMessage from '../Utils/DismissableMessage'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { Icon } from '../Utils/Icon'
import { LoadingFrame } from '../Utils/LoadingFrame'
import Message from '../Utils/Message'
import ActionBubbleMenu from './ActionBubbleMenu'
import CaptionsExtractor from './CaptionsExtractor'
import VideoDebateHistory from './VideoDebateHistory'

const TitleContainer = styled.div`
  padding: 1.5rem;
  margin-top: 1.5rem;
`
const TitleH1 = styled.h1`
  color: #0a0a0a;
  line-height: 140%;
  font-family: Merriweather, serif;
  font-size: 1.7rem;
  margin: 0 auto;
  max-width: 980px;
`

@connect((state) => ({
  isLoading: isLoadingVideoDebate(state),
  hasStatements: state.VideoDebate.statements.data.size !== 0,
  hasSpeakers: state.VideoDebate.video.data.speakers.size !== 0,
  hasStatementForm: hasStatementForm(state),
  unlisted: state.VideoDebate.video.data.unlisted,
  videoTitle: state.VideoDebate.video.data.title,
}))
@withNamespaces('videoDebate')
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
    } else if (view === 'captions') {
      return (
        <Container px={['20px', '32px']} my={4} mx="auto" maxWidth="1046px">
          <CaptionsExtractor videoId={videoId} />
        </Container>
      )
    } else if (view === 'debate') {
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

  renderIntroduction() {
    const { t } = this.props
    return (
      <DismissableMessage
        localStorageDismissKey={LOCAL_STORAGE_KEYS.DISMISS_VIDEO_INTRODUCTION}
        className="introduction"
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
    const { t, videoTitle } = this.props

    return (
      <TitleContainer>
        <TitleH1>{`${t('pageTitle')} ${videoTitle}`}</TitleH1>
      </TitleContainer>
    )
  }

  render() {
    return (
      <div id="col-debate" className="column">
        {this.state.showIntroduction && this.renderIntroduction()}
        {this.renderTitle()}
        {this.renderContent()}
      </div>
    )
  }
}
